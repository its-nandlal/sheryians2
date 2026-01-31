"use client"

import ProductCard from "@/components/layout/product-card";
import { useCourse } from "../../hooks";
import { durationMap, levelConfig } from "../../components/course-card";
import { Calendar, Clock, Star } from "lucide-react";
import Badge from "@/components/ui/badge";
import ButtonPrimary from "@/components/ui/button-primary";

export default function Course({id}:{id: string}) {

  const {data, isPending} = useCourse(id)

  if(isPending){
    return <div>Loading...</div>
  }

  if(!data?.data){
    return <div>No data found</div>
  }

  const price = data.data.price
  const discountPrice = data.data.discountedPrice

  const hasDiscount = discountPrice != null && discountPrice < price
  const discountPercent = hasDiscount
  ? Math.round(((price - discountPrice) / price) * 100 )
  : 0

  const levelInfo = levelConfig[data.data.level] ?? {
    label: data.data.level,
    icon: Star,
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }

  return (
    <div className="w-full md:h-full flex flex-col-reverse md:grid md:grid-cols-2 max-md:p-2 max-md:pt-4 max-md:gap-10">
      <div className="w-full md:pl-10 md:-mt-32 flex flex-col justify-center gap-5.5">
        {hasDiscount && (
          <div className="w-fit px-4 py-1 text-xs font-[Helvetica] font-bold bg-linear-to-r from-emerald-500/95 to-teal-500/95 text-black rounded-full shadow-lg z-10">
            {discountPercent}% OFF
          </div>
        )}
        
        <div className="md:w-10/12 space-y-2.5">
          
          {/* Sub Title */}
          <div>
            <p className="text-base md:text-lg tracking-wide uppercase font-[Helvetica]">{data.data.subtitle}</p>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl md:text-2xl tracking-wide font-[NeueMachina]">
              {data.data.title}
            </h2>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm md:text-base tracking-wide capitalize font-[Helvetica]">{data.data.description}</p>
          </div>


        </div>

        <div className="w-full flex items-center flex-wrap gap-3">
          <Badge
            className={`w-fit text-xs px-3 py-1.5 font-semibold shadow-md flex items-center gap-1.5 ${levelInfo.className}`}>
            <levelInfo.icon className="w-3.5 h-3.5" />
            {levelInfo.label}
          </Badge>

          <div className="w-fit flex items-center gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 p-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>{durationMap[data.data.duration]}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-300/90 bg-emerald-500/10 p-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            <span>Starts {data.data.startTime}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl md:text-4xl font-[NeueMachina] font-black text-emerald-400 drop-shadow-lg">
              ₹{(discountPrice ?? price).toLocaleString()}
            </h2>
            {hasDiscount && (
              <h2 className="text-base md:text-xl font-[NeueMachina] font-semibold  text-emerald-400/70 line-through">
                ₹{price.toLocaleString()}
              </h2>
            )}
          </div>
          {hasDiscount && (
            <p className="w-fit text-base md:text-lg text-emerald-300/80
            font-[NeueMachina] font-semibold 
            bg-emerald-800/30 backdrop-blur-sm
            px-2 py-1 border border-emerald-600/40
            rounded-md">
              Save ₹{(price - discountPrice!).toLocaleString()}
            </p>
          )}
        </div>

        <div className=" flex items-center gap-2">
          <ButtonPrimary 
          size={"sm"} 
          variant={"secondary"} 
          className="text-base md:text-lg text-nowrap font-[NeueMachina] px-6 md:px-14 max-md:py-3">
            Buy Now  
            <span className="text-sm pl-2 text-emerald-300 tracking-tighter">
              ( ₹{(discountPrice ?? price).toString()} )
            </span>
          </ButtonPrimary>
          <ButtonPrimary 
          size={"sm"} 
          variant={"default"} 
          className="text-base md:text-lg text-nowrap font-[NeueMachina] px-6 md:px-14 max-md:py-3">
            Add Cart
          </ButtonPrimary>
        </div>
      </div>

      <div className="w-full h-full md:pt-20 md:px-10">
        <ProductCard url={data.data.introVideoUrl || ""} tags={data.data.tags} />
      </div>
    </div>
  )
}
