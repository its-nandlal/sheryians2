import { ModuleType } from "@prisma/client";
import z from "zod";



export const createModuleSchema = z.object({
    title: z.string()
        .min(4, "Title must be at least 4 characters")
        .max(30, "Title must not exceed 200 characters")
        .trim(),

    description : z.string()
        .max(2000, "Description must not exceed 2000 characters")
        .trim()
        .optional(),

    order: z.number()
        .int("Order must be an integer")
        .positive("Order must be positive")
        .min(1, "Order must be at least 1"),

    type: z.nativeEnum(ModuleType),

    duration: z.string()
        .max(50, "Duration is too long")
        .trim()
        .optional(),

    courseId: z.string()
        .cuid("Invalid course ID format")
        .trim(),

})

export type CreateModuleInput = z.infer<typeof createModuleSchema>