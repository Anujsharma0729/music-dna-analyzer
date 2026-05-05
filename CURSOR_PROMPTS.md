# 🎯 Cursor Prompts — Music DNA Analyzer
**Use these 6 prompts in order. Each one builds on the previous.**  
**Before starting:** Upload `REQUIREMENTS.md` to Cursor context. Run setup commands below first.

---

## ⚡ One-time Setup (run these manually before Prompt 1)

```bash
# 1. Install dependencies
pnpm install

# 2. Start Supabase locally
supabase start
# Copy the printed keys into .env.local

# 3. Add these to .env.local
# NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
# NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify/callback

# 4. Add new packages
pnpm add recharts html2canvas
pnpm add -D @types/html2canvas

# 5. Start the dev server
pnpm dev
```

---

## PROMPT 1 — Spotify Auth + Homepage

> Paste this entire block as your first message in Cursor with REQUIREMENTS.md attached.

```
I'm building a Music DNA Personality Analyzer app based on the attached REQUIREMENTS.md.
This is a Next.js 16 + TypeScript + Tailwind + Supabase starter template.

Complete ALL of the following in one go:

─── TASK 1: lib/spotify/auth.ts ───────────────────────────────────────────
Create this file implementing full Spotify OAuth 2.0 PKCE. Export these functions:

  generateCodeVerifier(): string
    → 96 random bytes via crypto.getRandomValues, base64url encoded, trimmed to 128 chars

  generateCodeChallenge(verifier: string): Promise<string>
    → SHA-256 hash of verifier via Web Crypto API, base64url encoded

  generateState(): string
    → 16 random bytes, hex encoded

  buildSpotifyAuthUrl(clientId: string, redirectUri: string): string
    → stores verifier + state in sessionStorage
    → returns full https://accounts.spotify.com/authorize URL with params:
       client_id, response_type=code, redirect_uri, code_challenge_method=S256,
       code_challenge, state, scope="user-top-read user-read-recently-played user-read-private"

  exchangeCodeForToken(code: string, clientId: string, redirectUri: string): Promise<SpotifyTokenResponse>
    → reads verifier from sessionStorage
    → asserts verifier exists (throws if not)
    → POSTs to https://accounts.spotify.com/api/token
    → clears verifier + state from sessionStorage after exchange
    → returns { access_token, token_type, expires_in, scope }

  saveTokenToSession(token: SpotifyTokenResponse): void
    → saves access_token and expiry timestamp (Date.now() + expires_in * 1000) to sessionStorage

  getStoredToken(): { token: string; expiresAt: number } | null
    → reads from sessionStorage, returns null if missing

  isTokenExpired(): boolean
    → returns true if no token or expiresAt < Date.now()

Export interface SpotifyTokenResponse { access_token: string; token_type: string; expires_in: number; scope: string }

Zero 'any' types. All errors thrown as typed Error with descriptive message.

─── TASK 2: app/spotify/callback/page.tsx ─────────────────────────────────
'use client' — this page handles the OAuth redirect.

On mount (useEffect):
  1. Read ?code and ?state from useSearchParams()
  2. Read stored state from sessionStorage
  3. If state mismatch or missing → toast.error("Authentication failed") → router.push("/")
  4. If no code → toast.error("No authorization code") → router.push("/")
  5. Call exchangeCodeForToken(code, clientId, redirectUri)
     - clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
     - redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!
  6. Call saveTokenToSession(token)
  7. router.push("/results")
  8. On any catch → toast.error("Failed to connect Spotify") → router.push("/")

UI: full-screen flex-center dark background, animated spinner (use Lucide Loader2 with animate-spin),
text "Connecting to Spotify…" in muted colour below spinner.

─── TASK 3: app/page.tsx (replace existing) ───────────────────────────────
Replace the current generic hero with a Spotify-themed version. Keep the existing Navigation
and Footer imports. New content:

Hero section (min-h-[85vh] flex items-center, dark bg):
  - Small pill badge: "🎵 Music Personality Analyzer"
  - H1: "Discover Your Music DNA" (large, bold, white)
  - Subtitle: "Connect your Spotify and find out what your listening habits say about
    you — your archetype, mood spectrum, and a shareable personality card."
  - One big CTA button: "Connect Spotify — It's Free" (Spotify green #1DB954, onClick calls
    buildSpotifyAuthUrl then window.location.href = url)
  - Small note below: "No account needed · We never store your Spotify password"

Sample Archetypes section below fold (3 cards in a responsive grid):
  Show 3 hardcoded preview cards for: ⚡ Energy Addict, 🌙 Midnight Drifter, 🚀 Tastemaker
  Each card: dark bg #111111, border #222222, emoji large, name bold, tagline in muted italic.
  Cards are visual only — not clickable.

All code must be TypeScript strict, no 'any'. Use the sonner toast from the template.
When done, confirm: lib/spotify/auth.ts ✓, app/spotify/callback/page.tsx ✓, app/page.tsx ✓
```

