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
        IMAGEKIT_PUBLIC_KEY: z.string().min(1, "Imagekit Public Key is required"), // Fixed typo: MAGEKIT -> IMAGEKIT
        IMAGEKIT_PRIVATE_KEY: z.string().min(1, "Imagekit Private Key is required"), // Fixed typo: MAGEKIT -> IMAGEKIT
        IMAGEKIT_URL_ENDPOINT: z.string().min(1, "Imagekit URL Endpoint is required"),
        IMAGEKIT_WEBHOOK_SECRET: z.string().min(1, "Imagekit Webhook Secret is required"),
    },
    client: {
        NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string().min(1, "Next Public Imagekit Public Key is required"),
        NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().min(1, "Next Public Imagekit URL Endpoint is required"),
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables
    experimental__runtimeEnv: {
        NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    }
})
