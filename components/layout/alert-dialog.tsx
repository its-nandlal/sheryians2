import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ReactNode } from "react";

interface AlertMessageProps {
  children: ReactNode;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onConfirmText?: string;
}

export default function AlertMessage({
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete your data.",
  onConfirm,
  onConfirmText = "Continue",
}: AlertMessageProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      {/* bg-linear-to-tr from-[#004934d7] to-[#001b12e1] backdrop-blur-md border border-[#000000] shadow-inner shadow-[#00835e]/50 */}
      <AlertDialogContent
        className="
          bg-linear-to-tr from-[#01241b] to-[#006545]
          backdrop-blur-xl
          border-2 border-emerald-900
          text-zinc-100
          rounded-2xl
          
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className="font-[NeueMachina] text-lg text-emerald-400"
          >
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription
            className="text-sm text-zinc-300 leading-relaxed"
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            className=" px-6
              bg-emerald-600/20
              text-zinc-200
              border border-emerald-800/40
              hover:text-zinc-200
              hover:bg-emerald-600/40
              transition rounded-full
              cursor-pointer
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className=" px-6
              bg-red-600/30
              text-red-200
              hover:bg-red-700/70
              hover:text-white
              transition rounded-full
              cursor-pointer
            "
          >
            {onConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
