'use client'

import { Navigation } from '@/components/navigation'
import { startSpotifyOAuth } from '@/lib/spotify/auth'
import { toast } from 'sonner'

const PREVIEW_ARCHETYPES = [
  {
    emoji: '⚡',
    name: 'Energy Addict',
    tagline: "You don't listen to music. You survive on it.",
    color: '#FF4136',
    genres: ['House', 'Techno', 'EDM'],
  },
  {
    emoji: '🎭',
    name: 'Mood Chameleon',
    tagline: 'Your playlist is a mood board. No one can predict you.',
    color: '#9B59B6',
    genres: ['Indie', 'R&B', 'Alternative'],
  },
  {
    emoji: '🌍',
    name: 'Culture Vulture',
    tagline: "Your algorithm doesn't know what to make of you.",
    color: '#F39C12',
    genres: ['Afrobeats', 'Jazz', 'K-Pop'],
  },
]

function handleConnectSpotify() {
  if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
    toast.error('Spotify Client ID not configured')
    return
  }
  void startSpotifyOAuth()
}

export default function HomePage() {
  return (
    <div style={{ background: '#0a0a0a' }} className="min-h-screen text-white">
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Radial background accent */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, #1DB95408 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1DB954]/40 text-[#1DB954] text-sm font-medium mb-8">
            🎵 Music Personality Analyzer
          </div>

          {/* Headline — responsive size */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block text-white">Discover Your</span>
            <span className="block">
              Music{' '}
              <span style={{ color: '#1DB954' }}>DNA</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[#A0A0A0] max-w-xl mx-auto mb-10 leading-relaxed">
            Connect Spotify and find out what your listening habits say about you.
            Your archetype, mood spectrum, genre fingerprint — and a card worth sharing.
          </p>

          {/* CTA — full-width on mobile, auto on sm+ */}
          <button
            onClick={handleConnectSpotify}
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: '#1DB954' }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Connect Spotify — It&apos;s Free
          </button>
        </div>
      </section>

      {/* ── Social Proof — 3 sample archetype cards ── */}
      <section className="container mx-auto px-6 py-24">
        <p className="text-center text-[#666] text-sm font-medium uppercase tracking-widest mb-12">
          Which one are you?
        </p>

        {/* 1 col → 2 col (sm) → 3 col (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PREVIEW_ARCHETYPES.map((a) => (
            <div
              key={a.name}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: '#111111',
                border: '1px solid #222222',
              }}
            >
              {/* Accent bar */}
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: a.color }}
              />

              <div className="text-4xl">{a.emoji}</div>

              <div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: a.color }}
                >
                  {a.name}
                </h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed italic">
                  &ldquo;{a.tagline}&rdquo;
                </p>
              </div>

              {/* Genre pills */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {a.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${a.color}18`,
                      color: a.color,
                      border: `1px solid ${a.color}30`,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
