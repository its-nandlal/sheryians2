import ButtonPrimary from "@/components/ui/button-primary";
import CoursesList from "@/module/(students)/courses/components/course-list";
import { BookTextIcon } from "lucide-react";
import Link from "next/link";

export default function Courses() {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-1 py-2 md:p-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-3xl md:text-6xl font-[NeueMachina]">Our Courses</h2>

        <Link href={"/dashboard/classroom"} >
          <ButtonPrimary size={"sm"} variant={"secondary"} className="font-[NeueMachina] text-sm md:text-lg flex items-center gap-2">
            <BookTextIcon className="w-4.5 h-4.5 md:w-6 md:h-6 -mt-0.5" /> Class Room
          </ButtonPrimary>
        </Link>
      </div>

      <div className="w-full flex-1">
        <CoursesList />
      </div>
    </div>
  )
}
