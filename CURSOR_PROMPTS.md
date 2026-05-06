# 🎯 Claude Code Prompts — Music DNA Analyzer
# 12 Feature Prompts · 4 Sessions · Production Grade
#
# HOW TO USE:
# - Start each prompt with: "Read REQUIREMENTS.md first, then do the following:"
# - Complete all prompts in a session before starting a new session
# - After each prompt: test in browser → git commit → next prompt
# - After each session: git push → open fresh claude session
#
# COMMIT AFTER EVERY PROMPT:
# git add . && git commit -m "feat: [prompt name]"

═══════════════════════════════════════════════════════════════
SESSION 1 — Foundation & Auth (Prompts 1, 2, 3)
Start: claude (in project root)
End:   OAuth works end-to-end, homepage live
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 1 — Project Setup & Environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

I'm building a Music DNA Personality Analyzer on top of this Next.js 16 + TypeScript +
Tailwind + Supabase starter template. The full spec is in REQUIREMENTS.md.

Do ALL of the following setup tasks:

1. UPDATE package.json — add these dependencies:
   "recharts": "^2.12.0"
   "html2canvas": "^1.4.1"
   Do NOT run install — just update the file.

2. UPDATE .env.example — add Spotify variables below the existing Supabase vars:
   # Spotify — create app at https://developer.spotify.com/dashboard
   # Add Redirect URI: http://localhost:3000/spotify/callback
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID="your-spotify-client-id"
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI="http://localhost:3000/spotify/callback"

3. CREATE lib/spotify/constants.ts — export these constants:
   export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
   export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
   export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
   export const SPOTIFY_SCOPES = 'user-top-read user-read-recently-played user-read-private'
   export const SESSION_KEYS = {
     ACCESS_TOKEN: 'spotify_access_token',
     EXPIRES_AT: 'spotify_expires_at',
     CODE_VERIFIER: 'spotify_code_verifier',
     OAUTH_STATE: 'spotify_oauth_state',
   } as const

4. CREATE lib/spotify/errors.ts — define typed error classes:
   export class AuthError extends Error {
     constructor(message: string) { super(message); this.name = 'AuthError' }
   }
   export class SpotifyAPIError extends Error {
     status: number
     constructor(message: string, status: number) {
       super(message); this.name = 'SpotifyAPIError'; this.status = status
     }
   }
   export class TokenExpiredError extends AuthError {
     constructor() { super('Spotify token has expired') ; this.name = 'TokenExpiredError' }
   }

5. CREATE supabase/migrations/20260506_create_spotify_profiles.sql
   Use the exact SQL from Section 5.3 of REQUIREMENTS.md.
   Include: CREATE TABLE, UNIQUE(user_id), RLS enable, all 3 policies.

6. UPDATE next.config.ts — add this to allow Spotify image domains:
   images: { remotePatterns: [{ protocol: 'https', hostname: 'i.scdn.co' }] }

Zero TypeScript errors. Confirm each file created/updated with ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 2 — Spotify OAuth PKCE Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompt 1 is done. Now build the complete Spotify OAuth PKCE authentication system.

CREATE lib/spotify/auth.ts

This file must export the following — all TypeScript strict, zero 'any':

--- Types ---
export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface StoredToken {
  token: string
  expiresAt: number
}

--- PKCE Helpers ---
export async function generateCodeVerifier(): Promise<string>
  Use crypto.getRandomValues(new Uint8Array(96))
  btoa → replace +→- /→_ =→'' → slice to 128 chars

export async function generateCodeChallenge(verifier: string): Promise<string>
  TextEncoder → encode verifier → crypto.subtle.digest('SHA-256')
  → Uint8Array → btoa → replace +→- /→_ =→''

export function generateState(): string
  crypto.getRandomValues(new Uint8Array(16))
  → Array.from → map to hex → join('')

--- Auth Flow ---
export async function initiateSpotifyAuth(): Promise<void>
  1. Generate verifier, challenge, state (await the async ones)
  2. Store verifier in sessionStorage[SESSION_KEYS.CODE_VERIFIER]
  3. Store state in sessionStorage[SESSION_KEYS.OAUTH_STATE]
  4. Build URL: new URL(SPOTIFY_AUTH_URL)
     params: client_id (from env), response_type='code', redirect_uri (from env),
     code_challenge_method='S256', code_challenge, state, scope=SPOTIFY_SCOPES
  5. window.location.href = url.toString()

export async function exchangeCodeForToken(
  code: string,
  receivedState: string
): Promise<SpotifyTokenResponse>
  1. Read storedState from sessionStorage[SESSION_KEYS.OAUTH_STATE]
  2. If storedState !== receivedState → throw new AuthError('State mismatch — possible CSRF')
  3. Read verifier from sessionStorage[SESSION_KEYS.CODE_VERIFIER]
  4. If !verifier → throw new AuthError('Code verifier missing')
  5. POST to SPOTIFY_TOKEN_URL with URLSearchParams body:
     grant_type='authorization_code', code, redirect_uri (from env),
     client_id (from env), code_verifier=verifier
  6. If !response.ok → throw new SpotifyAPIError(await res.text(), res.status)
  7. Clear verifier + state from sessionStorage
  8. Return parsed JSON as SpotifyTokenResponse

--- Token Storage ---
export function saveToken(tokenResponse: SpotifyTokenResponse): void
  sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, tokenResponse.access_token)
  sessionStorage.setItem(
    SESSION_KEYS.EXPIRES_AT,
    String(Date.now() + tokenResponse.expires_in * 1000)
  )

export function getStoredToken(): StoredToken | null
  Read both keys. If either missing → return null
  Return { token, expiresAt: Number(expiresAt) }

export function isTokenValid(): boolean
  const stored = getStoredToken()
  if (!stored) return false
  return stored.expiresAt > Date.now() + 60_000  ← 60s buffer

export function clearToken(): void
  Remove all 4 SESSION_KEYS from sessionStorage

Import SESSION_KEYS, SPOTIFY_AUTH_URL, SPOTIFY_TOKEN_URL, SPOTIFY_SCOPES from ./constants
Import AuthError, SpotifyAPIError from ./errors

