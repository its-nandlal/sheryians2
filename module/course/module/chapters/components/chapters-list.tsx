import { usePaginationStore } from "@/store/use-pagination-store"
import { useChapters, useDeleteChapters } from "../hooks/useChapters"
import { useEffect, useMemo, useState } from "react"
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore } from "@/store"
import { IsLoadingSkilaton } from "@/module/instructor/components/InstructorsList"
import { Message } from "@/components/layout/message-box"
import { CirclePlus, FileVideoCamera } from "lucide-react"
import DropdownMenuAction from "@/components/layout/dropdown-menu"
import { useRouter } from "next/navigation"
import { Chapter } from "@prisma/client"
import Pagination from "@/components/ui/pagination"

export default function ChaptersList({moduleId}: {moduleId: string}) {

  const [count, setCount] = useState(10)

  const page = usePaginationStore((state) => state.page)
  const search = usePaginationStore((state) => state.search)
  const setType = useFormTypeStore((state) => state.setType)
  const setOpen = useDialogActionStore((state) => state.setOpen)
  const setId = use2IdStore((state) => state.setId)
  const setFormData = useFormDataStore((state) => state.setData)

  const router = useRouter()
  const {data, isPending, isError, refetch} = useChapters({
    page: page,
    limit: count,
    search,
    id: moduleId
  })

  const deleteMutate = useDeleteChapters()

  const paginationData = useMemo(() => ({
    pages: data?.totalPages ?? 0,
    total: data?.total ?? 0,
    currentPage: page
  }), [data?.totalPages, data?.total, page])

  useEffect(()=>{
    const updateCount = () =>{
      const width = window.innerWidth;
      if(width < 640) setCount(15)
      else if(width < 768) setCount(10)
      else if(width < 1024) setCount(20)
      else if(width < 1280) setCount(30)
      else if(width < 1440) setCount(40)
      else if(width < 1920) setCount(40)
      else setCount(48)
    }

    updateCount()
    window.addEventListener("resize", updateCount)

    return () => window.removeEventListener("resize", updateCount)
  }, [])

  const handleCopyId = (id: string)=>{
    navigator.clipboard.writeText(id)
  }

  const handleDelete = (id: string) => {
    deleteMutate.mutate(id)
  }

  const handleEdite = (id: string, data: Chapter) => {
    setType("edit")
    setOpen(true)
    setId(id)
    setFormData(data)
    router.push(`/owner/courses/modules/chapters/${moduleId}/action`)
  }

  return (
    <div className="w-full h-full">
      {isPending ? (
        <IsLoadingSkilaton />
      ) : isError ? (
        <Message 
        message="Data Fetching Error" onReload={refetch} />
      ) : data.success && data.data.length === 0 ? (
        <Message 
        icon={CirclePlus}
        message="Chapters Not Found ( Please create a new chapter )"
        rediract={`/owner/courses/modules/chapters/${moduleId}/action`}
        rediractText="Create Chapter"
        />
      ) : data.success && data.data.length > 0 && (
        <>
        <div className="w-full h-full p-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {data.data.map((chapter, index) => (
          <DropdownMenuAction
          key={chapter.id.slice(0,8)}
          actionText="Chapters"
          title={chapter.title.slice(0, 20)}
          copyIdAction={() => handleCopyId(chapter.id)}
          deleteAction={() => handleDelete(chapter.id)}
          editAction={() => handleEdite(chapter.id, chapter)}>
            <div 
            className="w-fit h-fit flex flex-col items-center gap-2 transition cursor-pointer group">
              <div className="relative w-32 sm:w-24 aspect-square bg-linear-to-br from-emerald-600/80 to-emerald-800/80 backdrop-blur-xl border-2 border-emerald-500/50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-emerald-400/50 transition-all group-hover:scale-105">
                <FileVideoCamera className="w-28 h-28 text-emerald-400/90 group-hover:text-emerald-100 transition-all" />
                

                <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-500 text-black font-bold text-xs rounded-full flex items-center justify-center shadow-md shadow-black/30 ring-2 ring-emerald-500/50">
                  #{index}
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-emerald-100 truncate w-full text-center bg-emerald-900/50 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-700/40 group-hover:bg-emerald-800/70 transition-all">
                {chapter.title.slice(0, 16)}
              </p>
            </div>
          </DropdownMenuAction>
          ))}
        </div>
        </>
      )}

      {paginationData.pages > 1 && (
        <div className="w-full py-2 px-4">
          <Pagination 
          pages={paginationData.pages}
          total={paginationData.total}
          currentPage={paginationData.currentPage} 
          />
        </div>
      )}
    </div>
  )
}
