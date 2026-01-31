import Image from 'next/image'
import { Clock, Calendar, LucideIcon } from 'lucide-react'
import Badge from '@/components/ui/badge'
import Link from 'next/link'
import { GraduationCap, ShieldCheck, Star, Award, Crown } from "lucide-react"
import { getCourse } from '@/module/course/( course )/hooks/useCourses'

export const levelConfig: Record<string, {
  label: string
  icon: LucideIcon
  className: string
}> = {
  BEGINNER: {
    label: "Beginner",
    icon: GraduationCap,
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  ELEMENTARY: {
    label: "Elementary",
    icon: ShieldCheck,
    className: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    icon: Star,
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  ADVANCED: {
    label: "Advanced",
    icon: Award,
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  EXPERT: {
    label: "Expert",
    icon: Crown,
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
}

export const durationMap: Record<string, string> = {
  ONE_MONTH: "1 Month · 40–60 hrs",
  THREE_MONTHS: "3 Months · 120–180 hrs",
  SIX_MONTHS: "6 Months · 240–360 hrs",
  NINE_MONTHS: "9 Months · 360–540 hrs",
  ONE_YEAR: "1 Year · 480–720 hrs",
}

export default function CourseCard({ course }: { course: getCourse }) {
  const {
    id,
    title,
    thumbnailUrl,
    bannerUrl,
    price,
    discountedPrice,
    level,
    duration,
    startTime,
  } = course

  const hasDiscount = discountedPrice != null && discountedPrice < price
  const discountPercent = hasDiscount
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0

  const levelInfo = levelConfig[level] ?? {
    label: level || "Unknown",
    icon: Star,
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }


  return (
    <Link
      href={`/dashboard/courses/${id}`}
      className="group block h-full"
    >
      <div
        className={`
         h-64 flex flex-col
          border border-emerald-700/30 
          bg-linear-to-br from-emerald-900/40 to-transparent
          backdrop-blur-md rounded-xl 
          shadow-lg shadow-emerald-900/40
          hover:shadow-xl hover:shadow-emerald-500/30 
          hover:border-emerald-500/50
          transition-all duration-500 ease-out
          overflow-hidden
        `}
      >
        {/* Image + info row – takes available space */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4 pb-3">
          {/* Left: Image */}
          <div className="relative rounded-lg overflow-hidden group-hover:brightness-110 transition-all duration-300">
            <Image
              src={thumbnailUrl || bannerUrl || "/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {hasDiscount && (
              <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-linear-to-r from-emerald-500/95 to-teal-500/95 text-black rounded-full shadow-lg z-10">
                {discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-between gap-1.5">
            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-emerald-400 drop-shadow-lg">
                  ₹{(discountedPrice ?? price).toLocaleString()}
                </p>
                {hasDiscount && (
                  <p className="text-sm font-medium text-emerald-400/70 line-through">
                    ₹{price.toLocaleString()}
                  </p>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-emerald-300/80 font-medium">
                  Save ₹{(price - discountedPrice!).toLocaleString()}
                </p>
              )}
            </div>

            {/* Start date */}
            <div className="flex items-center gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 p-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Starts {startTime}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 p-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>{durationMap[duration]}</span>
            </div>

            {/* Level */}
            <Badge
              className={`w-fit text-xs px-3 py-1.5 font-semibold shadow-md flex items-center gap-1.5 ${levelInfo.className}`}
            >
              <levelInfo.icon className="w-3.5 h-3.5" />
              {levelInfo.label}
            </Badge>
          </div>
        </div>

        {/* Title – fixed height area at bottom */}
        <div className="px-4 pb-4 pt-1">
          <p
            className={`
              font-[NeueMachina] text-base text-nowrap text-ellipsis leading-tight
              bg-emerald-800/50 backdrop-blur-sm rounded-lg p-3
              line-clamp-2 text-emerald-100/95 font-semibold
              group-hover:text-emerald-50 group-hover:underline
              transition-all duration-300
            `}
          >
            {title}
          </p>
        </div>
      </div>
    </Link>
  )
}