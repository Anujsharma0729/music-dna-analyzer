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

export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface SpotifyDataBundle {
  tracks: SpotifyTrack[]
  artists: SpotifyArtist[]
  audioFeatures: AudioFeatures[]
  user: SpotifyUser
}
