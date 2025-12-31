import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { MediaService } from "@/lib/services/media-service"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// GET single instructor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ✅ Await params

    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: instructor,
    })
  } catch (error) {
    console.error("GET instructor error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch instructor" },
      { status: 500 }
    )
  }
}

// PATCH update instructor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ✅ Await params

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || (session.user as unknown as { role: string }).role !== "OWNER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Check if instructor exists
    const existingInstructor = await prisma.instructor.findUnique({
      where: { id },
    })

    if (!existingInstructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      )
    }

    // Update instructor
    const instructor = await prisma.instructor.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: instructor,
      message: "Instructor updated successfully",
    })
  } catch (error) {
    console.error("PATCH instructor error:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update instructor" },
      { status: 500 }
    )
  }
}

// DELETE instructor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // ✅ Await params

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || (session.user as unknown as { role: string }).role !== "OWNER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get instructor with courses count
    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    })

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      )
    }

    if (instructor._count.courses > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete instructor with active courses",
        },
        { status: 400 }
      )
    }

    // Delete associated media file
    if (instructor.avatarFileId) {
      await MediaService.deleteMediaFile(instructor.avatarFileId).catch(
        (error) => {
          console.error("Failed to delete media file:", error)
        }
      )
    }

    // Delete instructor
    await prisma.instructor.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Instructor deleted successfully",
    })
  } catch (error) {
    console.error("DELETE instructor error:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
