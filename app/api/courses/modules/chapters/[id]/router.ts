import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { NextRequest, NextResponse } from "next/server";

async function PATCH(
  req: NextRequest,
  {params}: { params: Promise<{ id: string }> },
) {
  try {

    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, { status: +auth.status || 401 })

    const {id} = await params
    const existingchapter = await prisma.chapter.findMany({
      where: {id}
    })
    if(!existingchapter) return NextResponse.json({
      success: false,
      error: "Chapter not found"
    }, {status: 404})

  } catch (error) {}
}
