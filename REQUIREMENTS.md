# 🎵 Music Personality App — Complete Requirements Document
**Contest:** 8x Engineer — Spotify Wrapped Style Analyzer  
**Deadline:** May 17, 2026  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase · Spotify Web API

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [System Design & Architecture](#4-system-design--architecture)
5. [Data Models](#5-data-models)
6. [API Contracts](#6-api-contracts)
7. [Personality Algorithm Spec](#7-personality-algorithm-spec)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [File & Folder Structure](#9-file--folder-structure)
10. [Environment Variables](#10-environment-variables)
11. [Definition of Done](#11-definition-of-done)

---

## 1. Project Overview

### What We're Building
A web app that connects to a user's Spotify account via OAuth, fetches their listening history and audio features, runs a multi-dimensional personality scoring algorithm, and outputs a beautifully designed shareable card — think Spotify Wrapped meets a personality quiz.

### Core User Journey
```
Landing Page → Connect Spotify → OAuth Callback → Results Page → Download/Share PNG
```

### What the Template Already Provides (Do NOT rebuild)
- Supabase Auth (email/password signup, login, signout, protected routes)
- Subscription context (Free / Pro tier gating)
- Navigation, Footer, Toast notifications (sonner)
- Shadcn/ui component library (Button, Card, Dialog, Skeleton, etc.)
- Profile page, account deletion API route
- App Router structure, TypeScript config, Tailwind setup

---

## 2. Functional Requirements

### FR-01: Spotify OAuth Authentication
| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | App SHALL implement OAuth 2.0 PKCE flow — no client secret on frontend | MUST |
| FR-01.2 | App SHALL generate a cryptographically random `code_verifier` (128 chars) using Web Crypto API | MUST |
| FR-01.3 | App SHALL derive `code_challenge` via SHA-256 hash of verifier, base64url encoded | MUST |
| FR-01.4 | App SHALL generate a random `state` parameter and verify it on callback to prevent CSRF | MUST |
| FR-01.5 | App SHALL request scopes: `user-top-read`, `user-read-recently-played`, `user-read-private` | MUST |
| FR-01.6 | App SHALL exchange auth code for access token at `/spotify/callback` | MUST |
| FR-01.7 | App SHALL store access token and expiry timestamp in `sessionStorage` | MUST |
| FR-01.8 | App SHALL redirect to homepage with error toast if OAuth fails or state mismatches | MUST |
| FR-01.9 | App SHALL detect expired token and redirect user back to Spotify auth | SHOULD |

### FR-02: Spotify Data Fetching
| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | App SHALL fetch top tracks for `short_term`, `medium_term`, `long_term` — 50 tracks each | MUST |
| FR-02.2 | App SHALL deduplicate tracks across time ranges by Spotify track ID | MUST |
| FR-02.3 | App SHALL fetch top artists (50, medium_term) for genre extraction | MUST |
| FR-02.4 | App SHALL batch-fetch audio features for all unique track IDs (max 100 per Spotify request) | MUST |
| FR-02.5 | App SHALL filter out null audio features (Spotify returns null for some tracks/podcasts) | MUST |
| FR-02.6 | App SHALL fetch user profile (`/me`) for display name and Spotify username | MUST |
| FR-02.7 | App SHALL throw typed `AuthError` on 401 responses, `SpotifyAPIError` on all others | MUST |
| FR-02.8 | App SHALL handle rate limiting (429) with a user-visible retry message | SHOULD |

### FR-03: Personality Algorithm
| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | App SHALL compute 7 dimension scores from audio features: `energy`, `mood`, `danceability`, `acousticness`, `obscurity`, `diversity`, `moodVariance` | MUST |
| FR-03.2 | App SHALL score all 8 archetypes using a weighted dot-product matrix against dimension scores | MUST |
| FR-03.3 | App SHALL normalize all archetype scores to 0–100 range | MUST |
| FR-03.4 | App SHALL return top-scoring archetype as primary and second-scoring as "alter ego" | MUST |
| FR-03.5 | App SHALL return top 6 genres by frequency from artist genre arrays | MUST |
| FR-03.6 | App SHALL return a `listeningSummary` string (2 sentences) derived from dimension scores | MUST |
| FR-03.7 | App SHALL support all 8 archetypes: Energy Addict, Midnight Drifter, Mood Chameleon, Tastemaker, Emotional Archaeologist, Hype Beast, Zen Curator, Culture Vulture | MUST |

### FR-04: Results Page
| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | App SHALL display primary archetype with emoji, name, tagline, and 2-sentence description | MUST |
| FR-04.2 | App SHALL display alter ego archetype in a secondary card | MUST |
| FR-04.3 | App SHALL render a Genre DNA donut chart showing top 6 genres + "Other" | MUST |
| FR-04.4 | App SHALL render a Mood Radar chart with 5 axes: Energy, Mood, Danceability, Acousticness, Diversity | MUST |
| FR-04.5 | App SHALL display top 5 tracks with track name and artist | MUST |
| FR-04.6 | App SHALL display top 5 artists with artist name | MUST |
| FR-04.7 | App SHALL show a loading skeleton while data is being fetched and analyzed | MUST |
| FR-04.8 | App SHALL redirect to homepage if no Spotify token is found in sessionStorage | MUST |
| FR-04.9 | App SHALL show error state with "Try Again" button if Spotify API calls fail | MUST |

### FR-05: Shareable Personality Card
| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | App SHALL render a fixed 480×280px card component designed for PNG export | MUST |
| FR-05.2 | Card SHALL display: archetype emoji + name, tagline, top 3 genre pills, alter ego label, Spotify username, month/year | MUST |
| FR-05.3 | App SHALL export card as PNG using `html2canvas` at 2× scale (retina quality) | MUST |
| FR-05.4 | App SHALL trigger a file download named `my-music-dna.png` | MUST |
| FR-05.5 | App SHALL use Web Share API on mobile; fall back to clipboard copy on desktop | SHOULD |
| FR-05.6 | App SHALL show a "Copied to clipboard!" toast on clipboard copy | SHOULD |

### FR-06: Supabase Integration
| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | App SHALL save personality results to `spotify_profiles` table for authenticated users | SHOULD |
| FR-06.2 | App SHALL upsert results — re-analysis overwrites previous result (UNIQUE on user_id) | SHOULD |
| FR-06.3 | App SHALL show "Sign in to save your results" banner for unauthenticated users | SHOULD |
| FR-06.4 | App SHALL gate "Save Results" behind Supabase auth using existing `useAuth` hook | SHOULD |
| FR-06.5 | Row Level Security SHALL be enabled — users can only read/write their own row | MUST (if FR-06.1 built) |

### FR-07: Navigation & Homepage
| ID | Requirement | Priority |
|---|---|---|
| FR-07.1 | Homepage hero SHALL have a "Connect Spotify" CTA button that starts OAuth | MUST |
| FR-07.2 | Homepage SHALL show 3 sample archetype cards below the fold as social proof | SHOULD |
| FR-07.3 | Navigation SHALL reflect auth state (existing template behaviour — no changes needed) | MUST |

---

## 3. Non-Functional Requirements

### NFR-01: Performance
| ID | Requirement | Target |
|---|---|---|
| NFR-01.1 | Results page SHALL fully load (fetch + analyze + render) within 5 seconds on broadband | < 5s |
| NFR-01.2 | PNG card export SHALL complete within 2 seconds | < 2s |
| NFR-01.3 | Spotify data fetching SHALL use `Promise.all` for parallel requests wherever possible | Required |

### NFR-02: Security
| ID | Requirement |
|---|---|
| NFR-02.1 | Spotify Client Secret SHALL never appear in frontend code or environment variables |
| NFR-02.2 | PKCE `code_verifier` SHALL be generated fresh each session and cleared after token exchange |
| NFR-02.3 | `SUPABASE_SERVICE_ROLE_KEY` SHALL only be used in server-side API routes, never in client code |
| NFR-02.4 | All Supabase tables SHALL have Row Level Security enabled |
| NFR-02.5 | No API keys or secrets SHALL be committed to the repository |
| NFR-02.6 | OAuth `state` parameter SHALL be verified on callback before code exchange |

### NFR-03: Code Quality
| ID | Requirement |
|---|---|
| NFR-03.1 | TypeScript strict mode — zero use of `any` type |
| NFR-03.2 | All async functions SHALL have try/catch error handling |
| NFR-03.3 | No `console.log` in production code (pre-existing AuthContext logs are exempt) |
| NFR-03.4 | No dead code, commented-out blocks, or unused imports |
| NFR-03.5 | Data fetching logic lives in custom hooks, not inside components |
| NFR-03.6 | All component props SHALL have TypeScript interfaces defined |

### NFR-04: Usability
| ID | Requirement |
|---|---|
| NFR-04.1 | All async operations SHALL have a visible loading state (skeleton or spinner) |
| NFR-04.2 | All error states SHALL have a human-readable message and a recovery action |
| NFR-04.3 | Buttons SHALL be disabled during in-flight requests to prevent double-submission |
| NFR-04.4 | App SHALL be functional on desktop Chrome, Firefox, Safari (latest versions) |
| NFR-04.5 | App SHALL be visually acceptable on mobile (min 375px viewport width) |

### NFR-05: Maintainability
| ID | Requirement |
|---|---|
| NFR-05.1 | Personality algorithm weights SHALL live in a single exported config object |
| NFR-05.2 | All 8 archetype definitions (name, emoji, tagline, description, color) SHALL be in one file |
| NFR-05.3 | Spotify API base URL SHALL be a single constant |

---

## 4. System Design & Architecture

### 4.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                       │
│  Next.js 16 App Router — React 19 — TypeScript               │
│                                                              │
│  ┌──────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │    /     │  │/spotify/callback │  │     /results       │  │
│  │ Homepage │  │  (OAuth handler) │  │  (personality page)│  │
│  └──────────┘  └──────────────────┘  └────────────────────┘  │
│                                                              │
│  ┌────────────────────────┐   ┌──────────────────────────┐   │
│  │  lib/spotify/          │   │  contexts/               │   │
│  │  ├── auth.ts  (PKCE)   │   │  ├── auth-context.tsx    │   │
│  │  ├── api.ts   (REST)   │   │  └── subscription-ctx    │   │
│  │  └── personality.ts    │   └──────────────────────────┘   │
│  └────────────────────────┘                                  │
└──────────────┬───────────────────────────┬───────────────────┘
               │ HTTPS                     │ HTTPS
               ▼                           ▼
┌──────────────────────┐     ┌─────────────────────────────┐
│   Spotify Web API     │     │         Supabase             │
│  POST /api/token      │     │  Auth (existing)             │
│  GET  /me             │     │  spotify_profiles (new)      │
│  GET  /me/top/tracks  │     │  subscriptions (existing)    │
│  GET  /me/top/artists │     │  Row Level Security          │
│  GET  /audio-features │     └─────────────────────────────┘
└──────────────────────┘
```

### 4.2 OAuth PKCE Flow

```
Browser                             Spotify
   │                                   │
   │  1. generateCodeVerifier()        │
   │  2. generateCodeChallenge()       │
   │  3. generateState()               │
   │  4. store verifier+state in sessionStorage
   │                                   │
   │──── GET /authorize ──────────────►│
   │     code_challenge, state, scopes │
   │                                   │
   │◄─── 302 /spotify/callback ────────│
   │     ?code=xxx&state=yyy           │
   │                                   │
   │  5. assert state === sessionStorage.state
   │                                   │
   │──── POST /api/token ─────────────►│
   │     code + code_verifier          │
   │                                   │
   │◄─── { access_token, expires_in } ─│
   │                                   │
   │  6. store token + expiry in sessionStorage
   │  7. router.push("/results")
```

### 4.3 Results Page Data Flow

```
/results mounts
      │
      ▼
getSpotifyToken()
      ├── null or expired → redirect("/")
      │
      ▼
Promise.all([                       ← parallel (NFR-01.3)
  fetchTopTracks("short_term"),
  fetchTopTracks("medium_term"),
  fetchTopTracks("long_term"),
  fetchTopArtists(),
  fetchUserProfile()
])
      │
      ▼
deduplicateByTrackID()
      │
      ▼
fetchAudioFeatures(ids[])           ← chunked in batches of 100
      │
      ▼
filterNull(features)                ← FR-02.5
      │
      ▼
analyzePersonality()  →  PersonalityResult
      │
      ├── user authed? → upsert to spotify_profiles
      │
      ▼
render full UI
```

### 4.4 Component Tree

```
app/results/page.tsx           ← orchestration via useSpotifyData hook
├── ResultsSkeleton            ← loading state
├── ArchetypeHero              ← emoji, name, tagline, description, summary
├── AlterEgoCard               ← secondary archetype
├── [2-col grid]
│   ├── GenreChart             ← recharts PieChart (donut)
│   └── MoodRadar              ← recharts RadarChart
├── TopTracksRow               ← 5 tracks
├── TopArtistsRow              ← 5 artists
└── PersonalityCard            ← forwardRef → html2canvas target
    ├── DownloadPNGButton
    └── ShareButton
```

### 4.5 State Management

| State | Storage | Reason |
|---|---|---|
| Spotify access token + expiry | `sessionStorage` | Survives page refresh, clears on tab close |
| PKCE verifier + OAuth state | `sessionStorage` | Deleted immediately after token exchange |
| Fetched Spotify data + PersonalityResult | React `useState` | Local, transient |
| Supabase user session | `AuthContext` (existing) | Template handles this |
| Subscription tier | `SubscriptionContext` (existing) | Template handles this |

---

## 5. Data Models

### 5.1 Spotify API Types

```typescript
interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ id: string; name: string }>
  album: { name: string; images: Array<{ url: string }> }
  popularity: number        // 0–100
  duration_ms: number
}

interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  images: Array<{ url: string }>
}

interface AudioFeatures {
  id: string
  energy: number            // 0–1
  valence: number           // 0–1  (mood: 0=sad → 1=happy)
  danceability: number      // 0–1
  acousticness: number      // 0–1
  instrumentalness: number  // 0–1
  tempo: number             // BPM
  loudness: number          // dB
}

interface SpotifyUser {
  id: string
  display_name: string
  country: string
  images: Array<{ url: string }>
}
```

### 5.2 Personality Algorithm Types

```typescript
type ArchetypeId =
  | 'energy_addict'
  | 'midnight_drifter'
  | 'mood_chameleon'
  | 'tastemaker'
  | 'emotional_archaeologist'
  | 'hype_beast'
  | 'zen_curator'
  | 'culture_vulture'

interface ArchetypeInfo {
  id: ArchetypeId
  name: string         // "Energy Addict"
  emoji: string        // "⚡"
  tagline: string      // short punchy one-liner
  description: string  // 2–3 sentence personality paragraph
  color: string        // hex accent for UI
}

interface DimensionScores {
  energy: number        // 0–1
  mood: number          // 0–1
  danceability: number  // 0–1
  acousticness: number  // 0–1
  obscurity: number     // 0–1
  diversity: number     // 0–1
  moodVariance: number  // 0–1
}

interface PersonalityResult {
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
```

### 5.3 Supabase Schema

```sql
-- EXISTING — do not modify
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY, user_id UUID REFERENCES auth.users(id),
  tier TEXT CHECK (tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
);

-- NEW — file: supabase/migrations/20260506_create_spotify_profiles.sql
CREATE TABLE spotify_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype        TEXT NOT NULL,
  alter_ego        TEXT NOT NULL,
  dimensions       JSONB NOT NULL,
  top_genres       TEXT[] NOT NULL,
  archetype_scores JSONB NOT NULL,
  spotify_username TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE spotify_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own" ON spotify_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON spotify_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON spotify_profiles FOR UPDATE USING (auth.uid() = user_id);
```

---

## 6. API Contracts

### 6.1 Spotify Endpoints

| Endpoint | Method | Key Params | Purpose |
|---|---|---|---|
| `https://accounts.spotify.com/authorize` | GET redirect | `client_id`, `redirect_uri`, `code_challenge`, `state`, `scope` | Start OAuth |
| `https://accounts.spotify.com/api/token` | POST | `code`, `code_verifier`, `redirect_uri`, `grant_type=authorization_code` | Get token |
| `https://api.spotify.com/v1/me` | GET | — | User profile |
| `https://api.spotify.com/v1/me/top/tracks` | GET | `limit=50&time_range=short_term` | Top tracks |
| `https://api.spotify.com/v1/me/top/artists` | GET | `limit=50&time_range=medium_term` | Top artists |
| `https://api.spotify.com/v1/audio-features` | GET | `ids=id1,id2,...` (max 100) | Audio features |

All Spotify API requests: `Authorization: Bearer <access_token>`

### 6.2 Internal API Routes (no new routes needed)

```
POST /api/auth/signout      ← existing template route
POST /api/account/delete    ← existing template route
```

---

## 7. Personality Algorithm Spec

### 7.1 Dimension Formulas

```
energy        = mean(audioFeatures[*].energy)
mood          = mean(audioFeatures[*].valence)
danceability  = mean(audioFeatures[*].danceability)
acousticness  = mean(audioFeatures[*].acousticness)
obscurity     = 1 − (mean(tracks[*].popularity) / 100)
diversity     = uniqueGenreCount / max(totalGenreTagCount, 1)
moodVariance  = stdDev(audioFeatures[*].valence) / 0.5    ← clamped [0,1]
```

### 7.2 Archetype Weight Matrix

| Archetype | energy | mood | dance | acoustic | obscurity | diversity | moodVar |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| ⚡ Energy Addict | **0.35** | 0.10 | **0.30** | -0.20 | 0.05 | 0.00 | 0.00 |
| 🌙 Midnight Drifter | -0.20 | -0.15 | -0.10 | **0.30** | 0.15 | 0.10 | 0.10 |
| 🎭 Mood Chameleon | 0.00 | 0.00 | 0.00 | 0.10 | 0.10 | **0.30** | **0.40** |
| 🚀 Tastemaker | 0.10 | 0.10 | 0.10 | 0.10 | **0.40** | **0.20** | 0.00 |
| 💔 Emotional Archaeologist | -0.10 | **-0.30** | -0.10 | **0.25** | 0.15 | 0.00 | 0.10 |
| 🔥 Hype Beast | **0.30** | **0.25** | **0.35** | -0.20 | -0.30 | 0.00 | 0.00 |
| 🧘 Zen Curator | -0.25 | 0.10 | -0.20 | **0.35** | 0.15 | 0.05 | 0.00 |
| 🌍 Culture Vulture | 0.10 | 0.10 | 0.10 | 0.10 | **0.25** | **0.35** | 0.00 |

### 7.3 Score Normalization

```
rawScore[i]   = Σ (dimension[d] × weight[i][d])
minRaw        = min(rawScore[0..7])
shifted[i]    = rawScore[i] − minRaw
normalised[i] = (shifted[i] / max(shifted[0..7])) × 100
```

### 7.4 Archetype Reference

| ID | Name | Emoji | Tagline | Color |
|---|---|---|---|---|
| `energy_addict` | Energy Addict | ⚡ | "You don't listen to music. You survive on it." | `#FF4136` |
| `midnight_drifter` | Midnight Drifter | 🌙 | "Your best playlists only make sense at 2am." | `#4A4E8C` |
| `mood_chameleon` | Mood Chameleon | 🎭 | "Your playlist is a mood board. No one can predict you." | `#9B59B6` |
| `tastemaker` | Tastemaker | 🚀 | "You had them on rotation before they had fans." | `#1DB954` |
| `emotional_archaeologist` | Emotional Archaeologist | 💔 | "You don't skip the sad songs. You study them." | `#3498DB` |
| `hype_beast` | Hype Beast | 🔥 | "Your queue is a pre-game. Every. Single. Day." | `#FF6B35` |
| `zen_curator` | Zen Curator | 🧘 | "Your music breathes. So do you." | `#1ABC9C` |
| `culture_vulture` | Culture Vulture | 🌍 | "Your algorithm doesn't know what to make of you." | `#F39C12` |

---

## 8. UI/UX Requirements

### 8.1 Design Tokens

```
Background:       #0a0a0a
Card bg:          #111111
Border:           #222222
Accent green:     #1DB954   ← Spotify green
Text primary:     #FFFFFF
Text secondary:   #A0A0A0
Text muted:       #666666
Error:            #FF4444
```

### 8.2 Page Layout Specs

#### `/` — Homepage
- Dark hero: **"Discover Your Music DNA"** headline, subtitle, large green CTA **"Connect Spotify — It's Free"**
- Below fold: 3 static archetype preview cards (visual only)
- Keep existing Navigation + Footer

#### `/spotify/callback`
- Full-screen centered spinner + "Connecting to Spotify…" text
- Pure redirect handler, no user interaction

#### `/results`
```
┌──────────────────────────────────────────────────┐
│  [Emoji 80px]  ARCHETYPE NAME (48px bold)         │
│  "tagline in italic"                              │
│  listening summary (2 sentences, muted colour)    │
├───────────────────────┬──────────────────────────┤
│  Genre DNA Donut      │  Mood Radar               │
│  (recharts PieChart)  │  (recharts RadarChart)    │
├───────────────────────┴──────────────────────────┤
│  Alter Ego Card (full width)                      │
├───────────────────────┬──────────────────────────┤
│  Top 5 Tracks         │  Top 5 Artists            │
├───────────────────────┴──────────────────────────┤
│          [Personality Card — 480×280px]           │
│          [Download PNG]     [Share]               │
└──────────────────────────────────────────────────┘
```
- Loading: full-page skeleton matching layout above
- Error: centered card + "Try Again" button

#### Personality Card (html2canvas target)
```
┌─────────────────────────────────────────────┐
│  ◉ Music DNA                    [dot accent]│  480×280px fixed size
│                                             │  background: #0a0a0a
│     ⚡  ENERGY ADDICT  (40px bold)           │  border: 1px solid #1DB954
│     "You don't listen to music.             │  ALL styles must be inline
│      You survive on it."  (16px italic)     │  (NOT Tailwind classes)
│                                             │
│  [House]  [Techno]  [EDM]  (genre pills)    │
│  Alter Ego: 🚀 Tastemaker                   │
│  @spotify_username · May 2026               │
└─────────────────────────────────────────────┘
```

### 8.3 Chart Specs

**Genre DNA — recharts PieChart**
- Donut style: `innerRadius={60}` `outerRadius={100}`
- Colors: `['#1DB954','#17A34A','#15803D','#3B82F6','#8B5CF6','#F59E0B','#6B7280']`
- Top 6 genres + everything else → "Other"
- Custom tooltip: name + percentage
- `ResponsiveContainer width="100%" height={300}`

**Mood Radar — recharts RadarChart**
- 5 axes: Energy, Mood, Danceability, Acousticness, Diversity (scale 0–100)
- Radar: `fill="rgba(29,185,84,0.2)"` `stroke="#1DB954"` `strokeWidth={2}`
- PolarGrid: `stroke="#222222"`
- `ResponsiveContainer width="100%" height={300}`

---

## 9. File & Folder Structure

```
template-webapp-main/
│
├── app/
│   ├── page.tsx                            ← MODIFY: Spotify hero + CTA
│   ├── layout.tsx                          ← no change
│   ├── globals.css                         ← no change
│   ├── spotify/
│   │   └── callback/
│   │       └── page.tsx                    ← NEW: OAuth callback handler
│   ├── results/
│   │   └── page.tsx                        ← NEW: full results page
│   ├── api/                                ← no new routes
│   ├── auth/                               ← no change
│   ├── profile/                            ← no change
│   └── upgrade/                            ← no change
│
├── components/
│   ├── personality-card.tsx                ← NEW: export card + share buttons
│   ├── genre-chart.tsx                     ← NEW: recharts donut
│   ├── mood-radar.tsx                      ← NEW: recharts radar
│   ├── archetype-hero.tsx                  ← NEW: hero section
│   ├── alter-ego-card.tsx                  ← NEW: secondary archetype
│   ├── top-tracks-row.tsx                  ← NEW: 5 tracks
│   ├── top-artists-row.tsx                 ← NEW: 5 artists
│   ├── results-skeleton.tsx                ← NEW: loading skeleton
│   ├── navigation.tsx                      ← no change
│   ├── footer.tsx                          ← no change
│   └── ui/                                 ← no change (shadcn)
│
├── lib/
│   ├── spotify/
│   │   ├── auth.ts                         ← NEW: PKCE helpers
│   │   ├── api.ts                          ← NEW: Spotify REST + types
│   │   └── personality.ts                  ← NEW: algorithm + ARCHETYPE_DATA
│   ├── supabase/                           ← no change
│   └── utils.ts                            ← no change
│
├── hooks/
│   ├── use-spotify-data.ts                 ← NEW: fetch + state hook
│   └── use-mobile.ts                       ← no change
│
├── supabase/
│   └── migrations/
│       ├── 20251223234735_create_subscriptions_table.sql  ← existing
│       └── 20260506_create_spotify_profiles.sql           ← NEW
│
├── ai-logs/
│   └── session-logs.md                     ← REQUIRED for contest
│
├── .env.local                              ← NEVER COMMIT
├── .env.example                            ← UPDATE with Spotify vars
└── package.json                            ← ADD: recharts, html2canvas
```

---

## 10. Environment Variables

### `.env.local` — never commit
```env
# From `supabase start` output
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54521"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."

# From developer.spotify.com/dashboard
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="your_client_id_here"
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI="http://localhost:3000/spotify/callback"
```

### `.env.example` — commit this (update the existing template file)
```env
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54521"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-local-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"

# Create app at https://developer.spotify.com/dashboard
# Add Redirect URI: http://localhost:3000/spotify/callback
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="your-spotify-client-id"
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI="http://localhost:3000/spotify/callback"
```

### Spotify Dashboard Setup (one-time, ~5 min)
1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → Create App
2. Add Redirect URI: `http://localhost:3000/spotify/callback`
3. Copy **Client ID only** — Client Secret is NOT needed (PKCE flow)
4. Paste into `.env.local`

---

## 11. Definition of Done

### Functionality
- [ ] "Connect Spotify" triggers OAuth and lands on `/results` with full data
- [ ] Results page shows: archetype, alter ego, genre chart, mood radar, top tracks, top artists
- [ ] "Download Card" downloads `my-music-dna.png` at 2× resolution
- [ ] Loading skeleton visible while data fetches
- [ ] Error state + "Try Again" visible when Spotify API fails
- [ ] Navigating to `/results` without a token redirects to `/`
- [ ] `pnpm build` — zero TypeScript errors, zero ESLint errors

### Code Quality
- [ ] Zero `any` types
- [ ] Zero `console.log` in new code
- [ ] Every async function has try/catch
- [ ] No unused imports or dead code
- [ ] All component props have TypeScript interfaces

### Security
- [ ] `.env.local` not committed (`git status` clean)
- [ ] No Client Secret in codebase
- [ ] OAuth `state` verified in callback
- [ ] `spotify_profiles` has RLS enabled

### Contest Submission
- [ ] `/ai-logs/` has at least one log file
- [ ] `README.md` updated: what was built, setup steps, known limitations, what you'd improve
- [ ] 6+ screenshots: homepage, Spotify auth page, loading, results, personality card, share action
- [ ] Loom video URL in README
- [ ] Pushed to public GitHub repo

---

*REQUIREMENTS.md v1.0 — Music DNA Analyzer — May 2026*