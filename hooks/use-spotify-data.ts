'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase/client'
import { getSpotifyToken, clearToken } from '@/lib/spotify/auth'
import { fetchAllSpotifyData, TokenExpiredError } from '@/lib/spotify/api'
import { analyzePersonality } from '@/lib/spotify/personality'
import type { PersonalityResult } from '@/lib/spotify/personality'

export interface SpotifyDataState {
  result: PersonalityResult | null
  isLoading: boolean
  error: string | null
  isEmpty: boolean
}

export function useSpotifyData(): SpotifyDataState & { retry: () => void } {
  const router = useRouter()
  const { user } = useAuth()

  const [state, setState] = useState<SpotifyDataState>({
    result: null,
    isLoading: true,
    error: null,
    isEmpty: false,
  })
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setState({ result: null, isLoading: true, error: null, isEmpty: false })
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load(): Promise<void> {
      const token = getSpotifyToken()

      if (!token) {
        router.push('/')
        return
      }

      try {
        const { tracks, artists, audioFeatures, user: spotifyUser } =
          await fetchAllSpotifyData(token)

        if (cancelled) return

        if (tracks.length === 0 || audioFeatures.length === 0) {
          setState({ result: null, isLoading: false, error: null, isEmpty: true })
          return
        }

        const result = analyzePersonality(audioFeatures, tracks, artists, spotifyUser)

        if (cancelled) return

        setState({ result, isLoading: false, error: null, isEmpty: false })

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

        setState({
          result: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
          isEmpty: false,
        })
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [attempt, router, user])

  return { ...state, retry }
}
