import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { createInstructorSchema } from "@/types/instructor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const checkOwner = await checkAuthOwner();
        if (!checkOwner.success) {
            return NextResponse.json(
                { success: false, error: checkOwner.error },
                { status: +checkOwner.status }
            );
        }

        const body = await request.json();
        const validResult = createInstructorSchema.safeParse(body);

        if (!validResult.success) {
            return NextResponse.json(
                { success: false, error: validResult.error.message },
                { status: 400 }
            );
        }

        // Pehle instructor create karein without image
        const instructor = await prisma.instructor.create({
            data: {
                name: validResult.data.name,
                email: validResult.data.email,
                bio: validResult.data.bio,
                expertise: validResult.data.expertise,
                avatarUrl: null,
                avatarFileId: null,
            }
        });

        return NextResponse.json(
            { 
                success: true, 
                data: instructor,
                message: `${instructor.name} created successfully!` 
            },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Something went wrong" },
            { status: 500 }
        );
    }
}