---

## PROMPT 2 — Spotify API Layer + Personality Algorithm

> Wait for Prompt 1 to finish and verify the homepage loads. Then paste this.

```
REQUIREMENTS.md is attached. Continuing the Music DNA app build.

Prompt 1 is done: auth.ts, callback page, and homepage exist.
Now build the data layer and core algorithm.

─── TASK 1: lib/spotify/api.ts ────────────────────────────────────────────
Create all Spotify REST call functions and TypeScript interfaces.

Interfaces to export (match Section 5.1 of REQUIREMENTS.md exactly):
  SpotifyTrack, SpotifyArtist, AudioFeatures, SpotifyUser

Custom error classes to export:
  class AuthError extends Error { constructor(msg: string) { super(msg); this.name = 'AuthError' } }
  class SpotifyAPIError extends Error { status: number; constructor(msg: string, status: number) {...} }

Helper (not exported):
  async function spotifyFetch<T>(url: string, token: string): Promise<T>
    → fetch with Authorization: Bearer header
    → throw AuthError if status === 401
    → throw SpotifyAPIError(await res.text(), res.status) for any other non-ok status

Functions to export:
  fetchUserProfile(token: string): Promise<SpotifyUser>
    → GET https://api.spotify.com/v1/me

  fetchTopTracks(token: string, timeRange: 'short_term' | 'medium_term' | 'long_term'): Promise<SpotifyTrack[]>
    → GET https://api.spotify.com/v1/me/top/tracks?limit=50&time_range={timeRange}
    → return response.items

  fetchTopArtists(token: string): Promise<SpotifyArtist[]>
    → GET https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term
    → return response.items

  fetchAudioFeatures(token: string, trackIds: string[]): Promise<AudioFeatures[]>
    → Chunk trackIds into arrays of 100
    → For each chunk: GET https://api.spotify.com/v1/audio-features?ids={chunk.join(',')}
    → Flatten all chunks into one array
    → Filter out any null values (Spotify returns null for local files/podcasts)
    → Return AudioFeatures[]

  deduplicateTracksByID(tracks: SpotifyTrack[][]): SpotifyTrack[]
    → Flatten all arrays, use Map keyed by track.id to deduplicate
    → Return deduplicated SpotifyTrack[]

─── TASK 2: lib/spotify/personality.ts ────────────────────────────────────
Create the personality algorithm. This file has two parts: data and logic.

PART A — ARCHETYPE_DATA: const ARCHETYPE_DATA: Record<ArchetypeId, ArchetypeInfo>
Populate all 8 archetypes using exact IDs, names, emojis, taglines, and colors from
Section 7.4 of REQUIREMENTS.md. Write a 2–3 sentence `description` for each that expands
on the tagline with personality insight.

PART B — WEIGHTS: const ARCHETYPE_WEIGHTS: Record<ArchetypeId, Partial<DimensionWeights>>
Use the exact weight matrix from Section 7.2 of REQUIREMENTS.md.
DimensionWeights = { energy: number; mood: number; danceability: number; acousticness: number; obscurity: number; diversity: number; moodVariance: number }

PART C — ALGORITHM: export function analyzePersonality(tracks, artists, features): PersonalityResult

Implement exactly as per Section 7.1 and 7.3 of REQUIREMENTS.md:
1. Compute 7 dimension scores (mean/stdDev helper functions, moodVariance clamped to [0,1] by dividing by 0.5)
2. Score all 8 archetypes via weighted dot product
3. Normalize scores to 0–100 using min-shift + max-scale formula from Section 7.3
4. Sort descending → primary = index 0, alterEgo = index 1
5. Extract top genres: flatten artist.genres[], count frequency, sort desc, slice top 6
6. Build genreBreakdown array
7. Generate listeningSummary: 2-sentence string based on top dimension values
   (e.g. high energy + low mood → "You use music as armour, not comfort. Your playlists hit hardest when the world feels quietest.")
   Write at least 3 variants per archetype, select based on the spread of dimension scores.
8. Return full PersonalityResult (Section 5.2 of REQUIREMENTS.md)

Export: ArchetypeId, ArchetypeInfo, DimensionScores, PersonalityResult types
Export: ARCHETYPE_DATA (for use in UI components)
Export: analyzePersonality function

Zero 'any'. All helpers (mean, stdDev) as pure functions at top of file.
When done, confirm: lib/spotify/api.ts ✓, lib/spotify/personality.ts ✓
```

