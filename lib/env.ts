import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1, "Database URL is required"),
        BETTER_AUTH_URL: z.string().min(1, "Better Auth URL is required"),
        BETTER_AUTH_SECRET: z.string().min(1, "Better Auth Secret is required"),
        GITHUB_CLIENT_ID: z.string().min(1, "Github Client ID is required"),
        GITHUB_CLIENT_SECRET: z.string().min(1, "Github Client Secret is required"),
        GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
        GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),

    },
    experimental__runtimeEnv: process.env
})