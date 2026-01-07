import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { checkAuth, checkAuthOwner } from "@/module/auth/actions";
import { createInstructorSchema } from "@/module/instructor/types/instructor";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const searchQuery = searchParams.get("search") || "";


    const authCheck = await checkAuth();
    if (!authCheck.success) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: Number(authCheck.status) }
      );
    }

    const skip = (page - 1) * limit;

    const where: Prisma.InstructorWhereInput = {};

    if (searchQuery.trim()) {
      where.OR = [
        { id: { contains: searchQuery, mode: "insensitive" } },
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
        { expertise: { hasSome: [searchQuery] } },
      ];
    }

    const totalInstructors = await prisma.instructor.count({
      where,
    });

    const totalPages = Math.ceil(totalInstructors / limit);


    const instructors = await prisma.instructor.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: instructors,
        total: totalInstructors,
        totalPages,
        currentPage: page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const checkOwner = await checkAuthOwner();
    if (!checkOwner.success) {
      return NextResponse.json(
        { success: false, error: checkOwner.error },
        { status: Number(checkOwner.status) }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;
    const expertiseRaw = formData.get("expertise") as string;
    const avatar = formData.get("avatar") as File | null;

    const expertise = expertiseRaw ? JSON.parse(expertiseRaw) : [];

    const validResult = createInstructorSchema.safeParse({
      name,
      email,
      bio,
      expertise,
    });

    if (!validResult.success) {
      return NextResponse.json(
        { success: false, error: validResult.error.message },
        { status: 400 }
      );
    }

    let avatarUrl: string | null = null;
    let avatarFileId: string | null = null;

    if (avatar) {
      const buffer = Buffer.from(await avatar.arrayBuffer());

      const uploadRes = await imagekit.upload({
        file: buffer,
        fileName: `${name}-avatar`,
        folder: "/instructors/images",
        useUniqueFileName: true,
      });

      avatarUrl = uploadRes.url;
      avatarFileId = uploadRes.fileId;
    }

    const instructor = await prisma.instructor.create({
      data: {
        name,
        email,
        bio,
        expertise,
        avatarUrl,
        avatarFileId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${instructor.name} created successfully!`,
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


export async function DELETE(request: NextRequest) {
  try {

    const checkOwner = await checkAuthOwner();
    if(!checkOwner.success) return NextResponse.json({
      success: false,
      error: checkOwner.error
    }, {status: +checkOwner.status})

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get('id')

    if (!instructorId || typeof instructorId !== "string") { 
      return NextResponse.json({
        success: false,
        error: "Instructor ID is required"
      }, {status: 404})
    }

    const instructor = await prisma.instructor.findUnique({
      where: {id: instructorId}
    })

    if(!instructor) return NextResponse.json({
      success: false,
      error: "Instructor not found"
    }, {status: 404})

    if(instructor.avatarFileId) {
      try {
        await imagekit.deleteFile(instructor.avatarFileId)
      } catch (err) {
        console.error("Image delete failed:", err);
      }
    }

    await prisma.instructor.delete({
      where: {id: instructorId}
    })

    return NextResponse.json({
      success: true,
      message: `${instructor.name} deleted successfully`
    }, {status: 200})

    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      {status: 500}
    )
  }
}


