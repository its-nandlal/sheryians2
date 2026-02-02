import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/module/auth/actions";
import prisma from "@/lib/prisma";
import { razorpayInstance } from "@/lib/razorpay";
import { z } from "zod";

const buySchema = z.object({
  couponId: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let couponId: string | undefined;
    try {
      const body = await request.json();
      const parsed = buySchema.parse(body);
      couponId = parsed.couponId;
    } catch {
      // No body or invalid JSON, couponId remains undefined
    }

    const authCheck = await checkAuth();
    if (!authCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error,
        },
        { status: +authCheck.status }
      );
    }

    const userId = authCheck.data!.id;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "Already enrolled in this course",
        },
        { status: 400 }
      );
    }

    // Get course
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

    let discountAmount = 0;
    let coupon = null;

    if (couponId) {
      coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid coupon",
          },
          { status: 400 }
        );
      }

      // Check coupon validity (dates, usage, etc.)
      const now = new Date();
      if (coupon.startsAt > now || coupon.expiresAt < now) {
        return NextResponse.json(
          {
            success: false,
            error: "Coupon expired",
          },
          { status: 400 }
        );
      }

      // Calculate discount
      discountAmount = coupon.discountValue;
    }

    // Use discounted price if available, otherwise regular price
    const basePrice = course.discountedPrice ?? course.price;
    const amount = Math.max(0, basePrice - discountAmount);

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        customer_name: user.name,
        customer_email: user.email,
      },
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save order in DB
    const order = await prisma.order.create({
      data: {
        courseId: id,
        userId,
        amount,
        originalAmount: basePrice,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        couponId: coupon?.id,
        razorpayOrderId: razorpayOrder.id,
        status: "PENDING",
        currency: "INR",
        receipt: options.receipt,
        customerName: user.name,
        customerEmail: user.email,
      },
    });


    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID, // for frontend
        customer: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Buy course error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}