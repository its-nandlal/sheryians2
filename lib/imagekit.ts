import ImageKit from "imagekit"
import { env } from "./env"
import crypto from "crypto"

export const imagekit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT
})



export function getImageKitAuth() {
    try {
        return imagekit.getAuthenticationParameters()
    } catch (error) {
        console.error("Imageit auth error:", error)
        throw new Error("Failed to get ImageKit authentication parameters")
    }
}

export async function deleteImageKitFile(fileId: string) {
    try {
        await imagekit.deleteFile(fileId)
        return {success: true}
    } catch (error) {
        console.error("Imagekit delete file error:", error)
        throw new Error("Failed to delete file from ImageKit")
    }
}

export async function getImageKitFileDetails(fileId: string) {
    try {
       const file = await imagekit.getFileDetails(fileId)
       return {success: true, data: file}
    } catch (error) {
        console.error("Imagekit get file details error:", error)
        throw new Error("Failed to get file details from ImageKit")
    }
}

export async function bulkDeleteImageKitFiles(fileIds: string[]) {
    try {
        const result = await Promise.allSettled(
            fileIds.map(fileId => imagekit.deleteFile(fileId))
        )

        const successfull = result.filter(r => r.status === "fulfilled").length
        const failed = result.filter(r => r.status === "rejected").length

        return {success: true, successfull, failed}
    } catch (error) {
        console.error("Imagekit bulk delete files error:", error)
        throw new Error("Failed to delete files from ImageKit")
    
    }
}



export function verifyImageKitWebhook(
    signature: string,
    timestamp: string,
    body: string
): boolean {
    try {
        const secret = env.IMAGEKIT_WEBHOOK_SECRET!

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(timestamp + body)
            .digest("hex")
        
        return signature === expectedSignature

    } catch (error) {
        console.error("Imagekit webhook verification error:", error)
        throw new Error("Failed to verify ImageKit webhook")
        return false
    }
}