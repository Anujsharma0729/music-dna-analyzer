'use client'

import { Navigation } from '@/components/navigation'
import { startSpotifyOAuth } from '@/lib/spotify/auth'
import { toast } from 'sonner'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SAMPLE_RESULTS = [
  {
    emoji: '⚡',
    name: 'Energy Addict',
    tagline: "You don't listen to music. You survive on it.",
    color: '#FF4136',
    alterEgo: '🔥 Hype Beast',
    genres: ['House', 'Techno', 'EDM', 'Drum & Bass'],
    user: '@alex_drops',
    dims: [
      { label: 'Energy',    pct: 87 },
      { label: 'Mood',      pct: 61 },
      { label: 'Dance',     pct: 82 },
      { label: 'Acoustic',  pct: 18 },
      { label: 'Diversity', pct: 54 },
    ],
  },
  {
    emoji: '🎭',
    name: 'Mood Chameleon',
    tagline: 'Your playlist is a mood board. No one can predict you.',
    color: '#9B59B6',
    alterEgo: '🌙 Midnight Drifter',
    genres: ['Indie', 'R&B', 'Alternative', 'Lo-fi'],
    user: '@priya_sounds',
    dims: [
      { label: 'Energy',    pct: 51 },
      { label: 'Mood',      pct: 72 },
      { label: 'Dance',     pct: 46 },
      { label: 'Acoustic',  pct: 58 },
      { label: 'Diversity', pct: 89 },
    ],
  },
  {
    emoji: '🌍',
    name: 'Culture Vulture',
    tagline: "Your algorithm doesn't know what to make of you.",
    color: '#F39C12',
    alterEgo: '🚀 Tastemaker',
    genres: ['Afrobeats', 'Jazz', 'K-Pop', 'Bossa Nova'],
    user: '@kai_global',
    dims: [
      { label: 'Energy',    pct: 59 },
      { label: 'Mood',      pct: 68 },
      { label: 'Dance',     pct: 73 },
      { label: 'Acoustic',  pct: 44 },
      { label: 'Diversity', pct: 94 },
    ],
  },
]

const ALL_ARCHETYPES = [
  { emoji: '⚡', name: 'Energy Addict',           color: '#FF4136', desc: 'High BPMs, hard drops, zero chill' },
  { emoji: '🌙', name: 'Midnight Drifter',        color: '#4A4E8C', desc: 'Textured, atmospheric, 2am playlists' },
  { emoji: '🎭', name: 'Mood Chameleon',          color: '#9B59B6', desc: 'Eclectic, unpredictable, full range' },
  { emoji: '🚀', name: 'Tastemaker',              color: '#1DB954', desc: 'Underground finds before they blow up' },
  { emoji: '💔', name: 'Emotional Archaeologist', color: '#3498DB', desc: 'Sad songs studied, not skipped' },
  { emoji: '🔥', name: 'Hype Beast',              color: '#FF6B35', desc: 'Every chart-topper, no apologies' },
  { emoji: '🧘', name: 'Zen Curator',             color: '#1ABC9C', desc: 'Intentional, peaceful, breathes' },
  { emoji: '🌍', name: 'Culture Vulture',         color: '#F39C12', desc: 'Global sounds, cross-cultural ear' },
]

