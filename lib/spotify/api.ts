import { AuthError, SpotifyAPIError, TokenExpiredError } from './errors'

export { AuthError, SpotifyAPIError, TokenExpiredError }

export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// ─── Spotify API Types ───────────────────────────────────────────────────────

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ id: string; name: string }>
  album: { name: string; images: Array<{ url: string }> }
  popularity: number
  duration_ms: number
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  images: Array<{ url: string }>
}

export interface AudioFeatures {
  id: string
  energy: number
  valence: number
  danceability: number
  acousticness: number
  instrumentalness: number
  tempo: number
  loudness: number
}

export interface SpotifyUser {
  id: string
  display_name: string
  country: string
  images: Array<{ url: string }>
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term'

// ─── Request Helper ──────────────────────────────────────────────────────────

async function spotifyFetch<T>(endpoint: string, token: string): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.status === 401) throw new TokenExpiredError()
  if (response.status === 429) {
    throw new SpotifyAPIError('Rate limited by Spotify. Please wait a moment and try again.', 429)
  }
  if (!response.ok) {
    throw new SpotifyAPIError(`Spotify API error: ${response.statusText}`, response.status)
  }

  return response.json() as Promise<T>
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function fetchUserProfile(token: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>('/me', token)
}

export async function fetchTopTracks(token: string, timeRange: TimeRange): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/me/top/tracks?limit=50&time_range=${timeRange}`,
    token,
  )
  return data.items
}

export async function fetchTopArtists(token: string): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    '/me/top/artists?limit=50&time_range=medium_term',
    token,
  )
  return data.items
}

export async function fetchAudioFeatures(
  token: string,
  trackIds: string[],
): Promise<AudioFeatures[]> {
  const chunks: string[][] = []
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100))
  }

  const results = await Promise.all(
    chunks.map((chunk) =>
      spotifyFetch<{ audio_features: Array<AudioFeatures | null> }>(
        `/audio-features?ids=${chunk.join(',')}`,
        token,
      ),
    ),
  )

  return results
    .flatMap((r) => r.audio_features)
    .filter((f): f is AudioFeatures => f !== null)
}

export function deduplicateTracksByID(trackArrays: SpotifyTrack[][]): SpotifyTrack[] {
  const seen = new Set<string>()
  const unique: SpotifyTrack[] = []
  for (const tracks of trackArrays) {
    for (const track of tracks) {
      if (!seen.has(track.id)) {
        seen.add(track.id)
        unique.push(track)
      }
    }
  }
  return unique
}
