"use client"

import { usePaginationStore } from "@/store/use-pagination-store"
import { useMemo, useEffect, useState } from "react"
import { IsLoadingSkilaton } from "@/module/instructor/components/InstructorsList"
import { Message } from "@/components/layout/message-box"
import Pagination from "@/components/ui/pagination"
import { getCourse, useCourses } from "@/module/course/( course )/hooks/useCourses"
import CourseCard from "./course-card"
import MobileCourseCard from "./mobile-course-card"

export default function CoursesList() {
  const page = usePaginationStore((state) => state.page)
  const search = usePaginationStore((state) => state.search)

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // ✅ Safe - client-side only
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768)
    }

    checkScreenSize() // Initial check

    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const { data, isPending, isError, refetch } = useCourses({
    page,
    search,
    limit: 9,
  })

  const paginationData = useMemo(
    () => ({
      pages: data?.totalPages ?? 0,
      total: data?.total ?? 0,
      currentPage: page,
    }),
    [data?.totalPages, data?.total, page]
  )

  return (
    <div className="w-full h-full bg-emerald-700/40 p-2 md:p-4 flex flex-col-reverse md:flex-col justify-between gap-4 rounded-md overflow-hidden pb-28 md:pb-16">
      
      <div className="relative w-full grid md:grid-cols-3 md:grid-rows-3 gap-4 overflow-y-auto">
        
        {/* Loading */}
        {isPending && <IsLoadingSkilaton />}

        {/* Error */}
        {isError && (
          <Message message="Data Fetching Error" onReload={refetch} />
        )}

        {/* Empty */}
        {data?.success && data.data.length === 0 && (
          <Message message="Courses Not Found" />
        )}

        {/* Data */}
        {data?.data?.map((course: getCourse) =>
          isDesktop ? (
            <CourseCard key={course.id} course={course} />
          ) : (
            <MobileCourseCard key={course.id} course={course} />
          )
        )}
      </div>

      {paginationData.pages > 1 && (
        <Pagination
          pages={paginationData.pages}
          total={paginationData.total}
          currentPage={paginationData.currentPage}
        />
      )}
    </div>
  )
}
