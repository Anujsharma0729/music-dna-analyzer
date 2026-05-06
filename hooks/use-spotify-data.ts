'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase/client'
import { getSpotifyToken, clearToken } from '@/lib/spotify/auth'
import {
  fetchTopTracks,
  fetchTopArtists,
  fetchUserProfile,
  fetchAudioFeatures,
  deduplicateTracksByID,
} from '@/lib/spotify/api'
import { TokenExpiredError } from '@/lib/spotify/errors'
import { analyzePersonality } from '@/lib/spotify/personality'
import type { PersonalityResult } from '@/lib/spotify/personality'

interface UseSpotifyDataResult {
  data: PersonalityResult | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useSpotifyData(): UseSpotifyDataResult {
  const router = useRouter()
  const { user } = useAuth()

  const [data, setData] = useState<PersonalityResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setError(null)
    setIsLoading(true)
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const token = getSpotifyToken()

      if (!token) {
        router.push('/')
        return
      }

      try {
        // Parallel fetch — NFR-01.3
        const [shortTracks, mediumTracks, longTracks, artists, spotifyUser] = await Promise.all([
          fetchTopTracks(token, 'short_term'),
          fetchTopTracks(token, 'medium_term'),
          fetchTopTracks(token, 'long_term'),
          fetchTopArtists(token),
          fetchUserProfile(token),
        ])

        if (cancelled) return

        const uniqueTracks = deduplicateTracksByID([shortTracks, mediumTracks, longTracks])
        const trackIds = uniqueTracks.map((t) => t.id)

        const features = await fetchAudioFeatures(token, trackIds)

        if (cancelled) return

        const result = analyzePersonality(features, uniqueTracks, artists, spotifyUser)

        setData(result)

        // Persist for authenticated users — FR-06.1 / FR-06.2
        if (user) {
          await supabase.from('spotify_profiles').upsert(
            {
              user_id: user.id,
              archetype: result.archetype.id,
              alter_ego: result.alterEgo.id,
              dimensions: result.dimensions,
              top_genres: result.topGenres,
              archetype_scores: result.archetypeScores,
              spotify_username: result.spotifyUser.id,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          )
        }
      } catch (err) {
        if (cancelled) return

        if (err instanceof TokenExpiredError) {
          clearToken()
          router.push('/')
          return
        }

        setError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [attempt, router, user])

  return { data, isLoading, error, retry }
}
