
import TopControl from "@/components/layout/top-control";
import CoursesList from "@/module/course/( course )/components/courses-list";


export default function Courses() {

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
      />
      
      {/* Main Content Area */}
      <div className="w-full h-full row-span-5
      bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 rounded-4xl">
        <CoursesList />
      </div>

    </section>
  );
}
