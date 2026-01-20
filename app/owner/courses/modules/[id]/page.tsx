"use client"

import TopControl2 from "@/components/layout/top-control2"
import ModuleList from "@/module/course/module/components/module-list";
import { useIdStore } from "@/store";
import { use, useEffect } from "react";

export default function Modules({params}: {params: Promise<{id: string}>}) {

  const {id} = use(params)
  const {setId} = useIdStore()
  useEffect(()=>{
    setId(id)
  },[id, setId])


  return (
    <section
      className=" w-full h-screen p-2 
    text-zinc-100 overflow-hidden">
    
    <div className="
      w-full h-full p-4
      flex flex-col gap-4
      bg-linear-to-tr from-[#004934d7] to-[#001b12e1]
      backdrop-blur-md border border-black
      shadow-inner shadow-[#00835e]/50 rounded-4xl">

      <TopControl2
        backRoute="/owner/courses"
        backText="Back to courses"
        createRoute={`/owner/courses/modules/${id}/action`}
        createText="Create Module"
      />


      <div className="relative flex-1 rounded-lg bg-emerald-800/40">
        <ModuleList />

      </div>
      </div>
    </section>
  );
}
