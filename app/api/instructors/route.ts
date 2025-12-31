import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createInstructorSchema } from "@/types/instructor"
import { MediaService } from "@/lib/services/media-service"
import { z } from "zod"


// GET all instructors with pagination and search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        // Build where clause
        const where = search ? {
            OR: [
                {name: {contains: search}, mode: "insensitive" as const},
                {email: {contains: search}, mode: "insensitive" as const},
                {bio: {contains: search}, mode: "insensitive" as const}
            ],
        } : {}

        // Get total count 
        const total = await prisma.instructor.count({where})

        // Get instructors
        const instructor = await prisma.instructor.findMany({
            where,
            select: {
               id: true,
               name: true,
               email: true,
               avatarUrl: true,
               avatarFileId: true,
               bio: true,
               expertise: true,
               createdAt: true,
               updatedAt: true,
               _count: {
                select: {
                    courses: true
                }
               }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        })

        return NextResponse.json({
            success: true,
            data: instructor,
            total,
            page,
            limit,
            totlaPages: Math.ceil(total / limit),

        })

    } catch (error) {

        if(error instanceof Error) return NextResponse.json(
            {success: false, error: error.message},
            {status: 500}
        )

        return NextResponse.json(
            {success: false, error: "Failed to get instructors"},
            {status: 500}
        )
    }
}



// POST create instructor
export async function POST(request: NextRequest) {
    try {
        
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session?.user) return NextResponse.json(
            {success: false, error: "Unauthorized"},
            {status: 401}
        )
        const userRole = (session.user as {role: string}).role
        if(userRole !== "OWNER") return NextResponse.json(
            {success: false, error: "Forbidden"},
            {status: 403}
        )

        const body = await request.json()
        const validateData = createInstructorSchema.parse(body)

        // Check duplicate email
        const existing = await prisma.instructor.findUnique({
            where: {email: validateData.email}
        })

        if(existing) return NextResponse.json(
            {success: false, error: "Instructor with this email already exists"},
            {status: 409}
        )

        // Create instructor
        const instructor = await prisma.instructor.create({
            data: validateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                avatarFileId: true,
                expertise: true,
            }
        })

        // Update media file association
        if(validateData.avatarFileId) {
            await MediaService.saveMediaFile({
                fileId: validateData.avatarFileId,
                fileName: "avtar",
                fileType: "image",
                url: validateData.avatarUrl || "",
                size: 0,
                entityType: "instructor",
                entityId: instructor.id,
                uploadedBy: session.user.id,
            }).catch((error) => {
                throw new Error(error)
            })
        }

        return NextResponse.json({
            success: true,
            data: instructor,
            message: "Instructor created successfully"
        },
        {status: 201}
    )
    } catch (error) {
        console.error("POST instructor error:", error)

        if(error instanceof z.ZodError){
            return NextResponse.json(
                {success: false, error: error.issues},
                {status: 400}
            )
        }

        return NextResponse.json(
            {success: false, error: "Failed to create instructor"},
            {status: 500}
        )
    }
}