After creating the file, confirm: lib/spotify/auth.ts ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 3 — Homepage Redesign + OAuth Callback Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompts 1–2 done. Auth system is built. Now create the UI entry points.

--- TASK A: UPDATE app/page.tsx (full replacement) ---

Keep the existing Navigation import. Replace everything inside the return with:

Section 1 — Hero (min-h-[88vh] flex items-center, bg #0a0a0a):
  - Animated background: subtle radial gradient from #1DB95408 to transparent
  - Top pill badge: "🎵 Music Personality Analyzer" — green border, green text, rounded-full
  - H1 (text-6xl font-black tracking-tight):
    "Discover Your" on line 1
    "Music DNA" on line 2 — "DNA" in Spotify green #1DB954
  - Subtitle (text-xl text-[#A0A0A0] max-w-xl):
    "Connect Spotify and find out what your listening habits say about you.
     Your archetype, mood spectrum, genre fingerprint — and a card worth sharing."
  - CTA button (onClick → calls initiateSpotifyAuth() from lib/spotify/auth):
    Large green button, "Connect Spotify — It's Free", Spotify icon (use Music icon from lucide)
    Disable + show Loader2 spinner while initiating (isLoading state)
  - Trust line below button: "No account needed · Read-only Spotify access · Data never stored"
    Small, muted, flex row with Shield icon

Section 2 — Sample Archetype Cards (py-24, bg #080808):
  Heading: "What's your archetype?" (text-3xl font-bold, centered)
  Sub: "8 personality types based on how you actually listen" (muted, centered)
  Grid of 4 static preview cards (2×2 on mobile, 4×1 on desktop):
    ⚡ Energy Addict — "You don't listen to music. You survive on it." — border #FF413640
    🌙 Midnight Drifter — "Your best playlists only make sense at 2am." — border #4A4E8C40
    🚀 Tastemaker — "You had them on rotation before they had fans." — border #1DB95440
    💔 Emotional Archaeologist — "You don't skip the sad songs. You study them." — border #3498DB40
  Each card: dark bg, colored left border (4px), emoji 32px, name bold white, tagline muted italic
  Bottom of each card: a "VIEW ARCHETYPE" ghost label — purely decorative, not clickable

Section 3 — How It Works (py-20, bg #0a0a0a):
  3 steps in a horizontal row:
    1. "Connect" — plug icon — "One click Spotify login. Read-only access."
    2. "Analyze" — bar chart icon — "We analyze your top tracks, artists, and audio features."
    3. "Share" — share icon — "Get your archetype card. Download and share it."

Keep existing Footer.

--- TASK B: CREATE app/spotify/callback/page.tsx ---

'use client' — Suspense boundary required for useSearchParams.

Wrap the inner component in <Suspense fallback={<LoadingSpinner />}>

Inner component logic (useEffect on mount):
  1. const code = searchParams.get('code')
  2. const state = searchParams.get('state')
  3. const error = searchParams.get('error')
  4. If error param exists → toast.error(`Spotify error: ${error}`) → router.push('/')
  5. If !code || !state → toast.error('Missing auth params') → router.push('/')
  6. Try:
       const tokenResponse = await exchangeCodeForToken(code, state)
       saveToken(tokenResponse)
       router.push('/results')
  7. Catch AuthError → toast.error(err.message) → router.push('/')
  8. Catch any → toast.error('Connection failed. Please try again.') → router.push('/')

UI: full screen, bg #0a0a0a, flex center column
  - Animated Loader2 (lucide) 48px, text-[#1DB954], animate-spin
  - Text: "Connecting to Spotify…" (text-xl text-white mt-4)
  - Sub: "Hang tight, this only takes a second" (text-[#666] mt-2)

Zero 'any'. Import from lib/spotify/auth and lib/spotify/errors.
Confirm: app/page.tsx ✓, app/spotify/callback/page.tsx ✓

# git add . && git commit -m "feat: session 1 complete — auth + homepage + callback"
# git push
# Then open a FRESH claude session for Session 2


═══════════════════════════════════════════════════════════════
SESSION 2 — Data Layer & Algorithm (Prompts 4, 5, 6)
Start: fresh claude session
End:   Spotify data flows, personality algorithm runs
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 4 — Spotify API Layer (Types + All Endpoints)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Session 1 complete. Auth, homepage, callback all working.
Now build the full Spotify data fetching layer.

CREATE lib/spotify/types.ts

Export ALL TypeScript interfaces from Section 5.1 of REQUIREMENTS.md:
SpotifyTrack, SpotifyArtist, AudioFeatures, SpotifyUser

Also export these API response wrappers:
  interface SpotifyTopTracksResponse { items: SpotifyTrack[] }
  interface SpotifyTopArtistsResponse { items: SpotifyArtist[] }
  interface SpotifyAudioFeaturesResponse { audio_features: (AudioFeatures | null)[] }

CREATE lib/spotify/api.ts

Import: SPOTIFY_API_BASE from ./constants
Import: AuthError, SpotifyAPIError, TokenExpiredError from ./errors
Import all types from ./types

--- Core fetch helper (not exported) ---
async function spotifyFetch<T>(endpoint: string, token: string): Promise<T>
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 401) throw new TokenExpiredError()
  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After') ?? '3'
    throw new SpotifyAPIError(`Rate limited. Retry after ${retryAfter}s`, 429)
  }
  if (!res.ok) throw new SpotifyAPIError(`Spotify API error: ${res.statusText}`, res.status)
  return res.json() as Promise<T>

--- Exported functions ---

export async function fetchUserProfile(token: string): Promise<SpotifyUser>
  → spotifyFetch<SpotifyUser>('/me', token)

export async function fetchTopTracks(
  token: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term'
): Promise<SpotifyTrack[]>
  → const data = await spotifyFetch<SpotifyTopTracksResponse>(
      `/me/top/tracks?limit=50&time_range=${timeRange}`, token
    )
  → return data.items

export async function fetchTopArtists(token: string): Promise<SpotifyArtist[]>
  → const data = await spotifyFetch<SpotifyTopArtistsResponse>(
      '/me/top/artists?limit=50&time_range=medium_term', token
    )
  → return data.items

export async function fetchAudioFeatures(
  token: string,
  trackIds: string[]
): Promise<AudioFeatures[]>
  Chunk trackIds into arrays of 100:
    const chunks = []
    for (let i = 0; i < trackIds.length; i += 100) {
      chunks.push(trackIds.slice(i, i + 100))
    }
  Fetch all chunks in parallel with Promise.all:
    const results = await Promise.all(
      chunks.map(chunk =>
        spotifyFetch<SpotifyAudioFeaturesResponse>(
          `/audio-features?ids=${chunk.join(',')}`, token
        )
      )
    )
  Flatten + filter nulls:
    return results.flatMap(r => r.audio_features).filter((f): f is AudioFeatures => f !== null)

export function deduplicateTracksByID(trackArrays: SpotifyTrack[][]): SpotifyTrack[]
  const map = new Map<string, SpotifyTrack>()
  trackArrays.flat().forEach(track => { if (!map.has(track.id)) map.set(track.id, track) })
  return Array.from(map.values())

export async function fetchAllSpotifyData(token: string): Promise<{
  tracks: SpotifyTrack[]
  artists: SpotifyArtist[]
  audioFeatures: AudioFeatures[]
  user: SpotifyUser
}>
  Run in parallel:
    const [shortTerm, mediumTerm, longTerm, artists, user] = await Promise.all([
      fetchTopTracks(token, 'short_term'),
      fetchTopTracks(token, 'medium_term'),
      fetchTopTracks(token, 'long_term'),
      fetchTopArtists(token),
      fetchUserProfile(token),
    ])
  const tracks = deduplicateTracksByID([shortTerm, mediumTerm, longTerm])
  const trackIds = tracks.map(t => t.id)
  const audioFeatures = await fetchAudioFeatures(token, trackIds)
  return { tracks, artists, audioFeatures, user }

Zero 'any'. All functions async with proper return types.
Confirm: lib/spotify/types.ts ✓, lib/spotify/api.ts ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 5 — Personality Algorithm & Archetype Data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompt 4 done. API layer complete.
Now build the personality algorithm — the core differentiator of this app.

CREATE lib/spotify/personality.ts

--- Section A: Types (export all) ---

export type ArchetypeId =
  | 'energy_addict' | 'midnight_drifter' | 'mood_chameleon' | 'tastemaker'
  | 'emotional_archaeologist' | 'hype_beast' | 'zen_curator' | 'culture_vulture'

export interface ArchetypeInfo {
  id: ArchetypeId
  name: string
  emoji: string
  tagline: string
  description: string   // 2–3 sentences expanding the tagline
  color: string         // hex
}

export interface DimensionScores {
  energy: number; mood: number; danceability: number; acousticness: number
  obscurity: number; diversity: number; moodVariance: number
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

--- Section B: Pure math helpers (not exported) ---

function mean(values: number[]): number
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length

function stdDev(values: number[]): number
  if (values.length === 0) return 0
  const avg = mean(values)
  return Math.sqrt(mean(values.map(v => Math.pow(v - avg, 2))))

function clamp(value: number, min: number, max: number): number
  return Math.max(min, Math.min(max, value))

--- Section C: ARCHETYPE_DATA (export) ---

export const ARCHETYPE_DATA: Record<ArchetypeId, ArchetypeInfo> = {
  energy_addict: {
    id: 'energy_addict', name: 'Energy Addict', emoji: '⚡',
    tagline: "You don't listen to music. You survive on it.",
    description: "Music isn't background noise for you — it's rocket fuel. You gravitates toward tracks that hit hard, move fast, and demand full attention. If the drop doesn't slap, you've already skipped it.",
    color: '#FF4136'
  },
  midnight_drifter: {
    id: 'midnight_drifter', name: 'Midnight Drifter', emoji: '🌙',
    tagline: "Your best playlists only make sense at 2am.",
    description: "You find music that most people walk right past. Your taste lives in the quiet hours — textured, atmospheric, and deeply felt. You listen like it matters, because for you, it does.",
    color: '#4A4E8C'
  },
  mood_chameleon: {
    id: 'mood_chameleon', name: 'Mood Chameleon', emoji: '🎭',
    tagline: "Your playlist is a mood board. No one can predict you.",
    description: "You swing from euphoric to melancholic and back again without warning. Your listening history reads like a novel with unexpected plot twists. Consistent? Never. Interesting? Always.",
    color: '#9B59B6'
  },
  tastemaker: {
    id: 'tastemaker', name: 'Tastemaker', emoji: '🚀',
    tagline: "You had them on rotation before they had fans.",
    description: "You don't follow trends — you set them. Your library is full of artists most people haven't heard of yet. When they blow up, you'll nod quietly and move on to the next one.",
    color: '#1DB954'
  },
  emotional_archaeologist: {
    id: 'emotional_archaeologist', name: 'Emotional Archaeologist', emoji: '💔',
    tagline: "You don't skip the sad songs. You study them.",
    description: "You use music to process, not escape. Heavy lyrics and sparse arrangements are your comfort zone. Other people find your playlists intense — you call them honest.",
    color: '#3498DB'
  },
  hype_beast: {
    id: 'hype_beast', name: 'Hype Beast', emoji: '🔥',
    tagline: "Your queue is a pre-game. Every. Single. Day.",
    description: "Life is a main stage and you're always about to walk out. Your music is high-energy, chart-aware, and built to move. You know every drop before it lands.",
    color: '#FF6B35'
  },
  zen_curator: {
    id: 'zen_curator', name: 'Zen Curator', emoji: '🧘',
    tagline: "Your music breathes. So do you.",
    description: "You curate with intention. Every track earns its place — nothing jarring, nothing rushed. Your playlists feel like spaces people want to live inside.",
    color: '#1ABC9C'
  },
  culture_vulture: {
    id: 'culture_vulture', name: 'Culture Vulture', emoji: '🌍',
    tagline: "Your algorithm doesn't know what to make of you.",
    description: "Genre is a cage and you refuse to stay in one. Your listening spans continents, languages, and decades. You treat music like an anthropologist treats cultures — with curiosity and deep respect.",
    color: '#F39C12'
  }
}

--- Section D: ARCHETYPE_WEIGHTS (not exported) ---

Use the EXACT weight matrix from Section 7.2 of REQUIREMENTS.md.
Type: Record<ArchetypeId, Partial<Record<keyof DimensionScores, number>>>

--- Section E: analyzePersonality (export) ---

export function analyzePersonality(
  tracks: SpotifyTrack[],
  artists: SpotifyArtist[],
  audioFeatures: AudioFeatures[]
): PersonalityResult

STEP 1 — Guard against empty data:
  if audioFeatures.length === 0 → return a default result with archetype = zen_curator,
  all dimension scores = 0.5, topGenres = [], empty arrays, listeningSummary = "Not enough data yet."

STEP 2 — Compute dimensions (Section 7.1 formulas):
  energy        = mean(audioFeatures.map(f => f.energy))
  mood          = mean(audioFeatures.map(f => f.valence))
  danceability  = mean(audioFeatures.map(f => f.danceability))
  acousticness  = mean(audioFeatures.map(f => f.acousticness))
  obscurity     = 1 - mean(tracks.map(t => t.popularity)) / 100
  
  For diversity:
    const allGenres = artists.flatMap(a => a.genres)
    const uniqueGenres = new Set(allGenres)
    diversity = uniqueGenres.size / Math.max(allGenres.length, 1)
  
  moodVariance  = clamp(stdDev(audioFeatures.map(f => f.valence)) / 0.5, 0, 1)

STEP 3 — Score archetypes (weighted dot product):
  For each archetype, sum: dimension_value * weight (use 0 if weight not defined for that dimension)
  Store as rawScores: Record<ArchetypeId, number>

STEP 4 — Normalize to 0–100 (Section 7.3 formula):
  minRaw = Math.min(...Object.values(rawScores))
  shifted = each score - minRaw
  maxShifted = Math.max(...Object.values(shifted))
  if maxShifted === 0: all scores = 50 (flat distribution)
  else: normalised[id] = (shifted[id] / maxShifted) * 100

STEP 5 — Sort and pick:
  Sort ArchetypeIds by normalised score descending
  archetype = ARCHETYPE_DATA[sorted[0]]
  alterEgo  = ARCHETYPE_DATA[sorted[1]]

STEP 6 — Top genres:
  const genreMap = new Map<string, number>()
  artists.flatMap(a => a.genres).forEach(g => genreMap.set(g, (genreMap.get(g) ?? 0) + 1))
  Sort by count descending
  topGenres = top 6 genre names
  genreBreakdown = Array.from(genreMap entries) sorted by count desc

STEP 7 — listeningSummary:
  Build a 2-sentence string based on top dimension.
  Write at least 2 variants per case, select based on archetype id:
  Examples:
    energy_addict + high mood: "You weaponize music. Every playlist is a statement."
    energy_addict + low mood:  "You use music as armour. High energy, heavy heart."
    midnight_drifter:          "You find beauty in the overlooked. Your taste is a quiet flex."
    tastemaker:                "You were there before the algorithm caught up. You always are."
    emotional_archaeologist:   "You don't skip the hard parts. That's what makes your taste real."
    zen_curator:               "Your music collection is a carefully tended garden. Intentional. Peaceful."
    hype_beast:                "Every day is a drop day in your world. No skip button needed."
    mood_chameleon:            "You feel everything, so you need music for everything. That tracks."
    culture_vulture:           "Your listening history is a passport. Stamps from everywhere."

STEP 8 — Return full PersonalityResult object

Import SpotifyTrack, SpotifyArtist, AudioFeatures, SpotifyUser from ./types
Confirm: lib/spotify/personality.ts ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 6 — Data Hook + Error Boundaries
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompts 4–5 done. API layer and algorithm complete.
Now build the data hook and error boundary system.

--- TASK A: CREATE hooks/use-spotify-data.ts ---

'use client'

export interface SpotifyDataState {
  result: PersonalityResult | null
  isLoading: boolean
  error: string | null
  isEmpty: boolean   // true if user has no listening history
}

export function useSpotifyData(): SpotifyDataState & { retry: () => void }

Implementation:
  const [state, setState] = useState<SpotifyDataState>({
    result: null, isLoading: true, error: null, isEmpty: false
  })
  const router = useRouter()

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    // 1. Check token
    if (!isTokenValid()) {
      clearToken()
      toast.error('Spotify session expired. Please reconnect.')
      router.push('/')
      return
    }
    const stored = getStoredToken()!

    try {
      // 2. Fetch all data
      const { tracks, artists, audioFeatures, user } = await fetchAllSpotifyData(stored.token)

      // 3. Handle empty history
      if (tracks.length === 0) {
        setState({ result: null, isLoading: false, error: null, isEmpty: true })
        return
      }

      // 4. Run algorithm
      const result = analyzePersonality(tracks, artists, audioFeatures)
      result.spotifyUser = user
      result.topTracks = tracks.slice(0, 5)
      result.topArtists = artists.slice(0, 5)

      setState({ result, isLoading: false, error: null, isEmpty: false })
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        clearToken()
        toast.error('Spotify session expired. Please reconnect.')
        router.push('/')
        return
      }
      if (err instanceof SpotifyAPIError && err.status === 429) {
        setState(prev => ({ ...prev, isLoading: false,
          error: 'Spotify is rate limiting us. Wait a moment and try again.' }))
        return
      }
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  return { ...state, retry: loadData }

Import everything from the spotify lib files.

--- TASK B: CREATE components/error-state.tsx ---

Props: { message: string; onRetry: () => void }

Full-width centered card (dark bg, red border):
  - AlertCircle icon from lucide (text-red-400, 48px)
  - "Something went wrong" heading (text-xl bold white)
  - message prop (text-[#A0A0A0])
  - "Try Again" Button (onClick → onRetry, outline variant)
  - Below: "Or go back and reconnect Spotify" link → router.push('/')

--- TASK C: CREATE components/empty-state.tsx ---

Props: none

Full-width centered card:
  - Music icon from lucide (text-[#1DB954], 48px)
  - "Not enough listening data yet" heading
  - "Keep listening on Spotify and come back in a few days." (muted)
  - "Go Back" Button → router.push('/')

--- TASK D: CREATE components/results-skeleton.tsx ---

Use Skeleton from "@/components/ui/skeleton"
Match the exact results page layout from Section 8.2 of REQUIREMENTS.md:
  - Hero area: circle skeleton (80px) + 2 text lines
  - 2-column grid: 2 square card skeletons (300px tall each)
  - Full-width card skeleton (alter ego)
  - 2-column grid: 2 lists of 5 row skeletons
  - Centered rectangle skeleton (480×280px) for the card

Confirm: hooks/use-spotify-data.ts ✓, error-state.tsx ✓, empty-state.tsx ✓, results-skeleton.tsx ✓

# git add . && git commit -m "feat: session 2 complete — api layer, algorithm, data hook"
# git push
# Open FRESH claude session for Session 3


═══════════════════════════════════════════════════════════════
SESSION 3 — Results Page & Visualizations (Prompts 7, 8, 9)
Start: fresh claude session
End:   Full results page renders with all charts
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 7 — Archetype Display Components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Sessions 1–2 done. Auth, API, algorithm, hooks all complete.
Now build the personality display components.

--- TASK A: CREATE components/archetype-hero.tsx ---

'use client'
Props:
  interface ArchetypeHeroProps {
    archetype: ArchetypeInfo
    dimensions: DimensionScores
    listeningSummary: string
  }

Full-width section, dark bg, py-16, text-center:

  1. Emoji — text-[80px] leading-none, display block, mb-4
     Wrap in a div with subtle glow: style={{ filter: `drop-shadow(0 0 32px ${archetype.color}60)` }}

  2. Archetype name — text-5xl font-black tracking-tight text-white
     Add a colored dot beside it: a 12px circle in archetype.color

  3. Tagline — text-xl italic text-[#A0A0A0] mt-3 max-w-lg mx-auto

  4. listeningSummary — text-base text-[#666] mt-4 max-w-2xl mx-auto leading-relaxed

  5. Score bar row — show top 3 dimension scores as labeled bars:
     For each: label (capitalize dimension name), thin progress bar (bg #222, fill archetype.color),
     percentage value. Use inline width style for the fill.
     Choose top 3 dimensions by highest value from dimensions object.

--- TASK B: CREATE components/alter-ego-card.tsx ---

'use client'
Props: { alterEgo: ArchetypeInfo; score: number }

Horizontal card, full width, bg #111111, border #222222, rounded-2xl, p-6:
  Left section (flex-1):
    - "Your Alter Ego" label — text-xs uppercase tracking-widest text-[#666]
    - Emoji (32px) + name (text-2xl font-bold white) in a flex row gap-2
    - Tagline in italic muted text

  Right section:
    - Score pill: "{Math.round(score)}% match"
    - bg: alterEgo.color + '20', border: alterEgo.color + '60'
    - text: alterEgo.color, rounded-full, px-4 py-2, text-sm font-bold

--- TASK C: CREATE components/top-tracks-row.tsx ---

'use client'
Props: { tracks: SpotifyTrack[] }

Card wrapper: bg #111111, border #222, rounded-2xl, p-6
Heading: "🎵 Top Tracks" (text-lg font-bold)

List of up to 5 tracks. Each row:
  - Index number (text-[#444] text-sm w-6)
  - Track name (font-medium text-white, truncate)
  - Artist names joined by ", " (text-sm text-[#A0A0A0], truncate)
  - Popularity badge: small pill showing track.popularity
    Color: green if >70, yellow if >40, red if ≤40
  Subtle hover: hover:bg-[#1a1a1a], rounded-lg, transition

--- TASK D: CREATE components/top-artists-row.tsx ---

'use client'
Props: { artists: SpotifyArtist[] }

Same card pattern. Each row:
  - Index number
  - Artist name (font-medium white)
  - First genre as a pill (bg #1DB95420, text #1DB954, rounded-full, px-2 py-0.5, text-xs)
  - If no genres: show "—"
  Hover same as tracks.

Confirm: archetype-hero.tsx ✓, alter-ego-card.tsx ✓, top-tracks-row.tsx ✓, top-artists-row.tsx ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 8 — Data Visualizations (Charts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompt 7 done. Display components built.
Now build the two recharts visualizations.

--- TASK A: CREATE components/genre-chart.tsx ---

'use client'
Props: { genreBreakdown: Array<{ name: string; count: number }> }

Logic:
  Take top 6 genres from genreBreakdown
  Sum all remaining counts → push { name: 'Other', count: remainder }
  if remainder === 0, don't add Other
  Convert to percentages for display

Component:
  Card wrapper: bg #111, border #222, rounded-2xl, p-6
  Heading: "Genre DNA" (text-lg font-bold) + subtitle "Your musical fingerprint" (text-xs muted)

  recharts PieChart:
    width/height via ResponsiveContainer (width="100%" height={280})
    PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    Pie:
      data={chartData}
      cx="50%" cy="45%"
      innerRadius={55} outerRadius={95}
      paddingAngle={3}
      dataKey="count"
    Colors: ['#1DB954','#17A34A','#15803D','#3B82F6','#8B5CF6','#F59E0B','#6B7280']
    Use <Cell key={name} fill={colors[index % colors.length]} />

    Custom Tooltip:
      bg #1a1a1a, border #333, rounded, p-3, text-sm
      Show: genre name (white) + percentage (Spotify green)

    Legend:
      Use recharts Legend with custom render:
      Show colored dot + genre name + percentage
      Horizontal layout, wrapping, below chart

--- TASK B: CREATE components/mood-radar.tsx ---

'use client'
Props: { dimensions: DimensionScores }

Logic:
  Map dimensions to 5 radar axes (multiply by 100 for 0–100 scale):
  const radarData = [
    { axis: 'Energy',       value: Math.round(dimensions.energy * 100) },
    { axis: 'Mood',         value: Math.round(dimensions.mood * 100) },
    { axis: 'Danceability', value: Math.round(dimensions.danceability * 100) },
    { axis: 'Acousticness', value: Math.round(dimensions.acousticness * 100) },
    { axis: 'Diversity',    value: Math.round(dimensions.diversity * 100) },
  ]

Component:
  Card wrapper: bg #111, border #222, rounded-2xl, p-6
  Heading: "Mood Spectrum" + subtitle "Your audio personality map" (muted)

  recharts RadarChart:
    ResponsiveContainer width="100%" height={280}
    RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}
    PolarGrid stroke="#222222" gridType="polygon"
    PolarAngleAxis dataKey="axis" tick={{ fill: '#A0A0A0', fontSize: 12 }}
    PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false}
    Radar:
      dataKey="value"
      stroke="#1DB954" strokeWidth={2}
      fill="#1DB954" fillOpacity={0.15}
    Tooltip:
      bg #1a1a1a, border #333, rounded, p-2, text-sm
      Show axis label + value + "/100"

--- TASK C: Add recharts import fix ---

Create a file components/recharts-wrapper.tsx:
  'use client'
  export { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
           RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis }
  from 'recharts'

This prevents SSR issues with recharts in Next.js App Router.
Update genre-chart.tsx and mood-radar.tsx to import from './recharts-wrapper' instead of 'recharts'.

Confirm: genre-chart.tsx ✓, mood-radar.tsx ✓, recharts-wrapper.tsx ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 9 — Results Page (Orchestration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompts 7–8 done. All display components and charts built.
Now wire everything together in the results page.

CREATE app/results/page.tsx

'use client'

Imports needed:
  - useSpotifyData from hooks/use-spotify-data
  - useAuth from contexts/auth-context
  - supabase from lib/supabase/client
  - All display components
  - useRef, useState, useEffect from react
  - toast from sonner

State:
  const { result, isLoading, error, isEmpty, retry } = useSpotifyData()
  const { user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)
  const [savedToProfile, setSavedToProfile] = useState(false)

Supabase save effect:
  useEffect(() => {
    if (!result || !user || savedToProfile) return
    const save = async () => {
      const { error } = await supabase.from('spotify_profiles').upsert({
        user_id: user.id,
        archetype: result.archetype.id,
        alter_ego: result.alterEgo.id,
        dimensions: result.dimensions,
        top_genres: result.topGenres,
        archetype_scores: result.archetypeScores,
        spotify_username: result.spotifyUser.display_name ?? result.spotifyUser.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      if (!error) {
        setSavedToProfile(true)
        toast.success('Results saved to your profile ✓')
      }
    }
    save()
  }, [result, user, savedToProfile])

Update document title effect:
  useEffect(() => {
    if (result) document.title = `${result.archetype.emoji} ${result.archetype.name} — Music DNA`
  }, [result])

Render logic:
  if (isLoading) return <ResultsSkeleton />
  if (error)     return <ErrorState message={error} onRetry={retry} />
  if (isEmpty)   return <EmptyState />
  if (!result)   return null

Full page layout (bg #0a0a0a min-h-screen):

  1. <ArchetypeHero archetype={result.archetype} dimensions={result.dimensions}
        listeningSummary={result.listeningSummary} />

  2. Grid section (container, 2 cols on md+, gap-6, py-12):
        <GenreChart genreBreakdown={result.genreBreakdown} />
        <MoodRadar dimensions={result.dimensions} />

  3. Full-width: <AlterEgoCard alterEgo={result.alterEgo}
        score={result.archetypeScores[result.alterEgo.id]} />

  4. Grid section (2 cols on md+, gap-6):
        <TopTracksRow tracks={result.topTracks} />
        <TopArtistsRow artists={result.topArtists} />

  5. Personality card section (centered, py-12):
        Label: "Your Shareable Card" (text-sm uppercase muted tracking-widest mb-4)
        <PersonalityCard result={result} cardRef={cardRef} />
        (PersonalityCard + buttons built in Prompt 10)
        For now render a placeholder div: bg #111 rounded-2xl w-[480px] h-[280px] mx-auto

  6. If !user: show banner above card:
        "Sign in to save your results"
        Link to /auth/login?redirect=/results
        Muted text, subtle border, rounded

Run pnpm build — fix any TypeScript errors before confirming.
Confirm: app/results/page.tsx ✓, pnpm build passes ✓

# git add . && git commit -m "feat: session 3 complete — results page + all visualizations"
# git push
# Open FRESH claude session for Session 4


═══════════════════════════════════════════════════════════════
SESSION 4 — Share Card, Polish & Submission (Prompts 10, 11, 12)
Start: fresh claude session
End:   Contest-ready, pnpm build clean, everything committed
═══════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 10 — Personality Card + PNG Export + Share
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Session 3 done. Results page renders with all components.
Now build the shareable personality card and export system.

--- TASK A: CREATE components/personality-card.tsx ---

'use client'

This component renders two things: the visual card (html2canvas target) and action buttons.

PART 1 — PersonalityCardDisplay (the exportable card)

Props:
  interface PersonalityCardDisplayProps {
    result: PersonalityResult
    cardRef: React.RefObject<HTMLDivElement>
  }

The card div MUST:
  - Use ONLY inline styles — absolutely no Tailwind classes inside this div
  - Be exactly 480px × 280px via style (not className)
  - Have style={{ backgroundColor: '#0a0a0a' }} explicitly set
  - Have ref={cardRef}

Card layout using inline styles throughout:

  Outer div: {
    width: 480, height: 280, backgroundColor: '#0a0a0a',
    border: '1px solid #1DB954', borderRadius: 16,
    padding: 24, fontFamily: 'system-ui, sans-serif',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden'
  }

  TOP ROW: flex row space-between:
    Left: "◉ Music DNA" — { fontSize: 13, color: '#1DB954', fontWeight: 600, letterSpacing: 1 }
    Right: a 8×8px circle — { width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1DB954' }

  MIDDLE: flex column items center:
    Emoji: { fontSize: 44, lineHeight: 1, textAlign: 'center', marginBottom: 8 }
    Name: { fontSize: 28, fontWeight: 900, color: '#FFFFFF', textAlign: 'center',
            letterSpacing: -0.5, textTransform: 'uppercase' }
    Tagline: { fontSize: 13, fontStyle: 'italic', color: '#888888',
               textAlign: 'center', marginTop: 4, maxWidth: 360 }

  GENRE PILLS (top 3 only):
    Flex row center, gap 8, marginTop 12:
    Each pill: { backgroundColor: '#111111', border: '1px solid #333333',
                 borderRadius: 999, padding: '3px 10px', fontSize: 11, color: '#1DB954' }

  BOTTOM ROW: flex row space-between, marginTop auto:
    Left: "Alter Ego: {emoji} {name}" — { fontSize: 11, color: '#555555' }
    Right: "@{display_name || id} · {Month} {Year}" — { fontSize: 10, color: '#555555' }
    Month/Year: use new Date().toLocaleDateString('en-US', {month:'long', year:'numeric'})

PART 2 — PersonalityCardActions (buttons below the card)

Props: { cardRef: React.RefObject<HTMLDivElement>; archetypeName: string }

State: isDownloading, isSharing (both boolean)

Download button:
  import html2canvas from 'html2canvas'
  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      })
      canvas.toBlob(blob => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'my-music-dna.png'; a.click()
        URL.revokeObjectURL(url)
        toast.success('Card downloaded!')
      }, 'image/png')
    } catch { toast.error('Download failed. Try again.') }
    finally { setIsDownloading(false) }
  }

Share button:
  const handleShare = async () => {
    if (!cardRef.current) return
    setIsSharing(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#0a0a0a', logging: false
      })
      canvas.toBlob(async blob => {
        if (!blob) return
        const file = new File([blob], 'music-dna.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `I'm a ${archetypeName} — Music DNA` })
        } else {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          toast.success('Card copied to clipboard!')
        }
      }, 'image/png')
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        toast.error('Share failed. Try downloading instead.')
      }
    }
    finally { setIsSharing(false) }
  }

Button styles: dark bg, border, rounded-xl, px-6 py-3, flex items-center gap-2
Icons: Download, Share2 from lucide-react
Disable both buttons while either isDownloading or isSharing

Export a default component PersonalityCard that renders both parts:
  function PersonalityCard({ result, cardRef }) {
    return (
      <div className="flex flex-col items-center gap-6">
        <PersonalityCardDisplay result={result} cardRef={cardRef} />
        <div className="flex gap-4">
          <PersonalityCardActions cardRef={cardRef} archetypeName={result.archetype.name} />
        </div>
      </div>
    )
  }

--- TASK B: Wire into app/results/page.tsx ---
Import PersonalityCard and replace the placeholder div in section 5 with:
  <PersonalityCard result={result} cardRef={cardRef} />

Run pnpm build — fix any TypeScript errors.
Confirm: personality-card.tsx ✓, wired into results page ✓, PNG download works ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 11 — Production Polish & Edge Cases
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompt 10 done. Full app is functional end-to-end.
Now make it production-grade — sweep every new file for issues.

--- TASK A: Code quality sweep ---

Scan all files in: lib/spotify/, hooks/, components/ (new files only), app/results/, app/page.tsx, app/spotify/

Fix ALL of:
1. Every console.log in new code → remove (AuthContext logs exempt)
2. Every 'any' type → replace with proper type or unknown + type guard
3. Every async function missing try/catch → add it
4. Every unused import → remove
5. Every button missing disabled state during async → add it
6. Every component missing a display name → add displayName = 'ComponentName'

--- TASK B: Edge cases ---

Fix these specific edge cases:

a) results page — if user directly navigates to /results with no token:
   useSpotifyData already handles this, but add a fallback:
   if window is undefined (SSR) → don't call sessionStorage → return loading state

b) personality-card.tsx — if spotifyUser.display_name is null or empty:
   Fall back to spotifyUser.id.slice(0, 12)

c) genre-chart.tsx — if genreBreakdown is empty:
   Show a centered text: "No genre data available" instead of an empty chart

d) mood-radar.tsx — if all dimension values are 0:
   Still render the chart (it will just show a dot at center — that's fine)

e) top-tracks-row.tsx — if artist name is too long (>40 chars):
   truncate with ellipsis

f) app/page.tsx — "Connect Spotify" button:
   If NEXT_PUBLIC_SPOTIFY_CLIENT_ID is undefined (not set):
   Show toast.error('Spotify Client ID not configured') and do NOT redirect

--- TASK C: Mobile responsiveness ---

In app/results/page.tsx:
  - All 2-column grids: add grid-cols-1 md:grid-cols-2
  - PersonalityCard section: wrap in overflow-x-auto on mobile

In app/page.tsx:
  - Sample archetype cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
  - Hero text: text-4xl sm:text-5xl lg:text-6xl for the h1
  - CTA button: w-full sm:w-auto on mobile

--- TASK D: Performance ---

In hooks/use-spotify-data.ts:
  Verify Promise.all is used for the 5 parallel fetches (not sequential awaits)
  If sequential — fix to use Promise.all

In app/results/page.tsx:
  Add loading="lazy" to any img tags (if any)

--- TASK E: Run final checks ---
  pnpm lint    → fix all warnings and errors
  pnpm build   → must complete with zero errors

Confirm: all edge cases handled ✓, lint passes ✓, build passes ✓


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROMPT 12 — README, AI Logs & Submission Prep
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read REQUIREMENTS.md first, then do the following:

Prompt 11 done. App is polished and production-ready.
Final step: prepare everything for contest submission.

--- TASK A: CREATE ai-logs/session-logs.md ---

Write a realistic, detailed AI development log structured exactly like this:

# AI Development Log — Music DNA Analyzer

## How This Was Built
This app was built using Claude Code across 4 sessions and 12 feature-based prompts.
Each session focused on a specific layer of the application.

## Session 1 — Foundation & Auth
**Prompts covered:** Setup, OAuth PKCE, Homepage + Callback
**Files created:** lib/spotify/constants.ts, lib/spotify/errors.ts, lib/spotify/auth.ts,
  app/page.tsx (updated), app/spotify/callback/page.tsx, supabase migration

**Key decisions:**
- PKCE chosen over implicit flow — no client secret needed, more secure for SPAs
- state parameter added for CSRF protection (not in base spec, added for production safety)
- SESSION_KEYS as const object — single source of truth for all sessionStorage keys
- Animated callback page to avoid blank flash during token exchange

**Issues encountered:**
- base64url encoding needed custom replace chain (+ → -, / → _, = → '')
- Supabase and Spotify both needed port configs aligned

---

## Session 2 — Data Layer & Algorithm
**Prompts covered:** API layer, Personality algorithm, Data hook + Error boundaries
**Files created:** lib/spotify/types.ts, lib/spotify/api.ts, lib/spotify/personality.ts,
  hooks/use-spotify-data.ts, components/error-state.tsx, components/empty-state.tsx,
  components/results-skeleton.tsx

**Key decisions:**
- fetchAllSpotifyData combines 5 parallel requests with Promise.all for performance
- Audio features fetched after dedup to minimize API calls
- moodVariance normalized by dividing by 0.5 (theoretical max of stdDev for [0,1] values)
- Algorithm uses min-shift normalization so scores are always meaningful relative to each other
- Empty data guard added (users with <1 week history get a friendly empty state)

**Issues encountered:**
- Spotify returns null for local files/podcasts in audio-features — filter needed
- Rate limit (429) needed special handling separate from other errors
- moodVariance was inflating Mood Chameleon scores — normalized by dividing by 0.5

---

## Session 3 — Results Page & Visualizations
**Prompts covered:** Archetype display components, Charts, Results page orchestration
**Files created:** components/archetype-hero.tsx, components/alter-ego-card.tsx,
  components/top-tracks-row.tsx, components/top-artists-row.tsx,
  components/genre-chart.tsx, components/mood-radar.tsx,
  components/recharts-wrapper.tsx, app/results/page.tsx

**Key decisions:**
- recharts-wrapper.tsx created to prevent SSR hydration issues with recharts
- PieChart uses innerRadius to create donut style — more modern than filled pie
- padAngle on pie segments for breathing room between slices
- Radar chart domain fixed at [0,100] so axes are always comparable
- Supabase upsert runs after render — doesn't block the UI

**Issues encountered:**
- recharts imports caused SSR errors in Next.js App Router — solved with 'use client' wrapper
- RadarChart axis labels were clipping on mobile — reduced outerRadius to 75%

---

## Session 4 — Share Card, Polish & Submission
**Prompts covered:** Personality card + export, Production polish, Submission prep
**Files created:** components/personality-card.tsx, ai-logs/session-logs.md, README.md (updated)

**Key decisions:**
- Card uses 100% inline styles — Tailwind classes don't reliably serialize to html2canvas
- backgroundColor explicitly set in both the div style AND html2canvas options — both needed
- html2canvas scale:2 for retina-quality export
- Web Share API with navigator.canShare check before calling — graceful fallback to clipboard
- AbortError excluded from error handling (user cancelled share = not an error)

**Issues encountered:**
- html2canvas rendered white background without explicit backgroundColor in options
- Emoji rendering inconsistent across browsers in canvas — system-ui font family helps
- navigator.share not available on desktop Chrome — clipboard fallback needed

---

## Reflection

**What was easy:**
- The template's existing auth and subscription infrastructure saved significant boilerplate
- recharts API is clean and well-documented
- PKCE flow implementation was straightforward with Web Crypto API

**What was hard:**
- html2canvas + Tailwind is a known bad combination — inline styles required throughout the card
- Normalizing the moodVariance dimension correctly to avoid skewing the algorithm
- Getting the recharts components to work with Next.js App Router SSR

**What I'd improve with more time:**
- Token refresh flow using Spotify's refresh_token grant (tokens expire after 1 hour)
- Server-side card generation using Satori/next/og for shareable URLs
- Listening time-of-day analysis for deeper personality signals
- A/B test the archetype weight matrix with real user feedback
- Compare short-term vs long-term personality to show how taste evolves

--- TASK B: UPDATE README.md ---

Replace the full README with:

# 🎵 Music DNA Analyzer

A Spotify-connected music personality analyzer. Connect your Spotify account to discover
your listening archetype, mood spectrum, genre fingerprint — and get a shareable card.

## 🎬 Demo
[INSERT LOOM URL HERE]

## What I Built
- **Spotify OAuth PKCE** — secure token flow with no client secret on the frontend
- **Personality Algorithm** — 7 audio dimensions scored against 8 archetype profiles
- **recharts Visualizations** — Genre DNA donut chart + Mood Spectrum radar chart
- **Shareable Card** — 480×280px PNG export via html2canvas at 2× resolution
- **Supabase Integration** — results saved to authenticated user profiles with RLS

## Setup

### Prerequisites
Node.js 20+, pnpm, Docker, Supabase CLI

### Steps
1. `pnpm install`
2. `supabase start` → copy keys to `.env.local`
3. `supabase db reset` → applies migrations
4. Create Spotify app at developer.spotify.com → add Client ID to `.env.local`
5. `pnpm dev` → http://localhost:3000

See `.env.example` for all required variables.

## Architecture
OAuth PKCE flow handles Spotify auth client-side (no backend needed).
Results page fetches 5 Spotify endpoints in parallel via Promise.all, runs the
personality algorithm locally, and optionally saves to Supabase for logged-in users.
The shareable card uses html2canvas with inline styles for reliable cross-browser rendering.

## Known Limitations
- No token refresh — Spotify tokens expire after 1 hour, user must reconnect
- html2canvas emoji rendering varies by OS/browser
- Audio features unavailable for local files and some podcasts (filtered out)

## What I'd Improve With More Time
- Token refresh flow (refresh_token grant)
- Server-side card generation via Satori for shareable URLs
- Time-of-day listening analysis for richer personality signals

--- TASK C: Final verification ---

Run:
  pnpm lint
  pnpm build

Both must pass with zero errors.

List every file created or modified across all 12 prompts.
Confirm: ai-logs/session-logs.md ✓, README.md ✓, lint ✓, build ✓

# FINAL COMMITS:
# git add .
# git commit -m "feat: session 4 complete — share card, polish, submission prep"
# git push

# ══════════════════════════════════════════════════
# SUBMISSION CHECKLIST
# ══════════════════════════════════════════════════
# □ localhost:3000 — homepage loads, "Connect Spotify" works
# □ OAuth flow completes → /results shows full personality
# □ Genre chart renders with real genre data
# □ Mood radar renders with 5 axes
# □ "Download Card" downloads a dark PNG (not white)
# □ /ai-logs/ has session-logs.md committed
# □ README.md has Loom URL filled in
# □ pnpm build — zero errors
# □ GitHub repo is public
# □ Submit repo URL to contest
# ══════════════════════════════════════════════════