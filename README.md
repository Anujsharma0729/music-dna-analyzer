# SoundDNA — Music Personality Analyzer

A Spotify Wrapped-style music personality analyzer. Connect your Spotify account and discover your listening archetype, mood spectrum, and genre fingerprint — then download a shareable card.

**Built for the 8x Engineer contest · Deadline: May 17, 2026**

---

## What Was Built

On top of the Next.js 16 + Supabase starter, the following was built end-to-end:

- **Spotify OAuth (PKCE)** — no client secret needed; full state + CSRF verification
- **Parallel data fetching** — top tracks across 3 time ranges + artists via `Promise.all`
- **Personality algorithm** — 7 audio dimensions scored against 8 archetype weight vectors, normalized to 0–100. Falls back to genre-signal inference when Spotify's deprecated audio features endpoint returns no data
- **Results page** — archetype hero, alter ego, genre donut chart, mood radar, top tracks, top artists
- **Shareable card** — 480×280px PNG export via `html2canvas` at 2× scale; Web Share API with clipboard fallback
- **Supabase persistence** — results saved to `spotify_profiles` table with Row Level Security for authenticated users
- **Auth** — email + password login, Email OTP (passwordless) login, signup with email confirmation

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

## How to Run

### Prerequisites

- Node.js v20+
- npm (or pnpm)
- [Docker](https://www.docker.com/) — required for local Supabase
- [Supabase CLI](https://supabase.com/docs/guides/cli) — `npm install -g supabase`
- A Spotify account (free or premium)

---

### Step 1 — Install dependencies

```bash
npm install
```

---

### Step 2 — Start local Supabase

```bash
supabase start
```

This starts Postgres, Auth, and the API locally. Note the output — you need:
- **API URL** (e.g. `http://127.0.0.1:54521`)
- **anon/publishable key**
- **service_role key**

Migrations in `supabase/migrations/` are applied automatically (includes the `spotify_profiles` table with RLS).

---

### Step 3 — Create a Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App** → fill in any name/description
3. Under **Redirect URIs**, add: `http://127.0.0.1:3000/spotify/callback`
4. Save and copy the **Client ID** — the Client Secret is not needed (PKCE flow)

---

### Step 4 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# From `supabase start` output
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54521"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# From Spotify Dashboard
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="your-client-id"
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/spotify/callback"
```

---

### Step 5 — Run the dev server

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000), click **Connect Spotify**, and authorize.

---

## Useful Commands

```bash
npm run dev       # Start development server (http://127.0.0.1:3000)
npm run build     # Production build
npm run lint      # Run ESLint

supabase start    # Start local Supabase
supabase stop     # Stop local Supabase
supabase studio   # Open Supabase admin UI (http://localhost:54323)
```

---

## Project Structure

```
app/
  page.tsx                        # Homepage — hero, how-it-works, archetype previews
  auth/login/page.tsx             # Sign in — password + OTP tabs
  auth/signup/page.tsx            # Create account
  auth/check-email/page.tsx       # Post-signup email confirmation screen
  spotify/callback/page.tsx       # OAuth callback (PKCE token exchange)
  results/page.tsx                # Full results page
  profile/page.tsx                # Account management
  upgrade/page.tsx                # Pricing / Pro upgrade

components/
  navigation.tsx                  # Sticky nav with SoundDNA logo
  footer.tsx                      # Footer with legal links
  archetype-hero.tsx              # Primary archetype display + dimension bars
  alter-ego-card.tsx              # Secondary archetype card
  genre-chart.tsx                 # Recharts donut — Genre DNA
  mood-radar.tsx                  # Recharts radar — Mood spectrum
  top-tracks-row.tsx              # Top 5 tracks list
  top-artists-row.tsx             # Top 5 artists list
  personality-card.tsx            # 480×280px shareable card + download/share buttons
  results-skeleton.tsx            # Full-page loading skeleton
  empty-state.tsx                 # No listening data state
  error-state.tsx                 # Fetch error state

lib/spotify/
  constants.ts                    # Spotify URLs, scopes, session storage keys
  errors.ts                       # AuthError, SpotifyAPIError, TokenExpiredError
  auth.ts                         # PKCE helpers, token storage, OAuth flow
  api.ts                          # Spotify REST functions (with audio features fallback)
  personality.ts                  # Algorithm: 7 dimensions × 8 archetypes + genre inference
  types.ts                        # TypeScript interfaces

hooks/
  use-spotify-data.ts             # Fetch → analyze → persist hook

contexts/
  auth-context.tsx                # Supabase auth state + signOut
  subscription-context.tsx        # Free/Pro subscription state

supabase/migrations/
  20260506_create_spotify_profiles.sql   # spotify_profiles table + RLS policies

ai-logs/
  session-logs.md                 # AI-assisted development log (all sessions)
```

---

## Known Limitations

- **Spotify audio features deprecated** — Spotify removed the `/audio-features` endpoint for apps created after Nov 27, 2024. The app detects this and falls back to genre-signal-based inference for energy/mood/danceability/acousticness dimensions
- **Token expiry** — Spotify access tokens last 1 hour; the app detects expiry and redirects back to authorize. No silent refresh (would require a backend with the client secret)
- **html2canvas fonts** — The export card uses system fonts only; custom web fonts may not render in the PNG export

---

## What I'd Improve Next

- **Silent token refresh** — lightweight backend API route to hold the client secret and rotate tokens silently
- **Historical tracking** — chart how your archetype shifts month over month with a sparkline
- **Server-side card via Satori** — generate the shareable card as a stable OG image URL so it embeds natively in Twitter/X, iMessage, Slack
- **Recently-played time analysis** — `played_at` timestamps already available; bin by hour of day to add a "morning listener vs. night owl" behavioral dimension
- **Playlist generation** — auto-create a Spotify playlist seeded from your top archetype's audio signature

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + inline styles |
| Components | Shadcn/ui + Recharts |
| Auth | Supabase Auth (password + OTP) + Spotify OAuth 2.0 PKCE |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Export | html2canvas at 2× scale |

---

*Loom walkthrough: [add link before submission]*
