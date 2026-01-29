"use client"
import { useIdStore } from '@/store'
import { redirect } from 'next/navigation'

export default function ChapetActionRediraction() {
  const moduleId = useIdStore((state) => state.id)
  return redirect(`/owner/courses/modules/chapters/${moduleId}`)
}
