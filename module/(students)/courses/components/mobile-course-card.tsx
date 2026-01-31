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
  BEGINNER: { label: "Beginner", icon: GraduationCap, className: "bg-green-500/20 text-green-400 border-green-500/30" },
  ELEMENTARY: { label: "Elementary", icon: ShieldCheck, className: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  INTERMEDIATE: { label: "Intermediate", icon: Star, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  ADVANCED: { label: "Advanced", icon: Award, className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  EXPERT: { label: "Expert", icon: Crown, className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
}

const durationMap: Record<string, string> = {
  ONE_MONTH: "1 Month · 40–60 hrs",
  THREE_MONTHS: "3 Months · 120–180 hrs",
  SIX_MONTHS: "6 Months · 240–360 hrs",
  NINE_MONTHS: "9 Months · 360–540 hrs",
  ONE_YEAR: "1 Year · 480–720 hrs",
}

export default function MobileCourseCard({ course }: { course: getCourse }) {
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

  const formattedStartDate = startTime
    ? new Date(startTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : 'TBA'

  return (
    <Link
      href={`/dashboard/courses/${id}`}
      className="group block transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-full"
    >
      <div
        className={`
          flex flex-col overflow-hidden
          h-full min-h-65 sm:min-h-65 md:min-h-70
          border border-emerald-700/30 rounded-xl
          bg-linear-to-br from-emerald-900/40 to-transparent
          backdrop-blur-md
          shadow-lg shadow-emerald-900/40
          hover:shadow-xl hover:shadow-emerald-500/30 
          hover:border-emerald-500/50
          transition-all duration-500 ease-out
        `}
      >
        {/* Image */}
        <div className="relative w-full aspect-4/3 sm:aspect-5/3 md:aspect-2/1 overflow-hidden">
          <Image
            src={thumbnailUrl || bannerUrl || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className="
              absolute top-2 left-2 sm:top-3 sm:left-3
              px-2.5 py-1 sm:px-3 sm:py-1
              text-xs sm:text-sm font-bold
              bg-linear-to-r from-emerald-500/95 to-teal-500/95 text-black
              rounded-full shadow-lg z-10
            ">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-3 sm:gap-4">
          {/* Price + badges section */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-md">
                  ₹{(discountedPrice ?? price).toLocaleString()}
                </p>
                {hasDiscount && (
                  <p className="text-xs sm:text-sm font-medium text-emerald-400/70 line-through">
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

            {/* Info chips - horizontal on mobile when space allows */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="
                flex items-center gap-1.5 sm:gap-2 
                text-xs sm:text-sm text-emerald-300/90 
                bg-emerald-500/10 px-2.5 py-1.5 sm:p-2 rounded-lg
              ">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Starts {formattedStartDate}</span>
              </div>

              <div className="
                flex items-center gap-1.5 sm:gap-2 
                text-xs sm:text-sm text-emerald-300/90 
                bg-emerald-500/10 px-2.5 py-1.5 sm:p-2 rounded-lg
              ">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{durationMap[duration] ?? "Custom"}</span>
              </div>
            </div>

            {/* Level badge */}
            <Badge
              className={`
                w-fit text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5
                font-semibold shadow-md flex items-center gap-1.5 sm:gap-2
                ${levelInfo.className}
              `}
            >
              <levelInfo.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {levelInfo.label}
            </Badge>
          </div>

          {/* Title */}
          <div className="mt-auto">
            <p
              className={`
                font-[NeueMachina] text-sm sm:text-base leading-tight
                line-clamp-2 sm:line-clamp-2
                bg-emerald-800/50 backdrop-blur-sm rounded-lg
                p-2.5 sm:p-3
                text-emerald-100/95 font-semibold
                group-hover:text-emerald-50 sm:group-hover:underline
                transition-colors duration-300
              `}
            >
              {title}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}