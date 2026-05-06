import type { ArchetypeInfo } from '@/lib/spotify/personality'

interface AlterEgoCardProps {
  alterEgo: ArchetypeInfo
}

export function AlterEgoCard({ alterEgo }: AlterEgoCardProps) {
  return (
    <div
      className="w-full rounded-2xl p-6 flex items-center gap-6"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <div className="text-5xl shrink-0">{alterEgo.emoji}</div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#666' }}>
          Your Alter Ego
        </p>
        <h3 className="text-xl font-bold" style={{ color: alterEgo.color }}>
          {alterEgo.name}
        </h3>
        <p className="text-sm italic mt-1 truncate" style={{ color: '#A0A0A0' }}>
          &ldquo;{alterEgo.tagline}&rdquo;
        </p>
      </div>

      <div
        className="shrink-0 w-2 h-16 rounded-full"
        style={{ background: alterEgo.color }}
      />
    </div>
  )
}
