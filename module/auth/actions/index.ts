"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { APIError } from "better-auth"
import { headers } from "next/headers"
import { AuthUserResponse } from "../types/indes"

export const getCurrentUser = async (): Promise<AuthUserResponse> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        // ✅ Better null check
        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized",
                status: 401
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        // ✅ Handle case where user not found in DB
        if (!user) {
            return {
                success: false,
                error: "User not found",
                status: 404
            }
        }

        return {
            success: true,
            data: user,
            status: 200
        }
    } catch (error) {
        if (error instanceof APIError) {
            return {
                success: false,
                error: error.message,
                status: error.status
            }
        }

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
                status: 500
            }
        }

        return {
            success: false,
            error: "Unknown error occurred (auth checker)",
            status: 500
        }
    }
}



export const checkAuthOwner = async (): Promise<AuthUserResponse> => {
    try {

        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session) return {
            success: false,
            error: "Unauthorized",
            status: 401
        }
        
        const userRole = (session.user as { role?: "STUDENT" | "OWNER" })
        ?.role as "STUDENT" | "OWNER" | undefined;
        
        if(!session.user.id && userRole !== "OWNER") return {
            success: false,
            error: "Unauthorized",
            status: 401
        }

        return {
            success: true,
            data: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image || "",
                role: session.user.role || "",
                createdAt: session.user.createdAt,
                updatedAt: session.user.updatedAt
            },
            status: 200
        }
        
    } catch (error) {
        if(error instanceof Error) return {
            success: false,
            error: error.message,
            status: 500
        }

        return {
            success: false,
            error: "Unknown error occurred (auth checker)",
            status: 500
        }
    }
}
