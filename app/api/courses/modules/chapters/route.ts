import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { checkAuth, checkAuthOwner } from "@/module/auth/actions";
import { createChaptersSchema } from "@/module/course/module/chapters/schemas";
import { ApiResponse } from "@/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
  try {
    const auth = await checkAuth()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, { status: +auth.status || 401 })
    
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const moduleId = searchParams.get("moduleId") || ""


    if(!page || !limit) return NextResponse.json({
      success: false,
      error: "Search URL Not Found"
    }, { status: 404 })

    const skip = (page-1) * limit;

    const where: Prisma.ChapterWhereInput = {}
    
    if(moduleId) {
      where.moduleId = moduleId
    }

    if(search.trim()){
      where.OR = [
        {id: {contains: search, mode: "insensitive"}},
        {title: {contains: search, mode: "insensitive"}},
      ]
    }

    const [totalChapters, chapters] = await prisma.$transaction([
      prisma.chapter.count({ where }),
      prisma.chapter.findMany({
        where,
        skip,
        take: limit,
      })
    ])

    const totalPages = Math.ceil(totalChapters / limit)

    return NextResponse.json({
      success: true,
      message: "Chapters fetched successfully",
      data: chapters,
      total: totalChapters,
      totalPages,
      currentPage: page,
      limit
    }, { status: 201 })


  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Server error for chapters geting api"
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {

    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: auth.success,
      error: auth.error
    }, { status: +auth.status || 401 })

    const formData = await req.formData()
    const rowData = Object.fromEntries(formData.entries())
    
    const validResult = createChaptersSchema.safeParse(rowData)
    if(!validResult.success) return NextResponse.json({
      success: false,
      error: validResult.error.message
    }, { status: 401 })

    const data = validResult.data
    

    const videoFile = formData.get("video") as File | null
    const uploadMediaFields: {url: string, fileId: string} = {url: "", fileId: ""}
    if(videoFile){
      const buffer = Buffer.from(await videoFile.arrayBuffer())

      const res = await imagekit.upload({
        file: buffer,
        fileName: validResult.data.title.slice(0,16),
        folder: "/modules/chapters",
        useUniqueFileName: true
      })

      if(!res) return NextResponse.json({
        success: false,
        error: "Server error for imagekit"
      })

      uploadMediaFields.url = res.url
      uploadMediaFields.fileId = res.fileId
    }

    const chapter = await prisma.chapter.create({
      data: {
        ...data,
        videoUrl: uploadMediaFields.url,
        videoFileId: uploadMediaFields.fileId
      }
    })

    if(!chapter) return NextResponse.json({
      success: false,
      error: "Chapter not create ( server api error )"
    }, {status: 500})

    return NextResponse.json({
      success: true,
      message: `${chapter.title.slice(0, 16)} Created Successfully`
    }, {status: 201})


  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Server error from chapters api"
    })
  }
}
