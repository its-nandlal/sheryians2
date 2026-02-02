import prisma from "@/lib/prisma"
import { checkAuth } from "@/module/auth/actions"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const auth = await checkAuth()

    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: Number(auth.status) || 401 }
      )
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: auth.data!.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    })

    const course = enrollments.map((e)=> e.course)

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
        course
      },
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    )
  }
}
