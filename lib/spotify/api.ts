import { TokenExpiredError, SpotifyAPIError } from './errors'
import type {
  SpotifyTrack,
  SpotifyArtist,
  AudioFeatures,
  SpotifyUser,
  TimeRange,
  SpotifyDataBundle,
} from './types'

export { TokenExpiredError, SpotifyAPIError }
export type { SpotifyTrack, SpotifyArtist, AudioFeatures, SpotifyUser, TimeRange, SpotifyDataBundle }

export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

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

// ─── Composite Fetch ─────────────────────────────────────────────────────────

export async function fetchAllSpotifyData(token: string): Promise<SpotifyDataBundle> {
  const [shortTerm, mediumTerm, longTerm, artists, user] = await Promise.all([
    fetchTopTracks(token, 'short_term'),
    fetchTopTracks(token, 'medium_term'),
    fetchTopTracks(token, 'long_term'),
    fetchTopArtists(token),
    fetchUserProfile(token),
  ])

  const tracks = deduplicateTracksByID([shortTerm, mediumTerm, longTerm])
  const trackIds = tracks.map((t) => t.id)
  const audioFeatures = await fetchAudioFeatures(token, trackIds)

  return { tracks, artists, audioFeatures, user }
}
