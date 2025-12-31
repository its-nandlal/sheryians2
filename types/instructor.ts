import { z } from "zod"

export const createInstructorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
  avatarFileId: z.string().optional().nullable(),
  bio: z.string().min(10, "Bio must be at least 10 characters").optional().nullable(),
  expertise: z.array(z.string()).min(1, "At least one expertise required"),
})

export const updateInstructorSchema = createInstructorSchema.partial()

export type CreateInstructorInput = z.infer<typeof createInstructorSchema>
export type UpdateInstructorInput = z.infer<typeof updateInstructorSchema>

export type Instructor = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  avatarFileId: string | null
  bio: string | null
  expertise: string[]
  createdAt: Date
  updatedAt: Date
}

export type ImageKitWebhookPayload = {
  type: string // "video.transformation.accepted" | "upload.complete" | "file.deleted"
  id: string
  createdAt: string
  data: {
    file: {
      fileId: string
      name: string
      url: string
      thumbnailUrl?: string
      fileType: string
      size: number
      width?: number
      height?: number
      filePath: string
    }
  }
}


export type ImageKitAuthResponse = {
  signature: string
  expire: number
  token: string
}

export type ImageKitUploadResponse = {
  fileId: string
  name: string
  url: string
  thumbnailUrl: string
  height: number
  width: number
  size: number
  filePath: string
  fileType: string
}