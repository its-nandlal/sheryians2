import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get signature header
    const signatureHeader = request.headers.get("x-ik-signature");
    const rawBody = await request.text();

    if (!signatureHeader) {
      return NextResponse.json(
        { success: false, error: "Missing ImageKit signature" },
        { status: 401 }
      );
    }

    // 2️⃣ Parse signature header safely
    // Format: t=timestamp,s=signature
    const signatureParts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("="))
    );

    const timestamp = signatureParts.t;
    const receivedSignature = signatureParts.s;

    if (!timestamp || !receivedSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature format" },
        { status: 401 }
      );
    }

    // 3️⃣ Compute expected signature
    const webhookSecret = env.IMAGEKIT_WEBHOOK_SECRET as string;

    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    if (expectedSignature !== receivedSignature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 4️⃣ Parse webhook event
    const event = JSON.parse(rawBody);
    console.log("ImageKit webhook received:", event.type);

    // 5️⃣ Handle upload success
    if (event.type === "upload.success") {
      const { fileId, url, customMetadata } = event.data;

      const instructorId = customMetadata?.instructorId;

      console.log("Uploaded file:", {
        fileId,
        url,
        instructorId,
      });

      if (!instructorId) {
        console.warn("Instructor ID missing in customMetadata");
        return NextResponse.json({ success: true });
      }

      // 6️⃣ Update instructor record
      await prisma.instructor.update({
        where: { id: instructorId },
        data: {
          avatarUrl: url,
          avatarFileId: fileId,
        },
      });

      console.log("Instructor avatar updated:", instructorId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("ImageKit webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
