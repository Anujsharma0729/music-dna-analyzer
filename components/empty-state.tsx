'use client'

import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Headphones, Sparkles, ArrowRight } from 'lucide-react'

export function EmptyState() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">

          {/* Main card */}
          <div
            className="rounded-2xl p-8 text-center mb-4"
            style={{ background: '#111', border: '1px solid #1e1e1e' }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: '#1a1a1a' }}
            >
              <Headphones className="w-7 h-7" style={{ color: '#444' }} />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">No listening history yet</h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#555' }}>
              Spotify needs a few weeks of listening data before it builds your top tracks and artists.
              Keep streaming and come back — your Music DNA will be ready soon.
            </p>

            {/* Tips */}
            <div
              className="rounded-xl p-4 text-left mb-6 space-y-2"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#333' }}>
                What counts
              </p>
              {[
                'Tracks played for 30+ seconds',
                'Listening across multiple days',
                'Any genre — Spotify just needs volume',
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <span style={{ color: '#1DB954' }} className="mt-0.5 shrink-0">✓</span>
                  <span className="text-xs" style={{ color: '#555' }}>{tip}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80 active:scale-[0.98]"
              style={{ border: '1px solid #2a2a2a', color: '#666' }}
            >
              Back to Home
            </button>
          </div>

          {/* Demo card */}
          <div
            className="rounded-2xl p-5 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(29,185,84,0.07) 0%, rgba(29,185,84,0.03) 100%)',
              border: '1px solid rgba(29,185,84,0.2)',
            }}
            onClick={() => router.push('/results/demo')}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(29,185,84,0.12)' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#1DB954' }} />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-white mb-0.5">
                  Curious what it looks like?
                </p>
                <p className="text-xs" style={{ color: '#666' }}>
                  See a full sample analysis for a 2-year power listener
                </p>
              </div>

              <ArrowRight
                className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: '#1DB954' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
