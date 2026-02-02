import prisma from "@/lib/prisma";
import { checkAuthOwner } from "@/module/auth/actions";
import { Prisma } from "@prisma/client";
import { createCouponSchema } from "@/module/coupons/schemas";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuthOwner()
    if(!auth.success) return NextResponse.json({
      success: false,
      error: auth.error
    }, { status: +auth.status || 401 })
    
    const {searchParams} = new URL(request.url)

    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * limit

    const where: Prisma.couponWhereInput = {}
    if(search){
      where.OR = [
        {code: {contains: search, mode: "insensitive"}},
        {discountValue: {equals: Number(search)}}
      ]
    }

    const [totalCoupons, coupons] = await prisma.$transaction([
      prisma.coupon.count({where}),
      prisma.coupon.findMany({where, skip, take: limit, orderBy: {createdAt: "desc"}})
    ]) 

    const totalPages = Math.ceil(totalCoupons / limit)

    return NextResponse.json({
      success: true,
      message: `${coupons.length} coupons fetched successfully.`,
      data: coupons,
      total: totalCoupons,
      totalPages,
      currentPage: page,
      limit
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong."
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuthOwner();
    if (!auth.success)
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: +auth.status || 401 }
      );

    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());



    // 🔥 ZOD VALIDATION
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

    // 🔥 DUPLICATE CHECK
    const couponExists = await prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (couponExists)
      return NextResponse.json(
        {
          success: false,
          error: "Coupon with this code already exists.",
        },
        { status: 400 }
      );

    // 🔥 CREATE COUPON
    const newCoupon = await prisma.coupon.create({
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${newCoupon.code} coupon created successfully.`,
        data: newCoupon,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("COUPON_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
