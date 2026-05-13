'use client'

import type { ArchetypeInfo, DimensionScores } from '@/lib/spotify/personality'

interface ArchetypeHeroProps {
  archetype: ArchetypeInfo
  dimensions: DimensionScores
  listeningSummary: string
}

const DIMENSION_LABELS: Array<{ key: keyof DimensionScores; label: string }> = [
  { key: 'energy',       label: 'Energy' },
  { key: 'mood',         label: 'Mood' },
  { key: 'danceability', label: 'Dance' },
  { key: 'acousticness', label: 'Acoustic' },
  { key: 'diversity',    label: 'Diversity' },
]

export function ArchetypeHero({ archetype, dimensions, listeningSummary }: ArchetypeHeroProps) {
  return (
    <section className="relative w-full text-center pt-16 pb-14 overflow-hidden">
      {/* Color glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${archetype.color}14 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Archetype badge */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: `${archetype.color}15`,
              border: `1px solid ${archetype.color}30`,
              color: archetype.color,
            }}
          >
            Your Music Archetype
          </span>
        </div>

        {/* Emoji */}
        <div
          className="text-[96px] leading-none select-none mb-5"
          style={{ filter: `drop-shadow(0 0 48px ${archetype.color}60)` }}
        >
          {archetype.emoji}
        </div>

        {/* Name */}
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight mb-3"
          style={{ color: archetype.color }}
        >
          {archetype.name.toUpperCase()}
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl italic mb-5 max-w-lg mx-auto leading-relaxed" style={{ color: '#888' }}>
          &ldquo;{archetype.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="text-sm leading-relaxed max-w-2xl mx-auto mb-2" style={{ color: '#666' }}>
          {archetype.description}
        </p>

        {/* Listening summary */}
        <p className="text-xs leading-relaxed max-w-xl mx-auto mb-10" style={{ color: '#444' }}>
          {listeningSummary}
        </p>

        {/* Dimension bars */}
        <div
          className="flex flex-col gap-3 max-w-sm mx-auto rounded-2xl p-6"
          style={{ background: '#111', border: '1px solid #1e1e1e' }}
        >
          {DIMENSION_LABELS.map(({ key, label }) => {
            const pct = Math.round(dimensions[key] * 100)
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#555' }}>
                    {label}
                  </span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: archetype.color }}>
                    {pct}
                  </span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 5, background: '#1e1e1e' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${archetype.color}aa, ${archetype.color})`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
