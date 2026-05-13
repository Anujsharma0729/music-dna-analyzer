'use client'

import { useRef } from 'react'
import { useSpotifyData } from '@/hooks/use-spotify-data'
import { ResultsSkeleton } from '@/components/results-skeleton'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import { ArchetypeHero } from '@/components/archetype-hero'
import { AlterEgoCard } from '@/components/alter-ego-card'
import { GenreChart } from '@/components/genre-chart'
import { MoodRadar } from '@/components/mood-radar'
import { TopTracksRow } from '@/components/top-tracks-row'
import { TopArtistsRow } from '@/components/top-artists-row'
import { PersonalityCard } from '@/components/personality-card'
import { Navigation } from '@/components/navigation'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { Waves, LogIn, UserPlus } from 'lucide-react'

function SaveResultsBanner() {
  return (
    <div
      className="w-full rounded-2xl p-6 mb-10"
      style={{
        background: 'linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(29,185,84,0.04) 100%)',
        border: '1px solid rgba(29,185,84,0.2)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(29,185,84,0.15)' }}
        >
          <Waves className="w-5 h-5" style={{ color: '#1DB954' }} />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold text-white text-sm mb-0.5">
            Save your Music DNA
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#777' }}>
            Create a free account to revisit your results, track changes over time, and share your profile.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/auth/signup?returnUrl=/results"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#1DB954' }}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up Free
          </Link>
          <Link
            href="/auth/login?returnUrl=/results"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ border: '1px solid #2a2a2a', color: '#aaa' }}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
      <span
        className="text-xs font-bold uppercase tracking-widest px-3"
        style={{ color: '#333' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: '#1a1a1a' }} />
    </div>
  )
}

export default function ResultsPage() {
  const { result, isLoading, error, isEmpty, retry } = useSpotifyData()
  const { user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)

  if (isLoading) return <ResultsSkeleton />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (isEmpty) return <EmptyState />
  if (!result) return null

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 pb-24 max-w-5xl">

        {/* Archetype hero */}
        <ArchetypeHero
          archetype={result.archetype}
          dimensions={result.dimensions}
          listeningSummary={result.listeningSummary}
        />

        {/* Charts */}
        <div className="mt-10">
          <SectionDivider label="Your Sound Profile" />
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
          <SectionDivider label="Your Listening History" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TopTracksRow tracks={result.topTracks} />
            <TopArtistsRow artists={result.topArtists} />
          </div>
        </div>

        {/* Save results / shareable card */}
        <div className="mt-14">
          <SectionDivider label="Your Card" />

          {!user && <SaveResultsBanner />}

          <div className="flex flex-col items-center gap-6">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#444' }}
            >
              Shareable Personality Card
            </p>
            <div className="w-full overflow-x-auto flex justify-center">
              <PersonalityCard result={result} cardRef={cardRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
