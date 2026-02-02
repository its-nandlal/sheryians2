import prisma from "@/lib/prisma";
import { checkAuth } from "@/module/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAuth();
    
    if (!auth.success) {
      return NextResponse.json({
        success: false,
        error: auth.error
      }, { 
        status: Number(auth.status) || 401 
      });
    }

    const userId = auth.data?.id;
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID not found"
      }, { status: 400 });
    }

    // ✅ FIXED: Separate queries (more reliable than complex transaction)
    const [
      courses, 
      enrollments, 
      user, 
      statsResult, 
      recommendations, 
      coupons
    ] = await Promise.all([
      // 1. Recent Courses
      prisma.course.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          level: true,
          price: true,
          discountedPrice: true,
        }
      }),

      // 2. User Enrollments
      prisma.enrollment.findMany({
        where: { userId },
        orderBy: { enrolledAt: "desc" },
        take: 10,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
              status: true,
            }
          }
        }
      }),

      // 3. User Profile
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }),

      // 4. FIXED Stats - Multiple simple counts
      Promise.all([
        prisma.enrollment.count({ where: { userId } }),
        prisma.course.count(),
        prisma.order.count({ 
          where: { 
            userId, 
            status: "PENDING" 
          } 
        })
      ]),

      // 5. Recommendations
      prisma.course.findMany({
        where: {
          status: "LIVE",
          NOT: {
            enrollments: {
              some: { userId }
            }
          }
        },
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          level: true,
          price: true,
          thumbnailUrl: true,
        }
      }),

      // 6. Active Coupons
      prisma.coupon.findMany({
        where: {
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          discountValue: true,
          expiresAt: true,
        }
      })
    ]);

    // ✅ FIXED Stats destructuring
    const [totalEnrollments, totalCourses, pendingPayments] = statsResult;

    return NextResponse.json({
      success: true,
      data: {
        user: user || null,
        recentCourses: courses,
        enrollments, // ✅ FIXED typo
        stats: { 
          totalEnrollments, 
          totalCourses, 
          pendingPayments 
        },
        recommendations,
        coupons
      }
    }, { 
      status: 200
    });

  } catch (error) {
    console.error("🚨 Dashboard API Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }, { status: 500 });
  }
}
