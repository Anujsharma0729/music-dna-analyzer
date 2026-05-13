import type { PersonalityResult } from './personality'
import { ARCHETYPES } from './personality'

// Static demo result modelling a user who has listened ~2 hrs/day for 2 years.
// High diversity + high mood variance → Mood Chameleon archetype.
export const DEMO_RESULT: PersonalityResult = {
  archetype: ARCHETYPES.mood_chameleon,
  alterEgo:  ARCHETYPES.culture_vulture,

  archetypeScores: {
    mood_chameleon:          100,
    culture_vulture:          82,
    tastemaker:               71,
    midnight_drifter:         58,
    emotional_archaeologist:  44,
    energy_addict:            39,
    zen_curator:              28,
    hype_beast:               17,
  },

  dimensions: {
    energy:       0.62,
    mood:         0.58,
    danceability: 0.71,
    acousticness: 0.34,
    obscurity:    0.52,
    diversity:    0.88,
    moodVariance: 0.79,
  },

  topGenres: [
    'indie pop',
    'hip hop',
    'r&b',
    'alternative',
    'electronic',
    'soul',
  ],

  genreBreakdown: [
    { name: 'indie pop',    count: 18 },
    { name: 'hip hop',      count: 15 },
    { name: 'r&b',          count: 13 },
    { name: 'alternative',  count: 11 },
    { name: 'electronic',   count:  9 },
    { name: 'soul',         count:  7 },
    { name: 'jazz',         count:  5 },
    { name: 'lo-fi',        count:  4 },
    { name: 'afrobeats',    count:  3 },
    { name: 'classical',    count:  2 },
  ],

  listeningSummary:
    'You feel everything, so you need music for everything. That tracks.',

  topTracks: [
    {
      id: 'demo-1',
      name: 'Blinding Lights',
      artists: [{ id: 'a1', name: 'The Weeknd' }],
      album: { name: 'After Hours', images: [] },
      popularity: 96,
      duration_ms: 200040,
    },
    {
      id: 'demo-2',
      name: 'HUMBLE.',
      artists: [{ id: 'a2', name: 'Kendrick Lamar' }],
      album: { name: 'DAMN.', images: [] },
      popularity: 91,
      duration_ms: 177000,
    },
    {
      id: 'demo-3',
      name: 'Levitating',
      artists: [{ id: 'a3', name: 'Dua Lipa' }],
      album: { name: 'Future Nostalgia', images: [] },
      popularity: 89,
      duration_ms: 203064,
    },
    {
      id: 'demo-4',
      name: 'bad guy',
      artists: [{ id: 'a4', name: 'Billie Eilish' }],
      album: { name: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', images: [] },
      popularity: 88,
      duration_ms: 194088,
    },
    {
      id: 'demo-5',
      name: 'MONTERO (Call Me By Your Name)',
      artists: [{ id: 'a5', name: 'Lil Nas X' }],
      album: { name: 'MONTERO', images: [] },
      popularity: 85,
      duration_ms: 137773,
    },
  ],

  topArtists: [
    {
      id: 'a1',
      name: 'The Weeknd',
      genres: ['canadian pop', 'r&b'],
      popularity: 97,
      images: [],
    },
    {
      id: 'a2',
      name: 'Kendrick Lamar',
      genres: ['hip hop', 'rap', 'west coast rap'],
      popularity: 95,
      images: [],
    },
    {
      id: 'a3',
      name: 'Dua Lipa',
      genres: ['pop', 'dance pop', 'uk pop'],
      popularity: 93,
      images: [],
    },
    {
      id: 'a4',
      name: 'Billie Eilish',
      genres: ['electropop', 'indie pop', 'alternative'],
      popularity: 92,
      images: [],
    },
    {
      id: 'a6',
      name: 'Tyler, The Creator',
      genres: ['hip hop', 'alternative hip hop', 'rap'],
      popularity: 90,
      images: [],
    },
  ],

  spotifyUser: {
    id: 'demo_user',
    display_name: 'Demo User',
    country: 'US',
    images: [],
  },
}
