'use client'

import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div
          className="rounded-2xl p-10 text-center max-w-md w-full"
          style={{ background: '#111', border: '1px solid #1e1e1e' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.15)' }}
          >
            <AlertCircle className="w-6 h-6" style={{ color: '#ff4136' }} />
          </div>

          <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#555' }}>
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#1DB954' }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5 active:scale-[0.98]"
              style={{ border: '1px solid #2a2a2a', color: '#888' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
