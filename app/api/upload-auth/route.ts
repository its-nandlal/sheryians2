import { env } from "@/lib/env";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Environment variables check karein
        const publicKey = env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;


        if (!publicKey || !privateKey || !urlEndpoint) {
            console.error("Missing ImageKit credentials");
            return NextResponse.json(
                { error: "ImageKit configuration missing" },
                { status: 500 }
            );
        }

        const imagekit = new ImageKit({
            publicKey: publicKey,
            privateKey: privateKey,
            urlEndpoint: urlEndpoint,
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        
        console.log("Auth params generated:", {
            hasToken: !!authenticationParameters.token,
            hasSignature: !!authenticationParameters.signature,
            expire: authenticationParameters.expire
        });
        
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("Auth generation error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}
