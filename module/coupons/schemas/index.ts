import { z } from "zod";

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(5, "Coupon code must be at least 5 characters")
      .max(10, "Coupon code must not exceed 10 characters")
      .transform((val) => val.toUpperCase()),

    discountValue: z.coerce
      .number()
      .min(200, "Discount must be at least 200")
      .max(10000, "Discount must not exceed 10000"),

    minOrderAmount: z.coerce
      .number()
      .min(1000, "Minimum order must be at least 1000")
      .max(70000, "Minimum order must not exceed 70000"),

    usageLimit: z.coerce
      .number()
      .min(1, "Usage limit must be at least 1")
      .max(500, "Usage limit must not exceed 500"),

    perUserLimit: z.coerce
      .number()
      .min(1, "Per user limit must be at least 1")
      .max(10, "Per user limit must not exceed 10"),

    // ✅ SAFE DATE HANDLING (Zod v3 compatible)
    startsAt: z.coerce.date(),
    expiresAt: z.coerce.date(),

    isActive: z.coerce.boolean().default(true),
  })
  .refine(
    (data) => data.expiresAt > data.startsAt,
    {
      message: "Expiry date must be after start date",
      path: ["expiresAt"],
    }
  )
  .strict();

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
