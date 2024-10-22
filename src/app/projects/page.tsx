'use client'

import { useRouter } from 'next/navigation'

// This would typically come from your API or database


export default function ProjectShowcase() {
  const router = useRouter()
  router.push('/dashboard')
  return (
    <main className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      Nothing
    </main>
  )
}