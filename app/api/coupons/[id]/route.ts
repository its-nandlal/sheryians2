import { getEqualFields } from "@/lib/helper/compair-data";
import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { createCouponSchema } from "@/module/coupons/schemas";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success)
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: +auth.status || 401 }
      );

    const { id } = await params;
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());

    // Validate incoming data
    const validResult = createCouponSchema.safeParse(raw);
    if (!validResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validResult.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const data = validResult.data;
    const couponActive = raw.isActive === "true" ? true : false


    // Find existing coupon
    const existingCoupon = await prisma.coupon.findUnique({ where: { id } });
    if (!existingCoupon)
      return NextResponse.json(
        { success: false, error: "Coupon not found" },
        { status: 404 }
    );

    const compairData = getEqualFields(existingCoupon, {
      ...data,
      startsAt: new Date(data.startsAt),
      expiresAt: new Date(data.expiresAt),  
    })

    if(compairData.changedFields.length === 0 && existingCoupon.isActive === couponActive) return NextResponse.json({
      success: true,
      message: "No changes detected"
    }, { status: 200 })


    // Update coupon
    const updateCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        startsAt: new Date(data.startsAt),
        expiresAt: new Date(data.expiresAt),
        isActive: couponActive, // ✅ Ensure boolean stored
      },
    });

    if (!updateCoupon)
      return NextResponse.json(
        { success: false, error: "Coupon update failed" },
        { status: 500 }
    );

    return NextResponse.json(
      {
        success: true,
        message: `${updateCoupon.code} coupon updated successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {

    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, { status: +auth.status || 401 })

    const {id} = await params;
    console.log(id);


    const existingCoupon = await prisma.coupon.findUnique({
      where: {id}
    })
    if(!existingCoupon) return NextResponse.json({
      success: false,
      error: "Coupon not found"
    }, { status: 404 })

    const deleteCoupon = await prisma.coupon.delete({
      where: {id}
    })
    if(!deleteCoupon) return NextResponse.json({
      success: false,
      error: "Coupon delete failed"
    }, { status: 500 })

    return NextResponse.json({
      success: true,
      message: `${deleteCoupon.code} coupon deleted successfully.`
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong. Please try again."
    }, { status: 500 })
  }
}
