'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: '#0a0a0a' }}>
      <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
      <p className="text-[#A0A0A0] max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
