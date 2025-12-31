import prisma from "../prisma";
import { deleteImageKitFile } from "../imagekit";


export class MediaService {
    // Save media file record

    static async saveMediaFile(data: {
        fileId: string
        fileName: string
        fileType: string
        url: string
        thumbnailUrl?: string
        size: number
        width?: number
        height?: number
        entityType: string
        entityId?: string
        uploadedBy?: string
    }) {
        try {
            const mediaFile = await prisma.mediaFile.create({
                data,
            })
            return {success: true, data: mediaFile}
        } catch (error) {
            console.error("Save media file error:", error)
            return {success: false, error: "Failed to save media file"}
        }
    }



    // Get media files by entity
    static async getMediaFileByEntity(entityType: string, entityId: string){
        try {
            const files = await prisma.mediaFile.findMany({
                where: {
                    entityType,
                    entityId
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            return {success: true, data: files}
        } catch (error) {
            console.error("Get media files by entity error:", error)
            return {success: false, error: "Failed to get media files by entity"}
        }
    }



    // Delete media file (from DB and ImageKit)
    static async deleteMediaFile(fileId: string) {
        try {
            // Delete from imagekit
            const deleteResult = await deleteImageKitFile(fileId)

            if(!deleteResult.success) {
                console.warn(`Filed to delete file ${fileId} from ImageKit`)
            }

            // Delete from database
            await prisma.mediaFile.delete({
                where: {fileId},
            })

            return {success: true}
        } catch (error) {
            console.error("Delete media file error:", error)
            return {success: false, error: "Failed to delete media file"} 
        }
    }

    // Cleanup orphaned files (not associated with any entity)
    static async cleanupOrphanedFiles() {
        try {
            const orphanedFiles = await prisma.mediaFile.findMany({
                where: {
                    entityId: null,
                    createdAt: {
                        lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24 hours
                    }
                }
            })

            for (const file of orphanedFiles) {
                await this.deleteMediaFile(file.fileId)
            }

            return {success: true, count: orphanedFiles.length}
        } catch (error) {
            console.error("Cleanup orphaned files error:", error)
            return {success: false, error: "Failed to cleanup orphaned files"}
        }
    }
}


