import prisma from "@/lib/prisma";
import { checkAuth, checkAuthOwner } from "@/module/auth/actions";
import { createModuleSchema } from "@/module/course/( course )/schema";
import { ApiResponse } from "@/types";
import { ModuleType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuth()
    if (!auth.success) {
      return NextResponse.json({
        success: false,
        error: auth.error,
      }, { status: Number(auth.status) || 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 100) // ✅ Max 100
    const search = searchParams.get("search")?.trim() || ""
    const courseId = searchParams.get("courseId")

    if (page < 1 || limit < 1) {
      return NextResponse.json({
        success: false,
        error: "Invalid page or limit",
      }, { status: 400 })
    }

    const skip = (page - 1) * limit

    const where: Prisma.ModuleWhereInput = {}
    
    if (courseId) {
      where.courseId = courseId
    }

    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { order: { equals: Number(search) } },
        { type: search as ModuleType }, // Prisma enum
      ]
    }

    const [totalModules, modules] = await prisma.$transaction([
      prisma.module.count({ where }),
      prisma.module.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "desc" }
      })
    ])

    const totalPages = Math.ceil(totalModules / limit)


    return NextResponse.json({
      success: true,
      message: `${modules.length} modules fetched successfully`,
      data: modules,
      total: totalModules,
      totalPages,
      currentPage: page,
      limit,
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 })
  }
}


export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success)
      return NextResponse.json(
        {
          success: auth.success,
          error: auth.error,
        },
        { status: +auth.status || 401 }
      );

    const formData = await request.formData();
    const rowData = Object.fromEntries(formData.entries());

    const validResult = createModuleSchema.safeParse(rowData);
    if (!validResult.success)
      return NextResponse.json(
        {
          success: false,
          error: validResult.error.name,
          fieldErrors: validResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );

    const createModule = await prisma.module.create({
      data: validResult.data,
    });

    if (!createModule)
      return NextResponse.json(
        {
          success: false,
          error: "Module not created",
        },
        { status: 500 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Module created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
