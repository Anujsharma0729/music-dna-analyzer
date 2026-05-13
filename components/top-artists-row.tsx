import type { SpotifyArtist } from '@/lib/spotify/types'
import { Mic2 } from 'lucide-react'

interface TopArtistsRowProps {
  artists: SpotifyArtist[]
}

export function TopArtistsRow({ artists }: TopArtistsRowProps) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#111', border: '1px solid #1e1e1e' }}
    >
      <h3
        className="text-xs font-bold uppercase tracking-widest mb-5"
        style={{ color: '#444' }}
      >
        Top Artists
      </h3>

      <ol className="space-y-4">
        {artists.slice(0, 5).map((artist, i) => (
          <li key={artist.id} className="flex items-center gap-3">
            <span
              className="text-xs font-black w-5 shrink-0 text-right tabular-nums"
              style={{ color: i === 0 ? '#1DB954' : '#333' }}
            >
              {i + 1}
            </span>

            <div
              className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
              style={{ background: '#1a1a1a' }}
            >
              {artist.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-10 h-10 object-cover"
                  loading="lazy"
                />
              ) : (
                <Mic2 size={14} style={{ color: '#333' }} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-white leading-tight">
                {artist.name}
              </p>
              {artist.genres[0] && (
                <p className="text-xs truncate capitalize mt-0.5" style={{ color: '#555' }}>
                  {artist.genres[0]}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
