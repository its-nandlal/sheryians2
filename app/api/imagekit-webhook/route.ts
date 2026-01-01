import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get("x-ik-signature");
        const rawBody = await request.text();

        if (!signature) {
            return NextResponse.json(
                { success: false, error: "No signature found" },
                { status: 401 }
            );
        }

        // Signature verification
        const webhookSecret = env.IMAGEKIT_WEBHOOK_SECRET as string;
        const items = signature.split(',');
        const timestamp = items[0].split('=')[1];
        const receivedSignature = items[1].split('=')[1];

        const computedSignature = createHmac('sha256', webhookSecret)
            .update(timestamp + '.' + rawBody)
            .digest('hex');

        if (computedSignature !== receivedSignature) {
            return NextResponse.json(
                { success: false, error: "Invalid signature" },
                { status: 401 }
            );
        }

        const event = JSON.parse(rawBody);
        console.log("Webhook event received:", event.type);

        // Upload success event handle karein
        if (event.type === "upload.success") {
            const { fileId, url, customCoordinates } = event.data;
            
            console.log("File uploaded:", { fileId, url, customCoordinates });

            // customCoordinates mein instructor ID pass kiya hua hai
            const instructorId = customCoordinates;

            if (instructorId) {
                const updatedInstructor = await prisma.instructor.update({
                    where: { id: instructorId },
                    data: {
                        avatarUrl: url,
                        avatarFileId: fileId,
                    }
                });
                
                console.log("Instructor updated:", updatedInstructor.id);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
