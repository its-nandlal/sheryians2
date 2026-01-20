
import { UploadField, uploadImages } from "@/actions";
import prisma from "@/lib/prisma";
import { checkAuth, checkAuthOwner } from "@/module/auth/actions";
import { createCourseSchema } from "@/module/course/( course )/schema";
import { ApiResponse } from "@/types";
import { CourseDays, CourseDuration, CourseLevel, CourseStatus, CourseType, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request:NextRequest) {
  try {

    const { searchParams } = new URL(request.url)

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;
    const search = searchParams.get("search") || "";


    const authCheck = await checkAuth()
    if(!authCheck.success) return NextResponse.json({
      success: false,
      error: authCheck.error
    }, { status: +authCheck.status || 401 })

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if(search.trim()){
      where.OR = [
        {title: {contains: search, mode: "insensitive"}},
        {level: search as CourseLevel },
        {duration: search as CourseDuration},
        {days: search as CourseDays},
        {status: search as CourseStatus},
        {type: search as CourseType},
        {price: {equals: Number(search)}},
        {discountedPrice: {equals: Number(search)}}
      ]
    }

    const totalCourses = await prisma.course.count({where})
    const totalPages = Math.ceil(totalCourses / limit)

    const courses = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        bannerUrl: true,
        price: true,
        discountedPrice: true,
        level: true,
        duration: true,
        startTime: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      data: courses,
      total: totalCourses,
      totalPages,
      currentPage: page,
      limit
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Server error"
    }, { status: 500 })
  }
}


export async function POST(request:NextRequest):  Promise<NextResponse<ApiResponse>> {
  try {
    
    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, {
      status: +auth.status || 401
    })

    const formData = await request.formData()
    const rowData = Object.fromEntries(formData.entries())

    const validResult = createCourseSchema.safeParse({
      ...rowData,
      price: Number(rowData.price),
      discountedPrice: Number(rowData.discountedPrice),
      tags: formData.getAll("tags[]"),
      metaKeywords: formData.getAll("metaKeywords[]"),
    })

    if(!validResult.success) return NextResponse.json({
      success: false,
      error: validResult.error.name,
      fieldErrors: validResult.error.flatten().fieldErrors
    }, {status: 400})

    const data = validResult.data
    // console.log(formData)

    // UPLOADING IMAGES
    const uploadFields: UploadField[] = [
      {key: "thumbnail", folder: "/courses/thumbnails"},
      {key: "banner", folder: "/courses/banners"}
    ]

    // GET IMAGES FIELDS
    const thumbnailFile = formData.get("thumbnail") as File || null
    const bannerFile = formData.get("banner") as File || null

    // UPLOAD IMAGES IMAGEKIT
    const [thumbnail, banner] = await Promise.all([
      thumbnailFile ?  uploadImages(thumbnailFile, uploadFields[0]) : null,
      bannerFile ?  uploadImages(bannerFile, uploadFields[1]) : null
    ])


    const courses = await prisma.course.create({
      data: {
        ...data,
        thumbnailUrl: thumbnail?.url || null,
        thumbnailFileId: thumbnail?.fileId || null,
        bannerUrl: banner?.url || null,
        bannerFileId: banner?.fileId || null
      }
    })

    if(!courses) return NextResponse.json({
      success: false,
      error: "Course not created"
    }, { status: 500 })


    return NextResponse.json({
      success: true,
      message: `${data.title.slice(0,16)} created successfully`,
    },{ status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message.toString() : "Server error",
    },{status: 500})
  }
}