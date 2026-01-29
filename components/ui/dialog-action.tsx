
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { useRouter } from "next/navigation"
import { useDialogActionStore, useIdStore } from "@/store"

interface DialogActionProps {
  redirecting?: boolean
  redirectingPath?: string
  title?: string
  description?: string
  children: React.ReactNode // ✅ Required
}

export default function DialogAction({
  redirecting = false,
  redirectingPath = "/",
  title = "Create Module",
  description = "Manage module information.",
  children,
}: DialogActionProps) {
  const { open, setOpen } = useDialogActionStore()
  const { id: courseId } = useIdStore()
  const router = useRouter()


  useEffect(() => {
    if (!open && redirecting && courseId) {
      router.back()
    }
  }, [open, redirecting, redirectingPath, courseId, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="
        max-w-md p-6 py-10 bg-transparent
        bg-linear-to-tr from-emerald-900/70 via-emerald-950/70 to-emerald-600/70
        backdrop-blur-xl
        border border-emerald-800 outline outline-emerald-700
        
        rounded-2xl
      ">
        <DialogHeader className="space-y-2 mb-6 font-[NeueMachina]">
          <DialogTitle className="text-3xl font-bold text-emerald-50 tracking-tight leading-1">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-emerald-200/80 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
