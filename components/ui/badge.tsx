import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "w-fit h-fit text-zinc-300 text-sm font-[Helvetica] px-3 py-1 bg-zinc-200/5 backdrop-blur-sm border border-white/10 rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Badge;
