import z from "zod";

export const createChaptersSchema = z.object({
    title: z.string()
        .min(6, "Title must be at least 6 characters")
        .max(100, "Title must not exceed 100 characters")
        .trim(),

    description: z.string()
        .max(500, "Title must not exceed 100 characters")
        .trim()
        .optional(),
        
    moduleId: z.string()
        .cuid("Invalid chapters ID formate")
        .trim()
})


export type createChaptersInput = z.infer<typeof createChaptersSchema>



