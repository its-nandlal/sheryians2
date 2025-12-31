import { NextRequest, NextResponse } from "next/server"
import { verifyImageKitWebhook } from "@/lib/imagekit"
import { MediaService } from "@/lib/services/media-service"
import { ImageKitWebhookPayload } from "@/types/instructor"
import { error } from "console"
import prisma from "@/lib/prisma"


export async function POST(request: NextRequest) {
    try {

        // Get webhook signature and timestamp
        const signature = request.headers.get("x-ik-signature")
        const timestamp = request.headers.get("x-ik-timestamp")


        if(!signature || !timestamp) {
            return NextResponse.json(
                {error: "Missing signature or timestamp"},
                {status: 401}
            )
        }

        // Get row body
        const body = await request.text()

        // Verify webhook signature
        const isValid = verifyImageKitWebhook(signature, timestamp, body)

        if(!isValid) return NextResponse.json(
            {error: "Invalid signature"},
            {status: 401}
        )

        // Parse webhook paylod
        const payload: ImageKitWebhookPayload = JSON.parse(body)

        console.log("Imagekit webhook recived:", payload.type)

        // Handle different webhook events
        switch (payload.type) {
            case "upload.complete":
                await handleUploadComplete(payload)
                break

            case "file.deleted":
                await handleFileDeleted(payload)
                break

            case "video.transformation.accepted":
                await handleVideoTransformation(payload)
                break

            default:
                console.log("Unhandled webhook type:", payload.type)
        }

        return NextResponse.json({success: true, received: true})
        
    } catch (error) {
        console.error("Imagekit webhook error:", error)
        return NextResponse.json(
            {error: "Webhook imagekit processing failed"},
            {status: 500}
        )
    }
}


async function handleUploadComplete(payload: ImageKitWebhookPayload) {
    const { file } = payload.data

    // Save media file to database
    await MediaService.saveMediaFile({
        fileId: file.fileId,
        fileName: file.name,
        fileType: file.fileType,
        url: file.url,
        thumbnailUrl: file.thumbnailUrl,
        size: file.size,
        width: file.width,
        height: file.height,
        entityType: "pending", // Will be updated when associated with entity
    })
    console.log(`Upload complete: ${file.name} (${file.fileId})`)
}


async function handleFileDeleted(payload: ImageKitWebhookPayload) {
    const { fileId } = payload.data.file

    // Delete media file from databse
    try {
        await prisma.mediaFile.delete({
            where: {fileId}
        })

        console.log(`File deleted: ${fileId}`)
    } catch (error) {
        console.error("Error deleting file from database:", error)
    }
}


async function handleVideoTransformation(payload: ImageKitWebhookPayload) {
    const { file } = payload.data

    // Update media file with transformation details
    try {
        await prisma.mediaFile.update({
            where: {fileId: file.fileId},
            data: {
                url: file.url,
                thumbnailUrl: file.thumbnailUrl
            }
        })

        console.log(`Video transformation accepted: ${file.name} (${file.fileId})`)
    } catch (error) {
        console.error("Error updating media file in database:", error)
    }
}