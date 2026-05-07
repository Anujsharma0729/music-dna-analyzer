'use client'

import { useRouter } from 'next/navigation'

export function EmptyState() {
  const router = useRouter()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="rounded-2xl p-10 text-center max-w-md w-full"
        style={{ background: '#111111', border: '1px solid #222222' }}
      >
        <p className="text-4xl mb-4">🎧</p>
        <h2 className="text-xl font-bold text-white mb-2">No listening history yet</h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: '#666666' }}>
          We couldn&apos;t find any top tracks or artists on your Spotify account.
          Listen to more music and come back — your Music DNA needs data to work with.
        </p>

        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-80 active:scale-95"
          style={{
            background: 'transparent',
            border: '1px solid #333333',
            color: '#A0A0A0',
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