---

## PROMPT 3 — Data Hook + Supabase Migration

> Wait for Prompt 2 to finish. Then paste this.

```
REQUIREMENTS.md is attached. Continuing the Music DNA app build.

Prompts 1 and 2 done: auth, callback, homepage, API layer, algorithm all exist.
Now build the data hook and Supabase migration.

─── TASK 1: hooks/use-spotify-data.ts ─────────────────────────────────────
Create a custom hook that orchestrates all data fetching and returns a result.

export function useSpotifyData(): {
  result: PersonalityResult | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

Logic inside the hook:
  1. On mount, call getStoredToken() from lib/spotify/auth.ts
  2. If null or isTokenExpired() → redirect to "/" with toast "Connect Spotify first"
  3. Set isLoading = true
  4. Run in parallel with Promise.all:
       fetchTopTracks(token, 'short_term')
       fetchTopTracks(token, 'medium_term')
       fetchTopTracks(token, 'long_term')
       fetchTopArtists(token)
       fetchUserProfile(token)
  5. deduplicateTracksByID([short, medium, long])
  6. fetchAudioFeatures(token, allTrackIds)
  7. analyzePersonality(tracks, artists, features)
  8. Set result, isLoading = false
  9. On AuthError → redirect to "/" with toast "Spotify session expired, please reconnect"
  10. On any other error → set error message, isLoading = false (so retry button works)

The `retry` function re-runs the whole fetch sequence.

─── TASK 2: supabase/migrations/20260506_create_spotify_profiles.sql ──────
Create the migration file with the exact SQL from Section 5.3 of REQUIREMENTS.md.
Include: CREATE TABLE, UNIQUE constraint, RLS enable, and all 3 policies.

─── TASK 3: components/results-skeleton.tsx ───────────────────────────────
Create a loading skeleton that matches the results page layout exactly.
Use the Skeleton component from "@/components/ui/skeleton" (already in template).

Layout to match (see Section 8.2 of REQUIREMENTS.md):
  - Hero skeleton: large circle (emoji placeholder) + two lines of text
  - Two side-by-side chart skeletons (square aspect ratio)
  - Alter ego card skeleton (full width, shorter)
  - Two columns of 5 list-item skeletons each
  - Card skeleton centered (480×280px)

Use Tailwind for layout. Animate via the built-in skeleton pulse.

When done, run: supabase db reset
Confirm: hooks/use-spotify-data.ts ✓, migration applied ✓, results-skeleton.tsx ✓
```

---

## PROMPT 4 — Results Page + All Display Components

> Wait for Prompt 3 to finish and verify `supabase db reset` applies cleanly. Then paste this.

