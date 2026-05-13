import type { ArchetypeInfo } from '@/lib/spotify/personality'

interface AlterEgoCardProps {
  alterEgo: ArchetypeInfo
}

export function AlterEgoCard({ alterEgo }: AlterEgoCardProps) {
  return (
    <div
      className="w-full rounded-2xl p-5 flex items-center gap-5 transition-all"
      style={{
        background: `linear-gradient(135deg, ${alterEgo.color}0a 0%, #111 60%)`,
        border: `1px solid ${alterEgo.color}25`,
      }}
    >
      {/* Color stripe */}
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ background: alterEgo.color, minHeight: 56 }}
      />

      <div className="text-4xl shrink-0 select-none">{alterEgo.emoji}</div>

      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: '#555' }}
        >
          Your Alter Ego
        </p>
        <h3 className="text-lg font-bold mb-1" style={{ color: alterEgo.color }}>
          {alterEgo.name}
        </h3>
        <p className="text-sm italic leading-relaxed" style={{ color: '#777' }}>
          &ldquo;{alterEgo.tagline}&rdquo;
        </p>
      </div>

      <div
        className="shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-xl select-none"
        style={{ background: `${alterEgo.color}15` }}
      >
        {alterEgo.emoji}
      </div>
    </div>
  )
}
