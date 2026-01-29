"use client"

import TopControl2 from "@/components/layout/top-control2"
import ChaptersList from "@/module/course/module/chapters/components/chapters-list"
import { use2IdStore, useIdStore } from "@/store"
import { use, useEffect } from "react"

export default function Chapters({params}: {params: Promise<{id: string}>}) {
  
  const { id: modileId } = use(params)
  const courseId = useIdStore((state)=> state.id)
  const setId = use2IdStore((state) => state.setId)
  useEffect(()=>{
    setId(modileId)
  }, [setId, modileId])
  
  return (
    <section className="w-full h-screen p-2 overflow-hidden">
    <div className="
      w-full h-full p-4
      flex flex-col gap-4
      bg-linear-to-tr from-[#004934d7] to-[#001b12e1]
      backdrop-blur-md border border-black
      shadow-inner shadow-[#00835e]/50 rounded-4xl">

      <TopControl2
        backRoute={`/owner/courses/modules/${courseId}`}
        backText="Back to module"
        createRoute={`/owner/courses/modules/chapters/${modileId}/action`}
        createText="Create Chapter"
      />


      <div className="relative flex-1 rounded-lg bg-emerald-800/40 p-2">
      <ChaptersList moduleId={modileId} />
      </div>
      </div>
    </section>
  )
}
