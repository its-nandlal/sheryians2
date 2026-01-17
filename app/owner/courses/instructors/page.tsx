
import TopControl from "@/components/layout/top-control";
import InstructorsList from "@/module/instructor/components/InstructorsList";


export default function Instructor() {

  
  return (
    <section
    className="w-full h-screen grid grid-rows-6 gap-2 p-2 overflow-hidden text-zinc-100">

      <TopControl 
      createRoute="/owner/courses/instructors/create"
      createText="Create Instructor" 
      secoundCreateRoute="/owner/courses/create"
      secoundCreateText="Create Course"
      viewRoute="/owner/courses"
      viewText="View Courses"
      />
      
      <div className="w-full h-full row-span-5
      bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 rounded-4xl">
        <InstructorsList />
      </div>

    </section>
  )
}
