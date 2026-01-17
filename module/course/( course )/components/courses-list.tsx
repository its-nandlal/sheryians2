"use client"

import { usePaginationStore } from "@/store/use-pagination-store"
import { getCourse, useCourses } from "../hooks/useCourses"
import { useMemo } from "react"
import { IsLoadingSkilaton } from "@/module/instructor/components/InstructorsList"
import { Message } from "@/components/layout/message-box"
import { CirclePlus } from "lucide-react"
import Pagination from "@/components/ui/pagination"
import CoursesCard from "./courses-card"

export default function CoursesList() {
  // ✅ Use STORE page as single source of truth
  const page = usePaginationStore((state) => state.page)
  const search = usePaginationStore((state) => state.search)

  const { data, isPending, isError, refetch } = useCourses({ 
    page, 
    search, 
    limit: 9 
  })

  // ✅ Use store page + API data consistently
  const paginationData = useMemo(() => ({
    pages: data?.totalPages ?? 0,
    total: data?.total ?? 0,
    currentPage: page // Use store page, not data.currentPage
  }), [data?.totalPages, data?.total, page])

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 justify-between">
      <div className="relative w-full h-[92%] grid grid-cols-3 grid-rows-3 gap-4">
        {isPending ? (
          <IsLoadingSkilaton />
        ) : isError ? (
          <Message message="Data Fetching Error" onReload={refetch} />
        ) : data?.success && data.data.length === 0 ? (
          <Message
            icon={CirclePlus}
            message="Courses Not Found (Please create course)"
            rediract="/owner/courses/create"
            rediractText="Create Course"
          />
        ) : (
          data?.data.map((course: getCourse) => (
            <CoursesCard key={course.id} course={course} />
          ))
        )}
      </div>

      {paginationData.pages > 1 && (
        <Pagination 
          pages={paginationData.pages} 
          total={paginationData.total} 
          currentPage={page} // Pass store page
        />
      )}
    </div>
  )
}
