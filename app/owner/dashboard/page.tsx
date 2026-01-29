"use client";

import AreaChartCard from "@/module/ownerdashbord/components/area-chart-card";
import { useOwnerDashord } from "@/module/ownerdashbord/hooks/useOwnerDashord";
import Image from "next/image";
import { format } from "date-fns";
import ButtonPrimary from "@/components/ui/button-primary";
import Link from "next/link";

export default function Dashbord() {
  const { data, isPending, isError } = useOwnerDashord();

  if (isPending) {
    return <div className="w-full h-full bg-emerald-100 animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Something went wrong
      </div>
    );
  }

  // 🔥 STUDENT REGISTER GRAPH (DATE-WISE COUNT)
  const studentGraphData = Object.values(
    data.data.students.reduce((acc, student) => {
      const dateKey = format(new Date(student.createdAt), "yyyy-MM-dd");

      if (!acc[dateKey]) {
        acc[dateKey] = {
          createdAt: dateKey,
          value: 0,
        };
      }

      acc[dateKey].value += 1;
      return acc;
    }, {} as Record<string, { createdAt: string; value: number }>)
  ).sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  return (
    <div className="w-full h-screen p-4 space-y-6">
      <div className="w-full grid grid-cols-2 gap-4">
        {/* STUDENT REGISTER */}
        <div className="w-full space-y-4 border border-dashed border-emerald-700 p-2 rounded-md">
          <h2 className="font-[NeueMachina] text-2xl">
            Students Register
          </h2>

          <div className="h-65">
          <AreaChartCard data={studentGraphData} />
          </div>

        </div>

        {/* BUY COURSE (future) */}
        <div className="w-full space-y-4 border border-dashed border-emerald-700 p-2 rounded-md">
          <h2 className="font-[NeueMachina] text-2xl">Buy Courses</h2>
          <div className="w-full h-65 bg-emerald-500/20 rounded-md" />
        </div>
      </div>

      {/* RECENT COURSES */}
      <div className="w-full space-y-4">
        <div className="w-full flex items-center justify-between p-2 pl-4
        bg-linear-to-tr from-emerald-800/10 to-emerald-500/20 backdrop-blur-md
        border border-emerald-800/20 rounded-4xl">
          <h2 className="font-[NeueMachina] text-2xl leading-0">
            Recently Created Courses
          </h2>
          <Link href={"/owner/courses"}>
            <ButtonPrimary
            size={"sm"}
            variant={"secondary"}>
              View Courses
            </ButtonPrimary>
          </Link>
        </div>

        <div className="w-full grid grid-cols-3 gap-4">
          {data.data.courses.map((course) => (
            <div
              key={course.id}
              className="relative aspect-video bg-emerald-500/20 border border-emerald-800 rounded-md overflow-hidden group"
            >
              <Image
                src={course.thumbnailUrl || course.bannerUrl || ""}
                alt={course.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover group-hover:scale-105 ease-in-out duration-300"
              />

              <div className="absolute bottom-0 left-0 w-full p-2 space-y-1 bg-emerald-950/60 backdrop-blur rounded-t-md group-hover:bg-emerald-900/60">
                <p className="text-sm truncate">{course.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
