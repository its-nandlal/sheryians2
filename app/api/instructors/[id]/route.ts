import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { createInstructorSchema } from "@/module/instructor/types/instructor";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{id: string}> }
) {
  try {
    const {id} = await params;
        const instructorId = id

    const ownerAuth = await checkAuthOwner();
    if (!ownerAuth.success) {
      return NextResponse.json(
        { success: false, error: ownerAuth.error },
        { status: Number(ownerAuth.status) }
      );
    }

    const existingInstructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!existingInstructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const bio = formData.get("bio") as string | null;
    const expertiseRaw = formData.get("expertise") as string | null;
    const avatar = formData.get("avatar") as File | null;

    const expertise = expertiseRaw ? JSON.parse(expertiseRaw) : undefined;

    const validation = createInstructorSchema
      .partial()
      .safeParse({ name, email, bio, expertise });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.message },
        { status: 400 }
      );
    }

    const updateData: Record<string, string | number | string[]> = {};

    if (name && name !== existingInstructor.name) {
      updateData.name = name;
    }

    if (email && email !== existingInstructor.email) {
      updateData.email = email;
    }

    if (bio !== null && bio !== existingInstructor.bio) {
      updateData.bio = bio;
    }

    if (
      expertise &&
      JSON.stringify(expertise) !==
        JSON.stringify(existingInstructor.expertise)
    ) {
      updateData.expertise = expertise;
    }

    if (avatar) {
      // delete old image
      if (existingInstructor.avatarFileId) {
        await imagekit.deleteFile(existingInstructor.avatarFileId);
      }

      const buffer = Buffer.from(await avatar.arrayBuffer());

      const uploadRes = await imagekit.upload({
        file: buffer,
        fileName: `${existingInstructor.name}-avatar`,
        folder: "/instructors/images",
        useUniqueFileName: true,
      });

      updateData.avatarUrl = uploadRes.url;
      updateData.avatarFileId = uploadRes.fileId;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No changes detected",
        },
        { status: 200 }
      );
    }

    const instructor = await prisma.instructor.update({
      where: { id: instructorId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${instructor.name} updated successfully`,
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


export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const instructorId = id

    const checkOwner = await checkAuthOwner();
    if(!checkOwner.success) return NextResponse.json({
      success: false,
      error: checkOwner.error
    }, {status: +checkOwner.status})


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