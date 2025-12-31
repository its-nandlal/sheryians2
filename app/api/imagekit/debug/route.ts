import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    // Check session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check env vars (don't expose actual values)
    const envCheck = {
      serverSide: {
        IMAGEKIT_PUBLIC_KEY: !!process.env.IMAGEKIT_PUBLIC_KEY,
        IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
        IMAGEKIT_URL_ENDPOINT: !!process.env.IMAGEKIT_URL_ENDPOINT,
      },
      clientSide: {
        NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: !!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      },
      session: {
        authenticated: !!session,
        role: session ? (session.user as {role: string}).role : null,
      },
    }

    return NextResponse.json({
      status: "ok",
      checks: envCheck,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
