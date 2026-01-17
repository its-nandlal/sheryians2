"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { useRouter } from "next/navigation"

interface DialogActionProps {
  defaultOpen?: boolean
  redirecting?: boolean
  redirectingPath?: string
  title?: string
  description?: string
  children?: React.ReactNode
}

export default function DialogAction({
  defaultOpen = true,
  redirecting = false,
  redirectingPath = "/",
  title = "Create Module",
  description = "Manage module information.",
  children,
}: DialogActionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const router = useRouter()

  useEffect(() => {
    if (!open && redirecting) {
      router.push(redirectingPath)
    }
  }, [open, redirecting, redirectingPath, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          p-5 bg-transparent
          bg-linear-to-br from-emerald-950/90 via-emerald-900/90 to-emerald-950/90
          backdrop-blur-xl
          border border-emerald-800/40
          outline outline-emerald-700/30
          rounded-2xl
          shadow-2xl shadow-black/40
        "
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-2xl font-[NeueMachina] text-emerald-50">
            {title}
          </DialogTitle>

          <DialogDescription className="text-emerald-200/70">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-3">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
