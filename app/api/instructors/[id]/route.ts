// DELETE Instructor

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MediaService } from "@/lib/services/media-service";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";


export async function DELETE(
    request: NextRequest,
    { params }: {params: {id: string}}
){
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session?.user || (session.user as {role: string}).role !== "OWNER"){
            return NextResponse.json(
                {success: false, error: "Unauthorized"},
                {status: 401}
            )
        }

        // Get instructor with courses count
        const instructor = await prisma.instructor.findUnique({
            where: {id: params.id},
            include: {
                _count: {
                    select: {courses: true}
                }
            }
        })

        if(!instructor) return NextResponse.json(
            {success: false, error: "Instructor not found"},
            {status: 404}
        )

        if(instructor._count.courses > 0) return NextResponse.json(
            {success: false, error: "Cannot delete instructor with active courses"},
            {status: 400}
        )

        // Delete associated media file
        if(instructor.avatarFileId) {
            await MediaService.deleteMediaFile(instructor.avatarFileId).catch(
                (error) => {
                    console.error(error)
                }
            )
        }

        // Delete instructor
        await prisma.instructor.delete({
            where: {id: params.id}
        })

        return NextResponse.json({
            success: true,
            message: "Instructor delete successfully",
        })

    } catch (error) {
        if(error instanceof Error) return NextResponse.json(
            {success: false, error: error.message},
            {status: 500}
        )

        return NextResponse.json(
            {success: false, error: "Something went wrong"},
            {status: 500}
        )
    }
}