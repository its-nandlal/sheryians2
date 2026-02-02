"use client";

import Badge from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/module/(students)/dashboard/components/course-card";
import DashboardSkeleton from "@/module/(students)/dashboard/components/dashboard-skeleton";
import RecommendationCard from "@/module/(students)/dashboard/components/recommendation-card";
import { DashboardData, useDashboard } from "@/module/(students)/dashboard/hooks";

import { 
  BookOpen, 
  Library, 
  Clock, 
  Award, 
  TrendingUp,
  Zap,
  Gift
} from "lucide-react";

export default function Dashboard() {
  const { data, isPending, isError, error } = useDashboard();

  if (isPending) return <DashboardSkeleton />;
  
  if (isError) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 to-emerald-950/50 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg border-emerald-800/50 bg-emerald-950/80 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-900/50 flex items-center justify-center border-2 border-emerald-800/50">
              <Zap className="w-10 h-10 text-emerald-400" />
            </div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Loading Error
            </CardTitle>
            <p className="text-emerald-200 text-lg">{error?.message || "Failed to load dashboard data"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboardData = data?.data as DashboardData;
  const sections = [
    {
      icon: BookOpen,
      title: "Recent Courses",
      subtitle: "Newest additions to continue your learning",
      badgeCount: dashboardData.recentCourses.length,
      content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardData.recentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    },
    ...(dashboardData.recommendations.length > 0 ? [{
      icon: Zap,
      title: "Recommended",
      subtitle: "Perfect next steps for your learning",
      badgeCount: dashboardData.recommendations.length,
      color: "orange",
      content: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {dashboardData.recommendations.map((course) => (
          <RecommendationCard key={course.id} course={course} />
        ))}
      </div>
    }] : []),
    ...(dashboardData.enrollments?.length > 0 ? [{
      icon: TrendingUp,
      title: "Your Progress",
      subtitle: "Track your learning journey",
      content: <Card className="border-emerald-800/50 bg-emerald-950/70 backdrop-blur-xl shadow-2xl">
        <CardContent className="pt-8 space-y-6">
          {dashboardData.enrollments.slice(0, 4).map((enrollment) => (
            <div key={enrollment.id} className="group flex items-center gap-6 p-6 bg-emerald-900/50 rounded-2xl border border-emerald-800/50 hover:bg-emerald-900/70 transition-all duration-500 hover:scale-[1.02]">
              <div className="w-3 h-3 bg-emerald-400 rounded-full shrink-0 group-hover:scale-150 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-emerald-100 text-lg truncate">{enrollment.course.title}</p>
                <p className="text-emerald-400 text-sm mt-1 capitalize">{enrollment.course.status}</p>
              </div>
              <div className="w-36 text-right">
                <div className="text-emerald-300 text-sm mb-3 font-medium">
                  {Math.round(enrollment.progress)}% Complete
                </div>
                <div className="h-3 bg-emerald-900/70 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    }] : [])
  ];

  const stats = [
    {
      icon: BookOpen,
      label: "Active Learning",
      title: "Total Enrollments",
      value: dashboardData.stats.totalEnrollments,
      color: "emerald"
    },
    {
      icon: Clock,
      label: "Awaiting Action",
      title: "Pending Payments",
      value: dashboardData.stats.pendingPayments || 0,
      color: "orange"
    },
    {
      icon: Library,
      label: "Full Catalog",
      title: "Courses Available",
      value: dashboardData.stats.totalCourses,
      color: "teal"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full px-6 py-10">
        {/* ✅ FIXED Header – size reduced */}
        <header className="mb-16 backdrop-blur-xl bg-white/5 border border-emerald-900/50 rounded-3xl p-10 md:p-5">
          <div className="flex items-center gap-4 mb-6 max-md:flex-col">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl p-5 border-2 border-emerald-500/40 flex items-center justify-center">
              <Award className="w-10 h-10 text-emerald-400" />
            </div>
            <div className=" max-md:text-center">
             <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent leading-tight">
               Welcome Back!
             </h1>
             <p className="text-xl md:text-2xl font-semibold text-emerald-100 font-[NeueMachina]">
               {dashboardData.user?.name || "Student"}
             </p>
            </div>
          </div>
          <p className="text-lg text-emerald-200 max-md:text-center">
            Continue your learning journey with {dashboardData.stats.totalEnrollments} active courses
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 📊 Stats Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {stats.map(({ icon: Icon, label, title, value, color }, index) => (
              <Card 
                key={index}
                className="group border-emerald-800/60 bg-emerald-950/70 backdrop-blur-xl hover:border-emerald-700/80 hover:bg-emerald-950/90 transition-all duration-500 overflow-hidden shadow-xl"
              >
                <CardHeader className="md:pb-6">
                  <div className="flex items-center gap-4 md:mb-4">
                    <div className={`group-hover:scale-110 transition-transform duration-500 p-4 rounded-xl bg-${color}-500/20 group-hover:bg-${color}-500/40 border-2 border-${color}-500/50 group-hover:border-${color}-500/80`}>
                      <Icon className={`w-8 h-8 text-${color}-400 group-hover:text-${color}-300`} />
                    </div>
                    <div>
                      <p className={`text-${color}-400 font-medium text-sm uppercase tracking-wide`}>{label}</p>
                      <CardTitle className={`text-xl font-semibold text-${color}-200`}>{title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-5xl font-black bg-linear-to-r from-${color}-400 via-${color}-300 to-${color}-500 bg-clip-text text-transparent`}>
                    {value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </aside>

          {/* 📈 Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map(({ icon: Icon, title, subtitle, badgeCount, color = "emerald", content }, index) => (
              <section key={index}>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex md:items-center gap-4 max-md:flex-col">
                    <div className={`w-fit p-4 rounded-2xl bg-${color}-500/20 border-2 border-${color}-500/40`}>
                      <Icon className={`w-8 h-8 text-${color}-400`} />
                    </div>
                    <div>
                      <h2 className={`text-4xl font-black bg-linear-to-r from-${color}-400 via-${color}-300 to-${color}-500 bg-clip-text text-transparent`}>
                        {title}
                      </h2>
                      <p className={`text-${color}-300 mt-2`}>{subtitle}</p>
                    </div>
                  </div>
                  {badgeCount !== undefined && (
                    <Badge className={`bg-${color}-500/20 text-${color}-300 border-${color}-500/40 px-6 py-3 text-xl font-bold h-fit`}>
                      {badgeCount}
                    </Badge>
                  )}
                </div>
                {content}
              </section>
            ))}
          </div>
        </div>

        {/* Active Coupons */}
        {dashboardData.coupons?.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40">
                <Gift className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black bg-linear-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  Active Coupons
                </h2>
                <p className="text-emerald-300 mt-2">Exclusive discounts waiting for you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dashboardData.coupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className="group border-emerald-800/50 bg-emerald-950/80 backdrop-blur-xl hover:border-emerald-700/80 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer shadow-xl"
                >
                  <CardContent className="p-8 space-y-4">
                    <div className="font-mono text-3xl font-black bg-linear-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-wider">
                      {coupon.code}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-emerald-100">{coupon.discountValue}%</span>
                      <span className="text-emerald-400 font-medium uppercase tracking-wide">OFF</span>
                    </div>
                    <p className="text-emerald-300 text-lg">
                      Expires {new Date(coupon.expiresAt).toLocaleDateString('en-IN')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}