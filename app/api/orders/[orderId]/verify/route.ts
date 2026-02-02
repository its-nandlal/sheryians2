import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/module/auth/actions";
import prisma from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { z } from "zod";

const verifySchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    let razorpay_payment_id: string;
    let razorpay_order_id: string;
    let razorpay_signature: string;

    try {
      const body = await request.json();
      const parsed = verifySchema.parse(body);
      razorpay_payment_id = parsed.razorpay_payment_id;
      razorpay_order_id = parsed.razorpay_order_id;
      razorpay_signature = parsed.razorpay_signature;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 }
      );
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

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }


    if (order.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 403 }
      );
    }

    if (order.status !== "PENDING") {
      if (order.status === "COMPLETED" && order.razorpayPaymentId === razorpay_payment_id) {
        return NextResponse.json({
          success: true,
          message: "Payment already verified",
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: "Order already processed",
        },
        { status: 400 }
      );
    }

    // Verify that the razorpay_order_id matches the order's razorpayOrderId
    if (order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Razorpay order ID",
        },
        { status: 400 }
      );
    }

    // Verify signature
    const isTestMode = process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test') ?? false;
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isTestMode && !isValid) {
      // Update order status to failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
        },
        { status: 400 }
      );
    }


    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: isTestMode ? null : razorpay_signature,
      },
    });


    // Create or update enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: order.courseId,
        },
      },
    });

    if (existingEnrollment) {
      // Update existing enrollment with orderId if not set
      if (!existingEnrollment.orderId) {
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { orderId: order.id },
        });
      } 
    } else {
      // Create new enrollment
      await prisma.enrollment.create({
        data: {
          userId,
          courseId: order.courseId,
          orderId: order.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment created",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      orderId: params ? await params : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}