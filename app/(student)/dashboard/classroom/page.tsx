"use client"

import Badge from "@/components/ui/badge"
import { useEnrollments } from "@/module/(students)/enrollment/hooks"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Classroom() {

    const {data: enrollments, isPending} = useEnrollments()

    if(isPending) return <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
    </div>

    if(!enrollments?.success || !enrollments.data) return <div>No data</div>

  return (
    <div className="w-full h-full p-4 flex flex-wrap gap-4 max-md:flex-col">
      {enrollments.data.course.map((course) => (
        <Link href={`/dashboard/classroom/${course.id}`} key={course.id} className="w-full md:w-2/5 h-fit px-3 py-3 shrink-0 flex items-center gap-4 max-md:flex-col
        bg-emerald-600/10 backdrop-blur-md
        border border-emerald-800 rounded-md">
            <div className="w-52 h-32">
                <Image
                src={course.thumbnailUrl || course.bannerUrl || ""}
                alt={course.title}
                width={200}
                height={100}
                className="w-full h-full bg-cover rounded-md"/>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg text-wrap font-[NeueMachina] max-md:text-center">
                {course.title}
              </h2>

              <div className="flex items-center">
              {course.tags.map(t => ( <Badge key={t} className="px-4 scale-90 font-[Helvetica] max-md:text-[9px] text-nowrap" >{t}</Badge> ))}
              </div>
            </div>
        </Link>
      ))}

    </div>
  )
}
