"use client";

import { useRouter } from "next/navigation";
import ButtonPrimary from "../ui/button-primary";
import { LucideIcon } from "lucide-react";

interface MessageProps {
  icon?: LucideIcon;
  message: string;
  onReload?: () => void;
  rediract?: string;
  rediractText?: string;
}

export function Message({ icon: Icon, message, onReload, rediract, rediractText }: MessageProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <p className="font-[NeueMachina] text-2xl text-[#00835e]/50">
        {message}
      </p>

      {onReload && (
        <ButtonPrimary 
        variant={"outline"} 
        size="sm" 
        className="text-xs px-6 text-emerald-300 bg-[#00251bad] backdrop-blur-md tracking-wide hover:text-emerald-300/90"
        onClick={onReload}>
          Try Again
        </ButtonPrimary>
      )}

      {rediract && (
        <ButtonPrimary 
        variant={"outline"}
        size="sm" 
        className="text-xs px-6 text-emerald-300 bg-[#00251bad] backdrop-blur-md tracking-wide hover:text-emerald-300/90 
        flex items-center gap-2"
        onClick={() => router.push(rediract)}>
        {Icon && <Icon className="w-4 h-4"/> } {rediractText}
        </ButtonPrimary>
      )}
    </div>
  );
}
