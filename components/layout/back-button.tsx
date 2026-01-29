// components/back-button.tsx
"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import ButtonPrimary from "../ui/button-primary"

export default function BackButton() {
  const router = useRouter()

  return (
    <ButtonPrimary
      onClick={() => router.back()}
      size={"sm"}
      variant={"secondary"}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </ButtonPrimary>
  )
}