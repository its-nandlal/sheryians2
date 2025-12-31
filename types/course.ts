

import { CourseStatus, CourseType, Language, ModuleType } from "@prisma/client"
import { z } from "zod"


export const createCourseSchema = z.object({
    slug:  z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
    title: z.string().min(3, "Title must be at least 3 characters long"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    language:  z.nativeEnum(Language).default(Language.HINGLISH),
    type: z.nativeEnum(CourseType),
    status: z.nativeEnum(CourseStatus).default(CourseStatus.UPCOMING),
    price: z.number().positive("Price must be a positive number"),
    discountedPrice: z.number().positive().optional(),
    // thumbnailURL: z.string().optional(),
    // bannerUrl: z.string().optional(),
    duration: z.string().optional(),
    level: z.string().optional(),


    // SEO
    metaTitle: z.string().optional(),
    metaDesc: z.string().max(160).optional(),
    keywords: z.array(z.string()).default([]),


    // Instructors
    instructorIds: z.array(z.string()).min(1, "At least one instructor is required"),

    // Modules
    modules: z.array(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      order: z.number().int().positive(),
      type: z.nativeEnum(ModuleType),
      duration: z.string().optional(),
      videoUrl: z.string().url().optional(),
      quizUrl: z.string().url().optional(),
      assignmentId: z.string().optional(),
    })).optional().default([]),


})

export type CreateCourseInput = z.infer<typeof createCourseSchema>

export type CourseResponse = {
    success: boolean;
    data?: {
        id: string;
        slug: string;
        title: string;
        price: number;
        discountedPrice?: number | null;
    }

    error?: string;
    status: number;
}