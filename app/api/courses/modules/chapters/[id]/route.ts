import { getEqualFields } from "@/lib/helper/compair-data";
import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { createChaptersSchema } from "@/module/course/module/chapters/schemas";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  {params}: { params: Promise<{ id: string }> },
) {
  try {

    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, { status: +auth.status || 401 })

    const {id} = await params
    const existingchapter = await prisma.chapter.findUnique({
      where: {id}
    })
    if(!existingchapter) return NextResponse.json({
      success: false,
      error: "Chapter not found"
    }, {status: 404})
    
    const formData = await req.formData()
    const rowData = Object.fromEntries(formData.entries())
    const videoFile = formData.get("video") as File | null

    const validResult = createChaptersSchema.safeParse(rowData)
    if(!validResult.success) return NextResponse.json({
      success: false,
      error: validResult.error.message
    }, {status: 400})

    const data = validResult.data

    const compairData = getEqualFields(existingchapter, data)
    if(compairData.changedFields.length === 0 && !videoFile || videoFile?.size === 0) return NextResponse.json({
        success: true,
        message: "No changes detected",
    }, { status: 200 })

    if(!videoFile || videoFile.size === 0){
        await prisma.chapter.update({
          where: {id},
          data: {
            ...data
          }
        })

        return NextResponse.json({
          success: true,
          message: `${existingchapter.title.slice(0, 16)} Chapter Updated Successfully`
        }, { status: 200 })
    }

    // ------------------ UPLOAD NEW VIDEO & DELETE OLD VIDEO ------------------
    
    if(existingchapter.videoFileId){
        try {
            await imagekit.deleteFile(existingchapter.videoFileId)
        } catch (error) {
            console.error("ImageKit delete failed:", error);
        }
    }
    
    let uploadMediaFields = {
      url: "",
      fileId: ""
    };

    // ✅ Video validation
    if (videoFile) {
      if (!videoFile.type.startsWith("video/")) {
        return NextResponse.json(
          { success: false, error: "Invalid video format" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await videoFile.arrayBuffer());

      const res = await imagekit.upload({
        file: buffer,
        fileName: `${data.title.slice(0, 16)}-${Date.now()}`,
        folder: "/modules/chapters",
        useUniqueFileName: true
      });

      if (!res) {
        return NextResponse.json(
          { success: false, error: "ImageKit upload failed" },
          { status: 500 }
        );
      }

      uploadMediaFields = {
        url: res.url,
        fileId: res.fileId
      };
    }

    const chapter =  await prisma.chapter.update({
      where: { id },
      data: {
        ...data,
        videoUrl: uploadMediaFields.url,
        videoFileId: uploadMediaFields.fileId
      }
    });

    return NextResponse.json({
      success: true,
      message: `${chapter.title.slice(0, 16)} Chapter Updated Successfully`
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Server error"
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: +auth.status || 401 }
      );
    }

    const { id } = await params;


    const chapter = await prisma.chapter.findUnique({
      where: { id }
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }

    if (chapter && chapter.videoFileId) {
      try {
        await imagekit.deleteFile(chapter.videoFileId);
      } catch (err) {
        console.error("ImageKit delete failed:", err);
      }
    }

    await prisma.chapter.delete({
      where: { id }
    });

    return NextResponse.json(
      {
        success: true,
        message: `${chapter.title.slice(0, 16)} Chapter Deleted Successfully`
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Server error"
      },
      { status: 500 }
    );
  }
}
