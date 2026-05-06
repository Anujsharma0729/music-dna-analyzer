# Music DNA Analyzer

A Spotify Wrapped-style music personality analyzer. Connect your Spotify account and discover your listening archetype, mood spectrum, genre fingerprint — then download a shareable card.

**Built for the 8x Engineer contest · Deadline: May 17, 2026**

---

## What Was Built

On top of the Next.js 16 + Supabase starter template, the following was added end-to-end:

- **Spotify OAuth (PKCE)** — no client secret; full state verification to prevent CSRF
- **Parallel data fetching** — top tracks across 3 time ranges, artists, audio features, all via `Promise.all`
- **Personality algorithm** — 7 audio dimensions scored against 8 archetype weight vectors, normalized to 0–100
- **Results page** — archetype hero, alter ego, genre donut chart, mood radar, top tracks, top artists
- **Shareable card** — 480×280px PNG export via `html2canvas` at 2× retina scale; Web Share API with clipboard fallback
- **Supabase persistence** — results saved to `spotify_profiles` table with Row Level Security for authenticated users

### The 8 Archetypes

| | Archetype | Personality |
|---|---|---|
| ⚡ | Energy Addict | High energy, danceable, loud |
| 🌙 | Midnight Drifter | Slow, acoustic, melancholic |
| 🎭 | Mood Chameleon | High variance, eclectic, unpredictable |
| 🚀 | Tastemaker | Underground, diverse, obscure |
| 💔 | Emotional Archaeologist | Sad, acoustic, introspective |
| 🔥 | Hype Beast | Mainstream, energetic, danceable |
| 🧘 | Zen Curator | Quiet, acoustic, intentional |
| 🌍 | Culture Vulture | Globally diverse, genre-spanning |

---

## Setup

### Prerequisites

- Node.js v20+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Spotify account (free or premium)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start local Supabase

```bash
supabase start
```

Note the output — you'll need the API URL, publishable key, and secret key.
Migrations (including `spotify_profiles` with RLS) are applied automatically.

### 3. Create a Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create App → fill in any name/description
3. Add Redirect URI: `http://localhost:3000/spotify/callback`
4. Copy the **Client ID** — the Client Secret is not needed (PKCE flow)

### 4. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54521"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<from supabase start>"
SUPABASE_SERVICE_ROLE_KEY="<from supabase start>"

NEXT_PUBLIC_SPOTIFY_CLIENT_ID="<your client id>"
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI="http://localhost:3000/spotify/callback"
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), click **Connect Spotify**, and authorize.

---

## Project Structure

```
app/
  page.tsx                        # Homepage — hero + CTA + archetype previews
  spotify/callback/page.tsx       # OAuth callback handler (PKCE token exchange)
  results/page.tsx                # Full results page
components/
  archetype-hero.tsx              # Primary archetype display
  alter-ego-card.tsx              # Secondary archetype
  genre-chart.tsx                 # Recharts donut (Genre DNA)
  mood-radar.tsx                  # Recharts radar (Mood spectrum)
  top-tracks-row.tsx              # Top 5 tracks
  top-artists-row.tsx             # Top 5 artists
  personality-card.tsx            # 480×280px shareable card + export buttons
  results-skeleton.tsx            # Full-page loading skeleton
lib/spotify/
  constants.ts                    # URLs, scopes, session storage keys
  errors.ts                       # AuthError, SpotifyAPIError, TokenExpiredError
  auth.ts                         # PKCE helpers, token storage
  api.ts                          # Spotify REST functions + types
  personality.ts                  # Algorithm, archetype data, weight matrix
hooks/
  use-spotify-data.ts             # Data fetching + personality analysis hook
supabase/migrations/
  20260506_create_spotify_profiles.sql   # New table with RLS
```

---

## Useful Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production (zero errors expected)
pnpm lint         # Run ESLint
supabase start    # Start local Supabase + apply migrations
supabase stop     # Stop local Supabase
supabase studio   # Open local admin UI at http://localhost:54323
```

---

## Known Limitations

- **Spotify free accounts**: Audio features API works but some podcast episodes return null (filtered out automatically)
- **Token lifetime**: Spotify access tokens expire after 1 hour; the app detects expiry and redirects back to auth
- **No token refresh**: PKCE flow without a backend can't refresh tokens silently — user must re-authorize after expiry
- **html2canvas fonts**: The export card uses system fonts only; custom Google Fonts may not render in the PNG

## What I'd Improve Next

- **Silent token refresh** via a lightweight backend proxy to hold the client secret
- **Historical tracking** — chart how your archetype shifts month over month
- **Social sharing** — generate an OG image server-side so the share preview renders the card
- **More archetypes** — expand the weight matrix with more nuanced profiles (e.g. Nostalgia Junkie, Genre Purist)
- **Playlist generation** — use the archetype to auto-generate a Spotify playlist via the API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + inline styles for html2canvas |
| Components | Shadcn/ui + Recharts |
| Auth | Supabase Auth + Spotify OAuth 2.0 PKCE |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Export | html2canvas at 2× scale |

---

*Loom walkthrough: [add link before submission]*