```
REQUIREMENTS.md is attached. Continuing the Music DNA app build.

Prompts 1–3 done. Now build the entire results page and all its display components.
Build ALL components and the page in one pass.

─── TASK 1: components/archetype-hero.tsx ─────────────────────────────────
Props: { archetype: ArchetypeInfo; dimensions: DimensionScores; listeningSummary: string }

Full-width dark section:
  - Archetype emoji at 80px font size, centered
  - Archetype name in 48px bold white (use archetype.color as text-shadow or a colored dot beside it)
  - Tagline in 20px italic, color #A0A0A0
  - listeningSummary in 16px, color #666666, max-w-2xl centered

─── TASK 2: components/alter-ego-card.tsx ─────────────────────────────────
Props: { alterEgo: ArchetypeInfo; score: number }

Horizontal card (full width): dark bg #111111, border #222222, rounded-xl, p-6
Left side: emoji (40px) + "Your Alter Ego" label (muted) + alter ego name (bold) + tagline (italic muted)
Right side: score badge "#{score}% match" in archetype color

─── TASK 3: components/genre-chart.tsx ────────────────────────────────────
Props: { genreBreakdown: Array<{ name: string; count: number }> }

Implement exactly as Section 8.3 of REQUIREMENTS.md:
  - Take top 6 genres, group rest as "Other"
  - recharts PieChart with innerRadius={60} outerRadius={100}
  - Colors array from spec
  - Custom tooltip showing name + percentage
  - Legend below, horizontal
  - Wrapped in ResponsiveContainer width="100%" height={300}
  - Card wrapper: dark bg, border, rounded, p-4, heading "Genre DNA"

─── TASK 4: components/mood-radar.tsx ─────────────────────────────────────
Props: { dimensions: DimensionScores }

Implement exactly as Section 8.3 of REQUIREMENTS.md:
  - recharts RadarChart, 5 axes: Energy, Mood, Danceability, Acousticness, Diversity
  - Convert each dimension score to 0–100 before passing to chart
  - Fill rgba(29,185,84,0.2), stroke #1DB954, strokeWidth 2
  - PolarGrid stroke #222222
  - ResponsiveContainer width="100%" height={300}
  - Card wrapper with heading "Mood Spectrum"

─── TASK 5: components/top-tracks-row.tsx ─────────────────────────────────
Props: { tracks: SpotifyTrack[] }

Card with heading "Top Tracks". List of up to 5 tracks:
  Each row: index number (muted), track name (bold), artist name (muted smaller)
  Subtle hover bg on each row.

─── TASK 6: components/top-artists-row.tsx ────────────────────────────────
Props: { artists: SpotifyArtist[] }

Same pattern as top-tracks-row but for artists. Show artist name + first genre tag as a pill.

─── TASK 7: app/results/page.tsx ──────────────────────────────────────────
'use client'

Import and use useSpotifyData() hook.
Import and use useAuth() from contexts/auth-context (for Supabase save).

States:
  const { result, isLoading, error, retry } = useSpotifyData()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

Render logic:
  if (isLoading) → return <ResultsSkeleton />
  if (error) → return centered error card: red icon, error message, <Button onClick={retry}>Try Again</Button>
  if (!result) → return null

Full page layout using Section 8.2 of REQUIREMENTS.md layout spec.
Use Tailwind grid/flex for 2-column sections. Dark bg throughout.

Supabase save logic (after result is set, inside useEffect):
  If user is authed:
    → import supabase from lib/supabase/client
    → upsert to spotify_profiles table (columns from Section 5.3)
    → onConflict: 'user_id'
    → setSaved(true) on success, show toast "Results saved to your profile"
  If not authed:
    → show a banner: "Sign in to save your results" with Link to /auth/login?redirect=/results

Add page metadata export:
  export const metadata = { title: `Your Music DNA — ${result?.archetype.name}` }
  (Use a client-side document.title update since it's 'use client')

When done, run pnpm build and fix any TypeScript errors before confirming.
Confirm: all 6 components ✓, app/results/page.tsx ✓, pnpm build passes ✓
```

---

## PROMPT 5 — Personality Card + PNG Export + Share

> Wait for Prompt 4 to finish and verify the results page renders correctly in the browser. Then paste this.

