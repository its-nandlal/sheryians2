"use client"

import { useIdStore } from "@/store"
import { redirect } from "next/navigation"


export default function Action() {
  const {id} = useIdStore()

  return redirect(`/owner/courses/modules/${id}`)
}
