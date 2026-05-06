import type { ArchetypeInfo } from '@/lib/spotify/personality'

interface ArchetypeHeroProps {
  archetype: ArchetypeInfo
  listeningSummary: string
}

export function ArchetypeHero({ archetype, listeningSummary }: ArchetypeHeroProps) {
  return (
    <section className="text-center space-y-4 py-12">
      <div className="text-8xl leading-none">{archetype.emoji}</div>

      <h1
        className="text-5xl font-black tracking-tight"
        style={{ color: archetype.color }}
      >
        {archetype.name.toUpperCase()}
      </h1>

      <p className="text-2xl italic" style={{ color: '#A0A0A0' }}>
        &ldquo;{archetype.tagline}&rdquo;
      </p>

      <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#666' }}>
        {archetype.description}
      </p>

      <p className="text-sm leading-relaxed max-w-xl mx-auto pt-2" style={{ color: '#555' }}>
        {listeningSummary}
      </p>
    </section>
  )
}
