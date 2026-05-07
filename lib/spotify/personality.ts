import type { AudioFeatures, SpotifyArtist, SpotifyTrack, SpotifyUser } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArchetypeId =
  | 'energy_addict'
  | 'midnight_drifter'
  | 'mood_chameleon'
  | 'tastemaker'
  | 'emotional_archaeologist'
  | 'hype_beast'
  | 'zen_curator'
  | 'culture_vulture'

export interface ArchetypeInfo {
  id: ArchetypeId
  name: string
  emoji: string
  tagline: string
  description: string
  color: string
}

export interface DimensionScores {
  energy: number
  mood: number
  danceability: number
  acousticness: number
  obscurity: number
  diversity: number
  moodVariance: number
}

export interface PersonalityResult {
  archetype: ArchetypeInfo
  alterEgo: ArchetypeInfo
  archetypeScores: Record<ArchetypeId, number>
  dimensions: DimensionScores
  topGenres: string[]
  genreBreakdown: Array<{ name: string; count: number }>
  listeningSummary: string
  topTracks: SpotifyTrack[]
  topArtists: SpotifyArtist[]
  spotifyUser: SpotifyUser
}

// ─── Archetype Definitions (NFR-05.2) ─────────────────────────────────────────

export const ARCHETYPES: Record<ArchetypeId, ArchetypeInfo> = {
  energy_addict: {
    id: 'energy_addict',
    name: 'Energy Addict',
    emoji: '⚡',
    tagline: "You don't listen to music. You survive on it.",
    description:
      "You turn everything up to eleven. Your playlists are built for momentum — high BPMs, hard drops, and zero chill. Music isn't background noise for you; it's the fuel that keeps you moving.",
    color: '#FF4136',
  },
  midnight_drifter: {
    id: 'midnight_drifter',
    name: 'Midnight Drifter',
    emoji: '🌙',
    tagline: 'Your best playlists only make sense at 2am.',
    description:
      'You find music that most people walk right past. Your taste lives in the quiet hours — textured, atmospheric, and deeply felt. You listen like it matters, because for you, it does.',
    color: '#4A4E8C',
  },
  mood_chameleon: {
    id: 'mood_chameleon',
    name: 'Mood Chameleon',
    emoji: '🎭',
    tagline: 'Your playlist is a mood board. No one can predict you.',
    description:
      "You swing from euphoric to melancholic and back again without apology. You don't pick music to match your mood — your mood picks the music. Every playlist is a statement.",
    color: '#9B59B6',
  },
  tastemaker: {
    id: 'tastemaker',
    name: 'Tastemaker',
    emoji: '🚀',
    tagline: 'You had them on rotation before they had fans.',
    description:
      "You don't follow trends, you spot them. Your library is stacked with artists who haven't blown up yet — or ones the mainstream already forgot. You take pride in music that most people haven't discovered.",
    color: '#1DB954',
  },
  emotional_archaeologist: {
    id: 'emotional_archaeologist',
    name: 'Emotional Archaeologist',
    emoji: '💔',
    tagline: "You don't skip the sad songs. You study them.",
    description:
      'You dig into the depths of human emotion through music, drawn to minor keys, raw lyrics, and sonic weight. Every sad song is a map — and you know every road. You listen not to escape feelings, but to understand them.',
    color: '#3498DB',
  },
  hype_beast: {
    id: 'hype_beast',
    name: 'Hype Beast',
    emoji: '🔥',
    tagline: 'Your queue is a pre-game. Every. Single. Day.',
    description:
      "Loud, mainstream, and completely unapologetic. You know every chart-topper and you're not embarrassed about it — you're the first on the playlist when something blows up. Your music hits different at full volume.",
    color: '#FF6B35',
  },
  zen_curator: {
    id: 'zen_curator',
    name: 'Zen Curator',
    emoji: '🧘',
    tagline: 'Your music breathes. So do you.',
    description:
      'Soft textures, natural sounds, and music that gives you room to think. You curate with intention — nothing jarring, nothing forced. Your listening is an act of mindfulness, and your playlists are places you actually want to live in.',
    color: '#1ABC9C',
  },
  culture_vulture: {
    id: 'culture_vulture',
    name: 'Culture Vulture',
    emoji: '🌍',
    tagline: "Your algorithm doesn't know what to make of you.",
    description:
      "Genre is just a suggestion to you. You pull from global sounds, rare cuts, and scenes most people don't even know exist. Your taste is a cross-cultural dialogue — eclectic by design, never by accident.",
    color: '#F39C12',
  },
}

// ─── Weight Matrix (NFR-05.1 — single exported config object) ─────────────────

interface ArchetypeWeights {
  energy: number
  mood: number
  danceability: number
  acousticness: number
  obscurity: number
  diversity: number
  moodVariance: number
}

