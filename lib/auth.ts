import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma"; // Import singleton instance
import { env } from "./env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://sheryians2.vercel.app"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user:{
    additionalFields:{
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true
      }
    }
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,

      mapProfileToUser: (profile) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          emailVerified: profile.email_verified,
          role: "STUDENT", // Google login par default STUDENT role
        }
      }
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,

      mapProfileToUser: (profile) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          emailVerified: true,
          role: "STUDENT", // GitHub login par default STUDENT role
        }
      }
    },
  },
});

export type Session = typeof auth.$Infer.Session;