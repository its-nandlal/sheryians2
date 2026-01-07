import { CourseStatus, CourseType, Language, ModuleType } from "@prisma/client"
import { z } from "zod"

export const createCourseSchema = z.object({
    slug: z.string()
        .min(2, "Slug must be at least 2 characters")
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    
    title: z.string()
        .min(6, "Title must be at least 6 characters")
        .max(100, "Title must not exceed 100 characters")
        .trim(),
    
    subtitle: z.string()
        .min(6, "Subtitle must be at least 6 characters")
        .max(200, "Subtitle must not exceed 200 characters")
        .trim()
        .optional(),
    
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description must not exceed 5000 characters")
        .trim()
        .optional(),
    
    // Prisma enums - use nativeEnum for better type safety
    language: z.nativeEnum(Language),
    type: z.nativeEnum(CourseType),
    status: z.nativeEnum(CourseStatus),
    
    // Price validations - positive numbers
    price: z.number()
        .positive("Price must be positive")
        .min(0, "Price cannot be negative")
        .max(999999, "Price is too high"),
    
    discountedPrice: z.number()
        .positive("Discounted price must be positive")
        .min(0, "Discounted price cannot be negative")
        .max(999999, "Discounted price is too high")
        .optional(),
    
    introVideoUrl: z.string()
        .url("Invalid intro video URL")
        .trim()
        .optional()
        .or(z.literal("")),
    
    thumbnailUrl: z.string()
        .url("Invalid thumbnail URL")
        .trim()
        .optional()
        .or(z.literal("")),
    
    bannerUrl: z.string()
        .url("Invalid banner URL")
        .trim()
        .optional()
        .or(z.literal("")),
    
    duration: z.string()
        .min(2, "Duration must be at least 2 characters")
        .max(50, "Duration is too long")
        .trim()
        .optional(),
    
    level: z.string()
        .min(3, "Level must be at least 3 characters")
        .max(50, "Level must not exceed 50 characters")
        .trim()
        .optional(),

    // SEO fields
    metaTitle: z.string()
        .min(10, "Meta title must be at least 10 characters")
        .max(60, "Meta title should not exceed 60 characters for SEO")
        .trim()
        .optional(),
    
    metaDesc: z.string()
        .min(50, "Meta description must be at least 50 characters")
        .max(160, "Meta description should not exceed 160 characters for SEO")
        .trim()
        .optional(),
    
    metaKeywords: z.array(
        z.string()
            .min(2, "Each keyword must be at least 2 characters")
            .trim()
    )
        .min(3, "At least 3 keywords required")
        .max(10, "Maximum 10 keywords allowed")
        .optional()
})
.refine((data) => {
    // Ensure discounted price is less than regular price
    if (data.discountedPrice && data.price) {
        return data.discountedPrice < data.price
    }
    return true
}, {
    message: "Discounted price must be less than regular price",
    path: ["discountedPrice"]
})

export const createModuleSchema = z.object({
    title: z.string()
        .min(4, "Title must be at least 4 characters")
        .max(200, "Title must not exceed 200 characters")
        .trim(),
    
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must not exceed 2000 characters")
        .trim()
        .optional(),
    
    order: z.number()
        .int("Order must be an integer")
        .positive("Order must be positive")
        .min(1, "Order must be at least 1"),
    
    // Use nativeEnum for Prisma enums
    type: z.nativeEnum(ModuleType),
    
    duration: z.string()
        .min(2, "Duration must be at least 2 characters")
        .max(50, "Duration is too long")
        .trim()
        .optional(),
    
    videoUrl: z.string()
        .url("Invalid video URL")
        .trim()
        .optional()
        .or(z.literal("")),
    
    courseId: z.string()
        .cuid("Invalid course ID format")
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type CreateModuleInput = z.infer<typeof createModuleSchema>