const STATS = [
  { value: '8',    label: 'Archetypes' },
  { value: '50+',  label: 'Tracks analyzed' },
  { value: '3',    label: 'Time ranges' },
  { value: '100%', label: 'Free forever' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpotifyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function handleConnect() {
  if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
    toast.error('Spotify Client ID not configured')
    return
  }
  void startSpotifyOAuth()
}

function ConnectButton({ large }: { large?: boolean }) {
  return (
    <button
      onClick={handleConnect}
      className={`inline-flex items-center justify-center gap-3 rounded-full font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95 ${large ? 'w-full sm:w-auto px-10 py-5 text-lg' : 'px-7 py-3.5 text-sm'}`}
      style={{ background: '#1DB954', boxShadow: '0 0 40px rgba(29,185,84,0.3)' }}
    >
      <SpotifyIcon size={large ? 22 : 18} />
      Connect Spotify — It&apos;s Free
    </button>
  )
}

/** Mini mock result card shown in the hero */
function MockResultCard({ data, active }: { data: typeof SAMPLE_RESULTS[0]; active: boolean }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-500 select-none w-full"
      style={{
        background: '#111',
        border: `1px solid ${active ? data.color + '50' : '#1e1e1e'}`,
        boxShadow: active ? `0 20px 60px ${data.color}20` : 'none',
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
        position: active ? 'relative' : 'absolute',
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#333' }}>
          Your Result
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: `${data.color}18`, color: data.color, border: `1px solid ${data.color}30` }}
        >
          Music DNA
        </span>
      </div>

      {/* Archetype */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl leading-none">{data.emoji}</span>
        <div>
          <p className="text-lg font-black tracking-tight" style={{ color: data.color }}>
            {data.name.toUpperCase()}
          </p>
          <p className="text-xs italic leading-snug" style={{ color: '#666' }}>
            &ldquo;{data.tagline}&rdquo;
          </p>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-2 mb-4">
        {data.dims.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider w-14 shrink-0 text-right" style={{ color: '#444' }}>
              {d.label}
            </span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: '#1e1e1e' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${d.pct}%`, background: `linear-gradient(90deg, ${data.color}80, ${data.color})` }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums w-6 text-right" style={{ color: data.color }}>
              {d.pct}
            </span>
          </div>
        ))}
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {data.genres.map((g) => (
          <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: `${data.color}12`, color: data.color, border: `1px solid ${data.color}25` }}>
            {g}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1a1a1a' }}>
        <span className="text-[10px]" style={{ color: '#444' }}>
          Alter ego: <span style={{ color: '#666' }}>{data.alterEgo}</span>
        </span>
        <span className="text-[10px]" style={{ color: '#333' }}>{data.user}</span>
      </div>
    </div>
  )
}

/** Scrolling archetype ticker */
function ArchetypeTicker() {
  const items = [...ALL_ARCHETYPES, ...ALL_ARCHETYPES]
  return (
    <div className="relative overflow-hidden py-4" style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
      <div
        className="flex gap-6 whitespace-nowrap"
        style={{
          animation: 'ticker 30s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm font-semibold shrink-0">
            <span>{a.emoji}</span>
            <span style={{ color: a.color }}>{a.name}</span>
            <span className="mx-2" style={{ color: '#2a2a2a' }}>·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ background: '#0a0a0a' }} className="min-h-screen text-white overflow-x-hidden">
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* BG glows */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(29,185,84,0.15) 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

            {/* Left — copy */}
            <div className="flex flex-col items-start">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                style={{ background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)', color: '#1DB954' }}
              >
                🎵 Powered by Spotify
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.02] mb-6">
                <span className="block text-white">Your music</span>
                <span className="block text-white">has a</span>
                <span
                  className="block"
                  style={{ color: '#1DB954', textShadow: '0 0 80px rgba(29,185,84,0.5)' }}
                >
                  personality.
                </span>
              </h1>

              <p className="text-lg leading-relaxed mb-4 max-w-md" style={{ color: '#777' }}>
                50 tracks. 8 archetypes. One truth.
                Connect Spotify and find out exactly what your listening habits say about you.
              </p>

              <p className="text-sm mb-10 font-medium" style={{ color: '#444' }}>
                No Spotify Premium required &nbsp;·&nbsp; Takes 10 seconds
              </p>

              <ConnectButton large />

              <p className="mt-4 text-xs" style={{ color: '#333' }}>
                Read-only access · No data stored without your permission
              </p>
            </div>

            {/* Right — rotating mock result card */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-sm relative">
                {/* Glow backdrop */}
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
                  style={{ background: 'radial-gradient(circle, #1DB954, transparent)' }} />

                {/* Cards stacked with rotation simulation */}
                <div className="relative">
                  {/* Back cards (decorative) */}
                  <div className="absolute inset-0 rounded-2xl"
                    style={{ background: '#111', border: '1px solid #1e1e1e', transform: 'rotate(3deg) translateY(8px)', opacity: 0.4 }} />
                  <div className="absolute inset-0 rounded-2xl"
                    style={{ background: '#111', border: '1px solid #1e1e1e', transform: 'rotate(-2deg) translateY(4px)', opacity: 0.6 }} />

                  {/* Active card */}
                  <div className="relative">
                    <MockResultCard data={SAMPLE_RESULTS[0]} active />
                  </div>
                </div>

                {/* Floating label */}
                <div
                  className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#1DB954', color: '#000' }}
                >
                  Sample result
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Archetype ticker ── */}
      <ArchetypeTicker />

      {/* ── Stats ── */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black mb-1" style={{ color: '#1DB954' }}>{s.value}</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#444' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample results preview ── */}
      <section style={{ background: '#080808', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#333' }}>
              Live previews
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              See what you&apos;ll get
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#555' }}>
              Real results look like this — your archetype, dimension scores, genre breakdown, and a shareable card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {SAMPLE_RESULTS.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#111', border: '1px solid #1e1e1e' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = `${r.color}40`
                  el.style.boxShadow = `0 12px 40px ${r.color}15`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = '#1e1e1e'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#333' }}>Result preview</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}25` }}>
                    {r.emoji}
                  </span>
                </div>

                {/* Archetype */}
                <div className="mb-4">
                  <p className="text-xl font-black tracking-tight mb-1" style={{ color: r.color }}>
                    {r.name.toUpperCase()}
                  </p>
                  <p className="text-xs italic leading-relaxed" style={{ color: '#666' }}>
                    &ldquo;{r.tagline}&rdquo;
                  </p>
                </div>

                {/* Bars */}
                <div className="space-y-2 mb-4">
                  {r.dims.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider w-14 shrink-0 text-right" style={{ color: '#3a3a3a' }}>
                        {d.label}
                      </span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: '#1e1e1e' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${d.pct}%`, background: `linear-gradient(90deg, ${r.color}70, ${r.color})` }} />
                      </div>
                      <span className="text-[10px] font-bold w-5 text-right tabular-nums" style={{ color: r.color }}>
                        {d.pct}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.genres.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${r.color}10`, color: r.color, border: `1px solid ${r.color}20` }}>
                      {g}
                    </span>
                  ))}
                </div>

                {/* Shareable card preview */}
                <div className="rounded-xl p-3 mt-2"
                  style={{ background: '#0a0a0a', border: `1px solid ${r.color}30` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold" style={{ color: '#1DB954' }}>◉ Music DNA</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1DB954' }} />
                  </div>
                  <p className="text-xs font-black mb-1" style={{ color: '#fff' }}>
                    {r.emoji} {r.name.toUpperCase()}
                  </p>
                  <p className="text-[10px] italic mb-2" style={{ color: '#555' }}>
                    &ldquo;{r.tagline.slice(0, 40)}…&rdquo;
                  </p>
                  <p className="text-[10px]" style={{ color: '#444' }}>
                    Alter ego: <span style={{ color: '#666' }}>{r.alterEgo}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <ConnectButton />
          </div>
        </div>
      </section>

      {/* ── All 8 archetypes ── */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#333' }}>
            8 archetypes
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Which one are you?</h2>
          <p className="text-sm" style={{ color: '#555' }}>The algorithm doesn&apos;t guess — it calculates.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {ALL_ARCHETYPES.map((a) => (
            <div
              key={a.name}
              className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
              style={{ background: '#111', border: '1px solid #1a1a1a' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = `${a.color}35`
                el.style.background = `linear-gradient(135deg, ${a.color}08, #111)`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#1a1a1a'
                el.style.background = '#111'
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <p className="text-sm font-bold leading-tight" style={{ color: a.color }}>{a.name}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#080808', borderTop: '1px solid #1a1a1a' }}>
        <div className="container mx-auto px-6 py-20">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-14" style={{ color: '#333' }}>
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { n: '01', title: 'Connect', body: 'Link Spotify in one click via secure OAuth. No passwords, no sketchy permissions — read-only access only.' },
              { n: '02', title: 'Analyze', body: 'We scan your top 50 tracks across short, medium, and long-term — then run them through 7 audio dimensions.' },
              { n: '03', title: 'Discover', body: 'Get your full Music DNA: primary archetype, alter ego, mood radar, genre chart, and a card worth posting.' },
            ].map((s) => (
              <div key={s.n} className="flex flex-col gap-4">
                <span className="text-5xl font-black" style={{ color: 'rgba(29,185,84,0.15)' }}>{s.n}</span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="container mx-auto px-6 py-28 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#333' }}>
          Ready?
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Stop guessing.<br />
          <span style={{ color: '#1DB954' }}>Know your sound.</span>
        </h2>
        <p className="text-base mb-10 max-w-sm mx-auto" style={{ color: '#555' }}>
          Takes 10 seconds. Free forever. Your Spotify data, decoded.
        </p>
        <ConnectButton large />
      </section>
    </div>
  )
}
