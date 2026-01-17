"use client";

import Pagination from "@/components/ui/pagination";
import { FolderClosed } from "lucide-react";
import { useEffect, useState } from "react";

export default function ModuleList() {
  const [count, setCount] = useState(8);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;

      if (width < 640) setCount(15);          // mobile
      else if (width < 768) setCount(10);     // sm
      else if (width < 1024) setCount(20);   // md
      else if (width < 1280) setCount(30);   // lg
      else if (width < 1440) setCount(40);   // xl
      else if (width < 1920)  setCount(40);
      else setCount(48);                     // xl
    };

    updateCount(); // initial
    window.addEventListener("resize", updateCount);

    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="
          w-full h-full py-4
          grid gap-5
          grid-cols-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          xl:grid-cols-8">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 hover:scale-105 transition"
          >
            <div className="relative w-20 sm:w-24 aspect-square">
              <FolderClosed className="w-full h-full text-emerald-600 fill-emerald-500 backdrop-blur-md" />
            </div>
  
            <p className="text-xs sm:text-sm truncate w-[95%] text-center text-ellipsis overflow-hidden">
              Module {index + 1}
            </p>
          </div>
        ))}

      </div>

    <div className="w-full py-2 px-4">
        <Pagination pages={2} total={12} currentPage={1} />
    </div>

    </div>
  );
}
