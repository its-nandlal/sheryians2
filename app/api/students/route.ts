import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
  try {

    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error || "Unauthorized Request",
    }, { status: +auth.status || 401  })

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 20
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit
    const where: Prisma.UserWhereInput = {
      role: "STUDENT"
    }

    if(search.trim()){
      where.OR = [
        {id: {contains: search, mode: "insensitive"}},
        {name: {contains: search, mode: "insensitive"}},
        {email: {contains: search, mode: "insensitive"}},
      ]
    }

    const [totalStudents, students, graphData] = await prisma.$transaction([
      prisma.user.count({where}),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {createdAt: "desc"}
      }),
      prisma.user.findMany({
        where: {role: "STUDENT"}
      })
    ])

    const totalPages = Math.ceil(totalStudents / limit)

    return NextResponse.json({
      success: true,
      message: `${students.length} students fetched successfully`,
      data: students,
      total: totalStudents,
      totalPages,
      currentPage: page,
      limit,
      graphData
    }, { status: 200 })

     
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 })
  }
}