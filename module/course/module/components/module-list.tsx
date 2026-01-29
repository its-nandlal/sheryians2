"use client";

import Pagination from "@/components/ui/pagination";
import { CirclePlus, FolderClosed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useModuleDelete, useModules } from "../hooks/useModules";
import { usePaginationStore } from "@/store/use-pagination-store";
import { IsLoadingSkilaton } from "@/module/instructor/components/InstructorsList";
import { Message } from "@/components/layout/message-box";
import { use2IdStore, useDialogActionStore, useFormDataStore, useFormTypeStore, useIdStore } from "@/store";
import { Module } from "@prisma/client";
import DropdownMenuAction from "@/components/layout/dropdown-menu";
import { useRouter } from "next/navigation";

export default function ModuleList() {
  const [count, setCount] = useState(8);

  const page = usePaginationStore((state) => state.page);
  const search = usePaginationStore((state) => state.search)
  const { id: courseId } = useIdStore();
  const { setType } = useFormTypeStore();
  const {setOpen } = useDialogActionStore()
  const {setId} = use2IdStore()
  const {setData} = useFormDataStore()


  const router = useRouter()


  const { data, isPending, isError, refetch } = useModules({
    page,
    search,
    limit: count,
    id: courseId,
  });

  const deleteMutate = useModuleDelete()

  const paginationData = useMemo(
    () => ({
      pages: data?.totalPages ?? 0,
      total: data?.total ?? 0,
      currentPage: page,
    }),
    [data?.totalPages, data?.total, page],
  );


  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;

      if (width < 640)
        setCount(15); // mobile
      else if (width < 768)
        setCount(10); // sm
      else if (width < 1024)
        setCount(20); // md
      else if (width < 1280)
        setCount(30); // lg
      else if (width < 1440)
        setCount(40); // xl
      else if (width < 1920) setCount(40);
      else setCount(48); // xl
    };

    updateCount(); // initial
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);


  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  const handleDetete = (id: string) => {
    deleteMutate.mutate(id)
  }

const handleEdite = (id: string, data: Module) => {
  setType("edit")
  setOpen(true)
  setId(id)
  setData(data)
  router.push(`/owner/courses/modules/${courseId}/action`)
}


const handleRediract = (moduleId: string) => {
  router.push(`/owner/courses/modules/chapters/${moduleId}`)
}



  return (
    <div className="w-full h-full">
      {isPending ? (
        <IsLoadingSkilaton />
      ) : isError ? (
        <Message message="Data Fetching Error" onReload={refetch} />
      ) : data.success && data.data.length === 0 ? (
        <Message
          icon={CirclePlus}
          message="Modules Not Found ( Please create module )"
          rediract={`/owner/courses/modules/${courseId}/action`}
          rediractText="Create Module"
        />
      ) : (
        <div className="w-full h-full p-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {data.data
            .sort((a, b) => a.order - b.order)
            .map((module: Module) => (
              <DropdownMenuAction 
              key={module.id} 
              actionText="Module" 
              viewText="View Chapters"
              viewAction={()=> handleRediract(module.id)}
              title={module.title.slice(0, 10)}
              copyIdAction={()=> handleCopyId(module.id)}
              editAction={()=> handleEdite(module.id, module)}
              deleteAction={()=> handleDetete(module.id)}>
                <div 
                className="w-fit h-fit flex flex-col items-center gap-2 transition cursor-pointer group">
                  <div className="relative w-32 sm:w-24 aspect-square bg-linear-to-br from-emerald-600/80 to-emerald-800/80 backdrop-blur-xl border-2 border-emerald-500/50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-emerald-400/50 transition-all group-hover:scale-105">
                    <FolderClosed className="w-20 text-white/90 group-hover:text-emerald-100 transition-all" />

                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-500 text-black font-bold text-xs rounded-full flex items-center justify-center shadow-md shadow-black/30 ring-2 ring-emerald-500/50">
                      #{module.order}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-emerald-100 truncate w-full text-center bg-emerald-900/50 px-2 py-1 rounded-lg backdrop-blur-sm border border-emerald-700/40 group-hover:bg-emerald-800/70 transition-all">
                    {module.title}
                  </p>
                </div>
              </DropdownMenuAction>
            ))}
        </div>
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
  );
}