```
REQUIREMENTS.md is attached. Continuing the Music DNA app build.

Prompts 1–4 done. Results page renders with all components.
Now build the shareable personality card with PNG export.

─── TASK 1: components/personality-card.tsx ───────────────────────────────
This component has two parts: the visual card (export target) and the action buttons.

PART A — The Card (forwardRef for html2canvas)
Create a forwardRef component: PersonalityCardDisplay
Props: { result: PersonalityResult; cardRef: React.RefObject<HTMLDivElement> }

The card div must:
  - Be exactly 480px wide × 280px tall (use style={{width:'480px', height:'280px'}} NOT Tailwind w/h)
  - Use ONLY inline styles (no Tailwind classes inside the card) — this is critical for html2canvas
  - Background: #0a0a0a
  - Border: '1px solid #1DB954'
  - Border radius: 16px
  - Padding: 24px
  - Font family: inherit (will use Geist from body)

Card layout (all inline styles):
  TOP ROW: "◉ Music DNA" text left (color #1DB954, fontSize 13px) | green dot right (8px circle #1DB954)

  CENTER:
    - Emoji at fontSize 48px, display block, textAlign center, marginTop 16px
    - Archetype name: fontSize 32px, fontWeight 800, color #FFFFFF, textAlign center, marginTop 8px, letterSpacing -0.5px
    - Tagline: fontSize 14px, fontStyle italic, color #A0A0A0, textAlign center, marginTop 6px

  GENRE PILLS ROW (top 3 genres):
    Flex row, gap 8px, marginTop 16px, justifyContent center
    Each pill: backgroundColor #1a1a1a, border '1px solid #333', borderRadius 999px,
    padding '4px 12px', fontSize 12px, color #1DB954

  BOTTOM ROW:
    Left: "Alter Ego: {alterEgo.emoji} {alterEgo.name}" — fontSize 12px, color #666666
    Right: "@{spotifyUser.display_name} · {currentMonth} {currentYear}" — fontSize 11px, color #666666

PART B — Action Buttons (separate component, NOT inside the card div)
Props: { cardRef: React.RefObject<HTMLDivElement>; archetypeName: string }

Button 1: "Download PNG"
  - import html2canvas from 'html2canvas'
  - onClick: const canvas = await html2canvas(cardRef.current!, { scale: 2, useCORS: true, backgroundColor: '#0a0a0a' })
  - canvas.toBlob(blob => { link.href = URL.createObjectURL(blob); link.download = 'my-music-dna.png'; link.click() })
  - Show loading state on button during export (disable + spinner)
  - Use toast.success("Card downloaded!") on completion

Button 2: "Share"
  - First try: navigator.share({ files: [new File([blob], 'music-dna.png', {type:'image/png'})] })
  - If navigator.share not available or fails: canvas.toBlob → ClipboardItem → navigator.clipboard.write()
  - On clipboard success: toast.success("Copied to clipboard!")
  - Show loading state on button during operation

Both buttons: dark bg, border, rounded, flex items-center gap-2 with Lucide icons (Download, Share2)

─── TASK 2: Wire PersonalityCard into app/results/page.tsx ────────────────
  - Add: const cardRef = useRef<HTMLDivElement>(null)
  - Render <PersonalityCardDisplay result={result} cardRef={cardRef} /> with ref passed
  - Render <PersonalityCardActions cardRef={cardRef} archetypeName={result.archetype.name} />
  - Both wrapped in a centered div with label "Your Shareable Card" above

─── TASK 3: Final check ────────────────────────────────────────────────────
  - Verify Download PNG actually produces a dark card (not white background)
  - If background is white: add backgroundColor: '#0a0a0a' to html2canvas options AND
    make sure the card div has style={{backgroundColor: '#0a0a0a'}} explicitly set
  - Run pnpm build — fix all TypeScript errors

Confirm: personality-card.tsx ✓, results page wired ✓, PNG download works ✓, pnpm build passes ✓
```

---

## PROMPT 6 — Polish, Accessibility, Final QA + Submission Prep

> Wait for Prompt 5 to finish and do a full manual test of the app end-to-end. Then paste this.