export const ARCHETYPE_WEIGHTS: Record<ArchetypeId, ArchetypeWeights> = {
  energy_addict:           { energy:  0.35, mood:  0.10, danceability:  0.30, acousticness: -0.20, obscurity:  0.05, diversity: 0.00, moodVariance: 0.00 },
  midnight_drifter:        { energy: -0.20, mood: -0.15, danceability: -0.10, acousticness:  0.30, obscurity:  0.15, diversity: 0.10, moodVariance: 0.10 },
  mood_chameleon:          { energy:  0.00, mood:  0.00, danceability:  0.00, acousticness:  0.10, obscurity:  0.10, diversity: 0.30, moodVariance: 0.40 },
  tastemaker:              { energy:  0.10, mood:  0.10, danceability:  0.10, acousticness:  0.10, obscurity:  0.40, diversity: 0.20, moodVariance: 0.00 },
  emotional_archaeologist: { energy: -0.10, mood: -0.30, danceability: -0.10, acousticness:  0.25, obscurity:  0.15, diversity: 0.00, moodVariance: 0.10 },
  hype_beast:              { energy:  0.30, mood:  0.25, danceability:  0.35, acousticness: -0.20, obscurity: -0.30, diversity: 0.00, moodVariance: 0.00 },
  zen_curator:             { energy: -0.25, mood:  0.10, danceability: -0.20, acousticness:  0.35, obscurity:  0.15, diversity: 0.05, moodVariance: 0.00 },
  culture_vulture:         { energy:  0.10, mood:  0.10, danceability:  0.10, acousticness:  0.10, obscurity:  0.25, diversity: 0.35, moodVariance: 0.00 },
}

// ─── Math Helpers ─────────────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0
  const avg = mean(values)
  return Math.sqrt(mean(values.map((v) => (v - avg) ** 2)))
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ─── Dimension Computation (§7.1) ─────────────────────────────────────────────

function computeDimensions(
  features: AudioFeatures[],
  tracks: SpotifyTrack[],
  artists: SpotifyArtist[],
): DimensionScores {
  const allGenres = artists.flatMap((a) => a.genres)
  const uniqueGenreCount = new Set(allGenres).size
  const totalGenreTagCount = allGenres.length

  return {
    energy: mean(features.map((f) => f.energy)),
    mood: mean(features.map((f) => f.valence)),
    danceability: mean(features.map((f) => f.danceability)),
    acousticness: mean(features.map((f) => f.acousticness)),
    obscurity: 1 - mean(tracks.map((t) => t.popularity)) / 100,
    diversity: uniqueGenreCount / Math.max(totalGenreTagCount, 1),
    moodVariance: clamp(stdDev(features.map((f) => f.valence)) / 0.5, 0, 1),
  }
}

// ─── Archetype Scoring (§7.2 + §7.3) ─────────────────────────────────────────

function scoreArchetypes(dimensions: DimensionScores): Record<ArchetypeId, number> {
  const ids = Object.keys(ARCHETYPE_WEIGHTS) as ArchetypeId[]

  const rawScores = ids.map((id) => {
    const w = ARCHETYPE_WEIGHTS[id]
    return (
      dimensions.energy * w.energy +
      dimensions.mood * w.mood +
      dimensions.danceability * w.danceability +
      dimensions.acousticness * w.acousticness +
      dimensions.obscurity * w.obscurity +
      dimensions.diversity * w.diversity +
      dimensions.moodVariance * w.moodVariance
    )
  })

  const minRaw = Math.min(...rawScores)
  const shifted = rawScores.map((s) => s - minRaw)
  const maxShifted = Math.max(...shifted)
  const normalized = shifted.map((s) => (maxShifted === 0 ? 0 : (s / maxShifted) * 100))

  return Object.fromEntries(ids.map((id, i) => [id, normalized[i]])) as Record<ArchetypeId, number>
}

// ─── Genre Extraction (FR-03.5) ───────────────────────────────────────────────

function extractGenres(artists: SpotifyArtist[]): {
  topGenres: string[]
  genreBreakdown: Array<{ name: string; count: number }>
} {
  const counts = new Map<string, number>()
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }

  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    topGenres: sorted.slice(0, 6).map((g) => g.name),
    genreBreakdown: sorted,
  }
}

// ─── Listening Summary (FR-03.6) ──────────────────────────────────────────────

const ARCHETYPE_SUMMARIES: Record<ArchetypeId, string> = {
  energy_addict:           "You don't listen to music. You use it. Every track is a hit of something.",
  midnight_drifter:        'You find beauty in the overlooked. Your taste is a quiet flex.',
  mood_chameleon:          'You feel everything, so you need music for everything. That tracks.',
  tastemaker:              'You were there before the algorithm caught up. You always are.',
  emotional_archaeologist: "You don't skip the hard parts. That's what makes your taste real.",
  hype_beast:              'Every day is a drop day in your world. No skip button needed.',
  zen_curator:             'Your music collection is a carefully tended garden. Intentional. Peaceful.',
  culture_vulture:         'Your listening history is a passport. Stamps from everywhere.',
}

function buildListeningSummary(dimensions: DimensionScores, archetype: ArchetypeInfo): string {
  if (archetype.id === 'energy_addict' && dimensions.mood < 0.4) {
    return 'You use music as armour. High energy, heavy heart.'
  }
  return ARCHETYPE_SUMMARIES[archetype.id]
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export function analyzePersonality(
  features: AudioFeatures[],
  tracks: SpotifyTrack[],
  artists: SpotifyArtist[],
  spotifyUser: SpotifyUser,
): PersonalityResult {
  const dimensions = computeDimensions(features, tracks, artists)
  const archetypeScores = scoreArchetypes(dimensions)

  const sorted = (Object.entries(archetypeScores) as [ArchetypeId, number][]).sort(
    (a, b) => b[1] - a[1],
  )

  const archetype = ARCHETYPES[sorted[0][0]]
  const alterEgo = ARCHETYPES[sorted[1][0]]
  const { topGenres, genreBreakdown } = extractGenres(artists)

  return {
    archetype,
    alterEgo,
    archetypeScores,
    dimensions,
    topGenres,
    genreBreakdown,
    listeningSummary: buildListeningSummary(dimensions, archetype),
    topTracks: tracks.slice(0, 5),
    topArtists: artists.slice(0, 5),
    spotifyUser,
  }
}
