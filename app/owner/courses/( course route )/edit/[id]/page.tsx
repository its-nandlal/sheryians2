"use client"

import { Message } from "@/components/layout/message-box"
import CourseForm from "@/module/course/components/course-form"
import { useCourse } from "@/module/course/( course )/hooks/useCourses"
import { Course } from "@prisma/client"
import { CirclePlus, Loader2 } from "lucide-react"
import { use } from "react"

export default function UpdateCourse({params}: {params: Promise<{id: string}>}) {

  const { id } = use(params)

  const {data, isPending, isError, refetch} = useCourse(id)


  if(isPending){
    return (
      <div className="w-full h-screen bg-emerald-500/20">
        <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />
      </div>
    )
  }

  if(isError) return (
    <Message message="Data Featching Error" onReload={refetch} />
  )

  if(!data.success) return (
    <Message
    icon={CirclePlus}
    message="Courses Not Found ( Please create course )"
    rediract="/owner/courses/create"
    rediractText="Create Course"
    />
  )

  const course = data.data as Course

  return (
    <div className="w-full h-screen overflow-hidden">
        <CourseForm defaultValues={course} mode="edit" />
    </div>
  )
}