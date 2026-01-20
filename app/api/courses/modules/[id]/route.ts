import { getEqualFields } from "@/lib/helper/compair-data";
import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { createModuleSchema } from "@/module/course/( course )/schema";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success)
      return NextResponse.json(
        {
          success: auth.success,
          error: auth.error,
        },
        { status: +auth.status || 401 }
      );

    const { id } = await params;

    const formData = await request.formData();
    const rowData = Object.fromEntries(formData.entries());


    const validResult = createModuleSchema.safeParse({
      ...rowData,
      order: Number(rowData.order),
    });
    if (!validResult.success)
      return NextResponse.json(
        {
          success: false,
          error: validResult.error.name,
          fieldErrors: validResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );

    const existingModule = await prisma.module.findUnique({
      where: { id },
    });
    if (!existingModule)
      return NextResponse.json(
        {
          success: false,
          error: "This module not found",
        },
        { status: 404 }
      );

    const compair = getEqualFields(existingModule, validResult.data);
    if (compair.changedFields.length === 0)
      return NextResponse.json(
        {
          success: true,
          message: "No changes detected",
        },
        { status: 200 }
      );


    const updateModule = await prisma.module.update({
      where: { id },
      data: validResult.data,
    });

    if (!updateModule)
      return NextResponse.json(
        {
          success: false,
          error: "Updating failed",
        },
        { status: 501 }
      );

    return NextResponse.json({
      success: true,
      message: `${validResult.data.title.slice(0, 16)} Updated Successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success) return NextResponse.json({
          success: false,
          error: auth.error,
    }, { status: +auth.status || 401 });

    const {id} = await params;

    const deleteModule = await prisma.module.delete({
      where: {id}
    })

    if(!deleteModule) return NextResponse.json({
      success: false,
      error: "Deleting failed"
    }, {status: 501})

    return NextResponse.json({
      success: true,
      message: `${deleteModule.title.slice(0, 16)} Deleted Successfully`
    }, {status: 201})

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
