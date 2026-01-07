// "use client"

import { useInstructors } from "../hooks/useInstructors";
import { Instructor } from "@prisma/client";
import { useInstructorsStore } from "../store/instructors-store";
import Pagination from "@/components/ui/pagination";
import InstructorCard from "./InstructorCard";
import { useMemo } from "react";
import { Message } from "@/components/layout/message-box";
import { CirclePlus } from "lucide-react";

export default function InstructorsList() {
  const page = useInstructorsStore((state) => state.page);
  const search = useInstructorsStore((state) => state.search);

  const { data, isLoading, isError, refetch } = useInstructors({
    page,
    limit: 9,
    search,
  });

  const { pages, total, currentPage } = useMemo(
    () => ({
      pages: data?.totalPages ?? 0,
      total: data?.total ?? 0,
      currentPage: data?.currentPage ?? 0,
    }),
    [data]
  );

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 justify-between">
      <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 9 }).map((_, index) => (
              <InstructorCard
                key={index}
                className="from-emerald-950 via-[#002a1e] to-black animate-pulse duration-500 pointer-events-none"
              />
            ))}
          </>
        ) : isError ? (
          <Message message="Data Fetch Error" onReload={refetch} />
        ) : data?.success && data.data.length === 0 ? (
          <Message
            icon={CirclePlus}
            message="Instructor Not Found"
            rediract="/owner/courses/instructors/create"
            rediractText="Create Instructor"
          />
        ) : (
          <>
            {data?.data.map((instructor: Instructor) => (
              <InstructorCard instructor={instructor} key={instructor.id} />
            ))}
          </>
        )}
      </div>

      {pages > 1 && (
        <Pagination pages={pages} total={total} currentPage={currentPage} />
      )}

    </div>
  );
}
