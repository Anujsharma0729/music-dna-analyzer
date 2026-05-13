'use client'

import { useRef } from 'react'
import { Navigation } from '@/components/navigation'
import { ArchetypeHero } from '@/components/archetype-hero'
import { AlterEgoCard } from '@/components/alter-ego-card'
import { GenreChart } from '@/components/genre-chart'
import { MoodRadar } from '@/components/mood-radar'
import { TopTracksRow } from '@/components/top-tracks-row'
import { TopArtistsRow } from '@/components/top-artists-row'
import { PersonalityCard } from '@/components/personality-card'
import { DEMO_RESULT } from '@/lib/spotify/demo-data'
import { startSpotifyOAuth } from '@/lib/spotify/auth'
import { toast } from 'sonner'
import { Sparkles, Waves, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function handleConnect() {
  if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
    toast.error('Spotify Client ID not configured')
    return
  }
  void startSpotifyOAuth()
}

function DemoBanner() {
  return (
    <div
      className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{ background: 'rgba(29,185,84,0.07)', borderBottom: '1px solid rgba(29,185,84,0.15)' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: 'rgba(29,185,84,0.15)' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#1DB954' }} />
        </div>
        <p className="text-sm" style={{ color: '#aaa' }}>
          <span className="font-semibold" style={{ color: '#1DB954' }}>Demo mode</span>
          {' '}— This is a sample analysis for a hypothetical power listener (2 yrs · 2 hrs/day).
        </p>
      </div>
      <button
        onClick={handleConnect}
        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
        style={{ background: '#1DB954' }}
      >
        Analyse my Spotify
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
      <span className="text-xs font-bold uppercase tracking-widest px-3" style={{ color: '#333' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
    </div>
  )
}

function DemoProfile() {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 mb-2"
      style={{ background: '#111', border: '1px solid #1e1e1e' }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
        style={{ background: '#1a1a1a' }}
      >
        🎧
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Demo Listener</p>
        <p className="text-xs" style={{ color: '#555' }}>
          2 years on Spotify · ~2 hrs/day · 14,600+ hours total
        </p>
      </div>
      <div
        className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(29,185,84,0.1)', color: '#1DB954', border: '1px solid rgba(29,185,84,0.2)' }}
      >
        Demo
      </div>
    </div>
  )
}

function ConnectCTA() {
  return (
    <div
      className="w-full rounded-2xl p-6 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(29,185,84,0.03) 100%)',
        border: '1px solid rgba(29,185,84,0.2)',
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(29,185,84,0.12)' }}
      >
        <Waves className="w-6 h-6" style={{ color: '#1DB954' }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Now see YOUR results</h3>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: '#666' }}>
        Connect your Spotify and get your real archetype, mood radar, and shareable card in 10 seconds.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleConnect}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90 active:scale-95"
          style={{ background: '#1DB954' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Connect Spotify — Free
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
          style={{ border: '1px solid #2a2a2a', color: '#888' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function DemoResultsPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const result = DEMO_RESULT

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <DemoBanner />

      <div className="container mx-auto px-4 sm:px-6 pb-24 max-w-5xl">

        {/* Demo profile chip */}
        <div className="pt-8 mb-2">
          <DemoProfile />
        </div>

        {/* Archetype hero */}
        <ArchetypeHero
          archetype={result.archetype}
          dimensions={result.dimensions}
          listeningSummary={result.listeningSummary}
        />

        {/* Charts */}
        <div className="mt-10">
          <SectionDivider label="Sound Profile" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <GenreChart genreBreakdown={result.genreBreakdown} />
            <MoodRadar dimensions={result.dimensions} />
          </div>
        </div>

        {/* Alter ego */}
        <div className="mt-5">
          <AlterEgoCard alterEgo={result.alterEgo} />
        </div>

        {/* Top tracks + artists */}
        <div className="mt-10">
          <SectionDivider label="Listening History" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TopTracksRow tracks={result.topTracks} />
            <TopArtistsRow artists={result.topArtists} />
          </div>
        </div>

        {/* Shareable card */}
        <div className="mt-14">
          <SectionDivider label="Shareable Card" />
          <div className="flex flex-col items-center gap-6 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#444' }}>
              Download or share your card
            </p>
            <div className="w-full overflow-x-auto flex justify-center">
              <PersonalityCard result={result} cardRef={cardRef} />
            </div>
          </div>
        </div>

        {/* Connect CTA */}
        <ConnectCTA />

      </div>
    </div>
  )
}