```
REQUIREMENTS.md is attached. Final polish pass for the Music DNA app.

Prompts 1–5 done. Full app is functional. Now make it contest-submission ready.

─── TASK 1: Code quality sweep ────────────────────────────────────────────
Scan every new file created in this project and fix ALL of the following:
  1. Remove every console.log statement from new code
     (AuthContext logs at lib/supabase or contexts/auth-context.tsx are exempt)
  2. Remove any unused imports in all new files
  3. Remove any dead code or unreachable branches
  4. Ensure every async function that doesn't already have try/catch gets one
  5. Ensure no 'any' types remain — replace with proper types or unknown + type guard
  6. Ensure all buttons that trigger async actions have a disabled={isLoading} prop
     and show a visual loading state (spinner or text change)

─── TASK 2: Edge cases ─────────────────────────────────────────────────────
Handle these specific edge cases if not already handled:

  a) User navigates directly to /results without a token:
     → Should redirect to "/" with toast "Connect Spotify first to see your results"

  b) Spotify returns 0 tracks (brand new account with no history):
     → Show a friendly empty state: "Not enough listening data yet. Keep playing music on Spotify!"

  c) All audio features are null (edge case):
     → Gracefully handle — don't divide by zero in algorithm

  d) html2canvas runs on a card with emoji:
     → Emojis render fine but test it. If they don't render, fall back to text.

  e) User's Spotify display_name is null:
     → Fall back to user.id, truncated to 12 chars

─── TASK 3: Mobile responsiveness ─────────────────────────────────────────
Make these adjustments for screens under 640px:
  - Results page: stack the 2-column grids (charts, tracks/artists) to single column
  - Personality card: keep it 480×280 (it's for export, not display) but wrap it in
    overflow-x-auto on mobile so it doesn't break layout
  - Homepage: ensure the hero text and CTA button look good on 375px width

─── TASK 4: .env.example update ───────────────────────────────────────────
Update .env.example to include the Spotify variables as shown in Section 10 of REQUIREMENTS.md.

─── TASK 5: README.md update ──────────────────────────────────────────────
Replace the existing README content with this structure:

# Music DNA Analyzer

A Spotify-connected personality analyzer that classifies your listening habits into one of 8 archetypes using a multi-dimensional audio feature scoring algorithm.

## What I Built
[Write 3–4 sentences describing: Spotify OAuth PKCE, personality algorithm, recharts visualizations, html2canvas export card]

## Setup

### Prerequisites
- Node.js 20+, pnpm, Docker, Supabase CLI

### Steps
1. Clone and install: `pnpm install`
2. Start Supabase: `supabase start` → copy keys to `.env.local`
3. Apply migrations: `supabase db reset`
4. Create Spotify app at developer.spotify.com → add Client ID to `.env.local`
5. Run: `pnpm dev`

### Environment Variables
Copy `.env.example` to `.env.local` and fill in all values.

## Architecture
[1 paragraph on: PKCE auth flow, data fetching strategy, personality algorithm approach]

## Known Limitations
- Spotify token expires after 1 hour; no refresh flow implemented (would use refresh_token grant)
- html2canvas has inconsistent font rendering on some browsers; Satori would be better for production
- [add any other honest limitations you encountered]

## What I'd Improve With More Time
- Token refresh flow
- Server-side card generation via next/og for shareable URLs
- More archetype data points (listening time-of-day, session length patterns)
- Comparative view: short-term vs long-term personality shift

## Loom Demo
[INSERT LOOM URL HERE]

─── TASK 6: Final build verification ──────────────────────────────────────
Run these commands and fix anything that fails:
  pnpm lint
  pnpm build

There should be:
  - Zero TypeScript errors
  - Zero ESLint errors
  - No missing environment variable references that would crash the build

─── TASK 7: ai-logs/session-logs.md ───────────────────────────────────────
Create ai-logs/session-logs.md with this structure:

# AI Development Log — Music DNA Analyzer

## Session 1 — Auth + Homepage (Prompt 1)
**Files created:** lib/spotify/auth.ts, app/spotify/callback/page.tsx, app/page.tsx
**Key decisions:** [Claude fills in what was built and why]
**Issues encountered:** [any problems that needed fixing]

## Session 2 — API + Algorithm (Prompt 2)
[same structure]

## Session 3 — Hook + Migration (Prompt 3)
[same structure]

## Session 4 — Results Page + Components (Prompt 4)
[same structure]

## Session 5 — Share Card + Export (Prompt 5)
[same structure]

## Session 6 — Polish + QA (this session)
[same structure]

## Reflection
**What was easy:** [fill in]
**What was hard:** [fill in]
**What I'd change:** [fill in]

Confirm: lint passes ✓, build passes ✓, README updated ✓, ai-logs committed ✓
```

---

## After All 6 Prompts — Final Submission Checklist

```bash
# Commit everything
git add .
git commit -m "feat: complete music DNA personality analyzer"
git push origin main
```

Then verify manually:
- [ ] Visit localhost:3000 — homepage loads with "Connect Spotify" button
- [ ] Click "Connect Spotify" — Spotify auth screen appears
- [ ] Authorize — redirects to /results with full personality data
- [ ] "Download Card" — downloads a dark PNG card
- [ ] pnpm build — zero errors
- [ ] /ai-logs/ folder has session-logs.md committed
- [ ] README has Loom URL
- [ ] Repo is public on GitHub
```

---

*6 Prompts · Music DNA Analyzer · Contest Deadline May 17, 2026*