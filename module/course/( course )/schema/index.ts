import { CourseDays, CourseDuration, CourseLevel, CourseStatus, CourseType, Language, ModuleType } from "@prisma/client"
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
        .max(200, "Subtitle must not exceed 200 characters")
        .trim()
        .optional(),
    
    description: z.string()
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
        .min(0, "Discounted Price cannot be negative")
        .max(999999, "Price is too high")
        .optional(),
    
    introVideoUrl: z.string()
        .url("Invalid intro video URL")
        .trim()
        .optional()
        .or(z.literal("")),

    tags: z.array(
        z.string()
            .min(2, "Each tags must be at least 2 characters")
            .trim()
    )
        .min(3, "At least 3 tags required")
        .max(10, "Maximum 10 tags allowed"),

    days: z.nativeEnum(CourseDays).optional(),
    startTime: z.string()
        .min(5, "Start time must be at least 5 characters")
        .max(10, "Start time is too long")
        .trim(),
    
    duration: z.nativeEnum(CourseDuration),
    level: z.nativeEnum(CourseLevel),

    // SEO fields
    metaTitle: z.string()
        .max(60, "Meta title should not exceed 60 characters for SEO")
        .trim()
        .optional(),
    
    metaDesc: z.string()
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
        .min(3, "Title must be at least 4 characters")
        .max(50, "Title must not exceed 200 characters")
        .trim(),
    
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must not exceed 2000 characters")
        .trim()
        .optional(),
    
    order: z.coerce.number()
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
