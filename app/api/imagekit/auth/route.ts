import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import ImageKit from "imagekit"

// Add route segment config
export const runtime = "nodejs" // Force Node.js runtime
export const dynamic = "force-dynamic" // Disable static optimization

export async function GET() {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      console.error("ImageKit auth: No session found")
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      )
    }

    // Check if user is OWNER
    const userRole = (session.user as unknown as { role: string }).role
    if (userRole !== "OWNER") {
      console.error("ImageKit auth: User is not OWNER")
      return NextResponse.json(
        { error: "Forbidden - Only owners can upload files" },
        { status: 403 }
      )
    }

    // Validate environment variables
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("Missing ImageKit environment variables")
      return NextResponse.json(
        { error: "ImageKit not configured" },
        { status: 500 }
      )
    }

    // Create ImageKit instance
    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    })

    // Get auth parameters
    const authParams = imagekit.getAuthenticationParameters()

    console.log("ImageKit auth successful", {
      hasSignature: !!authParams.signature,
      hasToken: !!authParams.token,
      hasExpire: !!authParams.expire,
    })

    return NextResponse.json({
      signature: authParams.signature,
      expire: authParams.expire,
      token: authParams.token,
    })
  } catch (error) {
    console.error("ImageKit auth API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate authentication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
