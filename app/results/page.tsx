'use client'

import { useSpotifyData } from '@/hooks/use-spotify-data'
import { ResultsSkeleton } from '@/components/results-skeleton'
import { ArchetypeHero } from '@/components/archetype-hero'
import { AlterEgoCard } from '@/components/alter-ego-card'
import { GenreChart } from '@/components/genre-chart'
import { MoodRadar } from '@/components/mood-radar'
import { TopTracksRow } from '@/components/top-tracks-row'
import { TopArtistsRow } from '@/components/top-artists-row'
import { PersonalityCard } from '@/components/personality-card'
import { useAuth } from '@/contexts/auth-context'

export default function ResultsPage() {
  const { data, isLoading, error, retry } = useSpotifyData()
  const { user } = useAuth()

  if (isLoading) return <ResultsSkeleton />

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0a' }}
      >
        <div
          className="rounded-2xl p-10 text-center max-w-md w-full mx-4"
          style={{ background: '#111111', border: '1px solid #222222' }}
        >
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm mb-6" style={{ color: '#666' }}>
            {error}
          </p>
          <button
            onClick={retry}
            className="px-6 py-3 rounded-full font-semibold text-sm text-black transition-all hover:opacity-90"
            style={{ background: '#1DB954' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      <div className="container mx-auto px-6 pb-20 max-w-5xl">

        {/* Archetype Hero */}
        <ArchetypeHero
          archetype={data.archetype}
          listeningSummary={data.listeningSummary}
        />

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <GenreChart genreBreakdown={data.genreBreakdown} />
          <MoodRadar dimensions={data.dimensions} />
        </div>

        {/* Alter Ego */}
        <div className="mb-6">
          <AlterEgoCard alterEgo={data.alterEgo} />
        </div>

        {/* Top Tracks + Artists */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <TopTracksRow tracks={data.topTracks} />
          <TopArtistsRow artists={data.topArtists} />
        </div>

        {/* Save banner for unauthenticated users */}
        {!user && (
          <div
            className="rounded-2xl p-4 text-center mb-8 text-sm"
            style={{
              background: 'rgba(29,185,84,0.08)',
              border: '1px solid rgba(29,185,84,0.2)',
              color: '#A0A0A0',
            }}
          >
            <a href="/auth/login" className="underline" style={{ color: '#1DB954' }}>
              Sign in
            </a>{' '}
            to save your results and revisit your Music DNA anytime.
          </div>
        )}

        {/* Personality Card */}
        <div className="flex justify-center">
          <PersonalityCard result={data} />
        </div>

      </div>
    </div>
  )
}
