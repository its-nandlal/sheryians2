import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import ImageKit from "imagekit"

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
    const userRole = (session.user as { role: string }).role
    if (userRole !== "OWNER") {
      console.error("ImageKit auth: User is not OWNER")
      return NextResponse.json(
        { error: "Forbidden - Only owners can upload files" },
        { status: 403 }
      )
    }

    // Create ImageKit instance directly in route
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
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
