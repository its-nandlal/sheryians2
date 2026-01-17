import { uploadImages } from "@/actions";
import { getEqualFields } from "@/lib/helper/compair-data";
import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { checkAuth, checkAuthOwner } from "@/module/auth/actions";
import { createCourseSchema } from "@/module/course/( course )/schema";
import { console } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const authCheck = await checkAuth();
    if (!authCheck.success)
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error,
        },
        { status: +authCheck.status }
      );

    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course)
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Course fetched successfully",
        data: course,
      },
      { status: 201 }
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    /* ---------------- AUTH ---------------- */
    const auth = await checkAuthOwner();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: +auth.status || 401 }
      );
    }

    /* ---------------- COURSE ---------------- */
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    /* ---------------- FORM DATA ---------------- */
    const formData = await request.formData();
    const rowData = Object.fromEntries(formData.entries());

    /* ✅ SAFE FILE EXTRACTION */
    const thumbnailFile =
      formData.get("thumbnail") instanceof File
        ? (formData.get("thumbnail") as File)
        : null;

    const bannerFile =
      formData.get("banner") instanceof File
        ? (formData.get("banner") as File)
        : null;

    /* ---------------- VALIDATION ---------------- */
    const validResult = createCourseSchema.safeParse({
      ...rowData,
      price: Number(rowData.price),
      discountedPrice: Number(rowData.discountedPrice),
      tags: formData.getAll("tags[]"),
      metaKeywords: formData.getAll("metaKeywords[]"),
    });

    if (!validResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validResult.error.message,
          fieldErrors: validResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validResult.data;

    /* ---------------- IMAGE UPDATE DATA ---------------- */
    const imageUpdateData: {
      thumbnailUrl?: string;
      thumbnailFileId?: string;
      bannerUrl?: string;
      bannerFileId?: string;
    } = {};

    /* OLD IDS (DELETE AFTER SUCCESS) */
    const oldThumbnailId = existingCourse.thumbnailFileId;
    const oldBannerId = existingCourse.bannerFileId;

    /* ---------------- UPLOAD IMAGES ---------------- */
    if (thumbnailFile && thumbnailFile.size > 0) {
      const upload = await uploadImages(thumbnailFile, {
        key: "thumbnail",
        folder: "/courses/thumbnails",
      });

      if (!upload) {
        return NextResponse.json(
          { success: false, error: "Thumbnail upload failed" },
          { status: 500 }
        );
      }

      imageUpdateData.thumbnailUrl = upload.url;
      imageUpdateData.thumbnailFileId = upload.fileId;
    }

    if (bannerFile && bannerFile.size > 0) {
      const upload = await uploadImages(bannerFile, {
        key: "banner",
        folder: "/courses/banners",
      });

      if (!upload) {
        return NextResponse.json(
          { success: false, error: "Banner upload failed" },
          { status: 500 }
        );
      }

      imageUpdateData.bannerUrl = upload.url;
      imageUpdateData.bannerFileId = upload.fileId;
    }

    /* ---------------- NO CHANGE CHECK ---------------- */
    const compare = getEqualFields(existingCourse, {
      ...data,
      ...imageUpdateData,
    });

    if (
      compare.changedFields.length === 0 &&
      Object.keys(imageUpdateData).length === 0
    ) {
      return NextResponse.json(
        { success: true, message: "No changes detected" },
        { status: 200 }
      );
    }

    /* ---------------- DB UPDATE (ATOMIC) ---------------- */
    const course = await prisma.$transaction(async (tx) => {
      return tx.course.update({
        where: { id },
        data: {
          ...data,
          ...imageUpdateData,
        },
      });
    });

    if(!course) return NextResponse.json({
      success: false,
      error: "Course update failed"
    }, {status: 500})

    /* ---------------- DELETE OLD IMAGES (AFTER SUCCESS) ---------------- */
    if (thumbnailFile && oldThumbnailId) {
      await imagekit.deleteFile(oldThumbnailId);
    }

    if (bannerFile && oldBannerId) {
      await imagekit.deleteFile(oldBannerId);
    }

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH COURSE ERROR:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auth = await checkAuthOwner();
    if (!auth.success)
      return NextResponse.json(
        {
          success: false,
          error: auth.error,
        },
        { status: +auth.status }
      );

    const existingCourse = await prisma.course.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        thumbnailFileId: true,
        bannerFileId: true,
      },
    });

    if (!existingCourse || id !== existingCourse.id)
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );

    const images = [
      existingCourse.thumbnailFileId,
      existingCourse.bannerFileId,
    ];

    if (images) {
      try {
        images.forEach((id) => {
          if (id) {
            imagekit.deleteFile(id);
          }
        });
      } catch (err) {
        throw new Error(`${err} Image delete failed`);
      }
    }

    await prisma.course.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${existingCourse.title.slice(0, 16)} deleted successfully`,
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
