import CoursesList from "@/module/(students)/courses/components/course-list";

export default function Courses() {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-1 py-2 md:p-4">
      <div>
        <h2 className="text-3xl md:text-6xl font-[NeueMachina]">Our Courses</h2>
      </div>

      <div className="w-full flex-1">
        <CoursesList />
      </div>
    </div>
  )
}
