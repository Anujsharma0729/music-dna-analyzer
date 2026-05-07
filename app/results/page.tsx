'use client'

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
import { useAuth } from '@/contexts/auth-context'

export default function ResultsPage() {
  const { result, isLoading, error, isEmpty, retry } = useSpotifyData()
  const { user } = useAuth()

  if (isLoading) return <ResultsSkeleton />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (isEmpty) return <EmptyState />
  if (!result) return null

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a' }}>
      <div className="container mx-auto px-6 pb-20 max-w-5xl">

        <ArchetypeHero
          archetype={result.archetype}
          dimensions={result.dimensions}
          listeningSummary={result.listeningSummary}
        />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <GenreChart genreBreakdown={result.genreBreakdown} />
          <MoodRadar dimensions={result.dimensions} />
        </div>

        <div className="mb-6">
          <AlterEgoCard alterEgo={result.alterEgo} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <TopTracksRow tracks={result.topTracks} />
          <TopArtistsRow artists={result.topArtists} />
        </div>

        {/* ── Personality card section ── */}
        <div className="flex flex-col items-center py-12">

          {!user && (
            <div
              className="rounded-2xl p-4 text-center mb-6 text-sm w-full max-w-[520px]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #222222',
                color: '#666666',
              }}
            >
              <a
                href="/auth/login?redirect=/results"
                style={{ color: '#A0A0A0', textDecoration: 'underline' }}
              >
                Sign in
              </a>{' '}
              to save your results and revisit your Music DNA anytime.
            </div>
          )}

          <p
            className="text-sm uppercase tracking-widest mb-4"
            style={{ color: '#555555' }}
          >
            Your Shareable Card
          </p>

          {/* Placeholder — PersonalityCard wired in next prompt */}
          <div
            className="rounded-2xl mx-auto"
            style={{
              width: 480,
              height: 280,
              background: '#111111',
              border: '1px solid #222222',
            }}
          />

        </div>

      </div>
    </div>
  )
}
