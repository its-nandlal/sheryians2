"use client"

import { useRouter } from 'next/navigation'

export default function Page() {
  const route = useRouter()
  return route.back()
}
