import prisma from "@/lib/prisma";
import { checkAuth } from "@/module/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAuth();
    if (!auth.success) {
      return NextResponse.json({
        success: false,
        error: auth.error
      }, { status: Number(auth.status) || 401 });
    }
    
    const { id } = await params;
    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Invalid id"
      }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            chapter: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        enrollments: {
          where: {
            userId: auth.data?.id
          }
        },
        instructors: {
          include: {
            instructor: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({
        success: false,
        error: "Course not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error("Course API Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    }, { status: 500 });
  }
}
