// app/api/upload-auth/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60 * 5; // 5 min

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return NextResponse.json({
    token,
    expire,
    signature,
  });
}
