import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: Number(auth.status) || 401 }
      );
    }

    const [courses, students] = await prisma.$transaction([
      prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          price: true,
          createdAt: true,
          thumbnailUrl: true,
          bannerUrl: true
        },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { courses, students },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard GET Error:", error); // 👀 debug help

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
