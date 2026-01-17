import AlertMessage from "@/components/layout/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  IndianRupee,
  Clock,
  BarChart3,
  Layers,
  Eye,
  Pen,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { getCourse, useDeleteCourse } from "../hooks/useCourses";
import Link from "next/link";

interface CoursesCardProps {
  course: getCourse;
}

/* ----------------------------------
   Reusable Info Field
----------------------------------- */
interface InfoFieldProps {
  icon: React.ReactNode;
  heading: string;
  value: string | number | null;
  highlight?: boolean;
}

function InfoField({
  icon,
  heading,
  value,
  highlight = false,
}: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-[NeueMachina] font-bold uppercase tracking-wider text-emerald-400/80">
        {heading}
      </p>

      <span
        className={`
          flex items-center gap-1.5
          text-[10px] font-semibold
          px-2 py-1.5 rounded-lg
          border transition-all
          ${
            highlight
              ? "text-teal-300 bg-linear-to-r from-teal-900/40 to-emerald-600/40 border-teal-500/30"
              : "bg-emerald-800/50 border-emerald-800/40 group-hover:bg-emerald-900/70"
          }
        `}
      >
        {icon}
        {value}
      </span>
    </div>
  );
}

/* ----------------------------------
   Duration Formatter
----------------------------------- */
const formatDuration = (duration: string): string => {
  const map: Record<string, string> = {
    ONE_MONTH: "1 Month",
    THREE_MONTHS: "3 Months",
    SIX_MONTHS: "6 Months",
    NINE_MONTHS: "9 Months",
    ONE_YEAR: "12 Months",
  };
  return map[duration] ?? duration;
};

export default function CoursesCard({ course }: CoursesCardProps) {
  const { mutate: deleteCourse } = useDeleteCourse();

  const handleDelete = (id: string) => {
    deleteCourse(id);
  }


  return (
    <article
      className="relative group w-full h-full p-2 rounded-2xl 
      bg-linear-to-br from-emerald-950/70 via-[#002a1e]/80 to-black/80 
      backdrop-blur-xl border border-emerald-800/40 
      shadow-inner shadow-emerald-500/10 text-zinc-100 
      hover:scale-[1.02] ease-initial duration-500 cursor-pointer overflow-hidden">
      {/* Glow */}

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none
        group-hover:bg-emerald-400/5 transition-all duration-500"
      />

      <div className="relative grid grid-cols-2 gap-2 w-full h-full">
        {/* LEFT */}
        <div className="flex flex-col justify-between gap-2">
          {/* Image */}
          <div className="aspect-video rounded-lg overflow-hidden border border-emerald-800/40">
            <Image
              src={course.thumbnailUrl || course.bannerUrl}
              alt={course.title}
              width={1280}
              height={720}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Title */}
          <div className="px-2 py-1.5 rounded-md bg-emerald-800/70 border border-emerald-800/40">
            <p className="text-xs font-[NeueMachina] font-bold truncate">
              {course.title}
            </p>
          </div>

          {/* Start Time */}
          {/* <InfoField
            icon={<Clock className="w-3 h-3 text-emerald-300" />}
            heading="Start Time"
            value={course.startTime}
          /> */}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-between">
          {/* Price */}
          <InfoField
            icon={<IndianRupee className="w-3 h-3" />}
            heading="Price"
            value={course.price}
          />

          {/* Discount Price */}
          <InfoField
            icon={<IndianRupee className="w-3 h-3" />}
            heading="Discount Price"
            value={course.discountedPrice}
            highlight
          />

          {/* Duration */}
          <InfoField
            icon={<BarChart3 className="w-3 h-3 text-emerald-300" />}
            heading="Duration"
            value={formatDuration(course.duration)}
          />

          {/* Level */}
          <InfoField
            icon={<Layers className="w-3 h-3 text-emerald-300" />}
            heading="Level"
            value={course.level.toLowerCase()}
          />
        </div>


      </div>

      {/* Hover Actions */}
      <div
        className="absolute top-0 left-0 w-full h-full
      flex items-center justify-center gap-2
       bg-zinc-900/50 backdrop-blur-[1px] opacity-0
       hover:opacity-100 ease-in-out duration-300"
      >
        <Link
          href={`/owner/courses/${course.id}`}
          className="p-3 rounded-full
        bg-emerald-900/90 backdrop-blur-md 
        border border-emerald-800/50
        shadow-inner shadow-emerald-800/20
        hover:bg-emerald-700/80 ease-in-out duration-200"
        >
          <Eye className="w-4 h-4" />
        </Link>

        <Link
          href={`/owner/courses/edit/${course.id}`}
          className="p-3 rounded-full
        bg-emerald-900/90 backdrop-blur-md 
        border border-emerald-800/50
        shadow-inner shadow-emerald-800/20
        hover:bg-emerald-700/80 ease-in-out duration-200"
        >
          <Pen className="w-4 h-4" />
        </Link>

        <Link
          href={`/owner/courses/modules/${course.id}`}
          className="p-3 rounded-full
        bg-emerald-900/90 backdrop-blur-md 
        border border-emerald-800/50
        shadow-inner shadow-emerald-800/20
        hover:bg-emerald-700/80 ease-in-out duration-200"
        >
          <Layers className="w-4 h-4" />
        </Link>

        <AlertMessage
          title="Delete this course?"
          description={`This action cannot be undone. This will permanently delete the "${course.title.slice(0,10)}" course and all its associated data.`}
          onConfirm={()=> handleDelete(course.id)}
          onConfirmText="Delete course"
        >
          <Button
            variant="ghost"
            className="p-1 rounded-full bg-red-700/50 hover:bg-red-600 hover:text-white transition">
            <Trash2 className="w-3 h-3" />
          </Button>
        </AlertMessage>
      </div>

    </article>
  );
}
