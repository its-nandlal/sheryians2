"use client"
import { useCourse } from "@/module/course/( course )/hooks/useCourses"
import { use } from "react"

export default function ViewCourse({params}: {params: Promise<{id: string}>}) {

    const {id} = use(params)
    const {data, isError} = useCourse(id)

  return (
    <div>
      <h2>View Course</h2>
      {id}

      <h3>Data</h3>
      {data?.success ? (
        <>
        {data.data}
        </>) : (
          <div>
            data not found
            {isError}
          </div>)}
    </div>
  )
}
