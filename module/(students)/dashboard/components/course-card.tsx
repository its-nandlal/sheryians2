import Image from "next/image";
import Link from "next/link";

// components/CourseCard.tsx
interface CourseCardProps {
  course: { id: string; title: string; thumbnailUrl?: string; level: string; price: number };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/dashboard/courses/${course.id}`} className="group cursor-pointer bg-emerald-800/20 hover:shadow-lg transition-all duration-200 rounded-xl border border-emerald-900 p-4">
      <div className="w-full h-56 bg-linear-to-br from-slate-200 to-slate-300 rounded-lg mb-3 group-hover:scale-105 transition-transform">
        <Image
        src={course.thumbnailUrl || ""}
        alt={course.title}
        width={1200}
        height={720}
        className="w-full h-full object-cover"/>
      </div>
      <h3 className="font-semibold truncate text-sm mb-1">{course.title}</h3>
      <div className="flex items-center justify-between text-xs">
        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">{course.level}</span>
        <span className="font-bold text-emerald-600">₹{course.price}</span>
      </div>
    </Link>
  );
}
