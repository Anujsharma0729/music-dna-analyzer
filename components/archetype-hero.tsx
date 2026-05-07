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
    <section className="w-full text-center py-16" style={{ background: '#0a0a0a' }}>
      {/* Emoji with archetype-coloured glow */}
      <div
        style={{
          filter: `drop-shadow(0 0 40px ${archetype.color}50)`,
          display: 'block',
          marginBottom: '1rem',
        }}
      >
        <span
          className="block leading-none select-none"
          style={{ fontSize: 80 }}
        >
          {archetype.emoji}
        </span>
      </div>

      <h1
        className="text-5xl font-black tracking-tight mb-3"
        style={{ color: archetype.color }}
      >
        {archetype.name.toUpperCase()}
      </h1>

      <p className="text-2xl italic mb-5" style={{ color: '#A0A0A0' }}>
        &ldquo;{archetype.tagline}&rdquo;
      </p>

      <p className="text-base leading-relaxed max-w-2xl mx-auto mb-3" style={{ color: '#666' }}>
        {archetype.description}
      </p>

      <p className="text-sm leading-relaxed max-w-xl mx-auto mb-10" style={{ color: '#555' }}>
        {listeningSummary}
      </p>

      {/* Dimension bars */}
      <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
        {DIMENSION_LABELS.map(({ key, label }) => {
          const pct = Math.round(dimensions[key] * 100)
          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className="text-xs uppercase tracking-widest shrink-0 text-right"
                style={{ color: '#555', width: 56 }}
              >
                {label}
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 4, background: '#1a1a1a' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: archetype.color, opacity: 0.85 }}
                />
              </div>
              <span
                className="text-xs font-bold shrink-0"
                style={{ color: '#A0A0A0', width: 28, textAlign: 'right' }}
              >
                {pct}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
