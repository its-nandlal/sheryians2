"use client"

import TopControl from "@/components/layout/top-control";
import { useInstructorsStore } from "@/module/instructor/store/instructors-store";



export default function Courses() {

  const {setSearch} = useInstructorsStore()
  return (
    <section className="w-full h-screen grid grid-rows-6 gap-2 p-2 overflow-hidden text-zinc-100">
      
      {/* Top Control Panel */}
      <TopControl 
      createRoute="/owner/courses/create"
      createText="Create Course" 
      secoundCreateRoute="/owner/courses/instructors/create"
      secoundCreateText="Create instructors"
      viewRoute="/owner/courses/instructors"
      viewText="View instructors"
      setSearch={setSearch}
      />
      
      {/* Main Content Area */}
      <div className="w-full h-full p-4 row-span-5 bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 rounded-4xl">
        <div className="w-full h-full flex items-center justify-center">
          <p className="font-[NeueMachina] text-2xl text-[#00835e]/50">Content Area</p>
        </div>
      </div>

    </section>
  );
}
