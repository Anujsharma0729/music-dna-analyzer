import type { SpotifyArtist } from '@/lib/spotify/api'
import { Mic2 } from 'lucide-react'

interface TopArtistsRowProps {
  artists: SpotifyArtist[]
}

export function TopArtistsRow({ artists }: TopArtistsRowProps) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#666' }}>
        Top Artists
      </h3>

      <ol className="space-y-3">
        {artists.map((artist, i) => (
          <li key={artist.id} className="flex items-center gap-3">
            <span
              className="text-xs font-bold w-5 shrink-0 text-right"
              style={{ color: '#444' }}
            >
              {i + 1}
            </span>

            <div
              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: '#1a1a1a' }}
            >
              {artist.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-9 h-9 object-cover"
                />
              ) : (
                <Mic2 size={16} style={{ color: '#444' }} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-white">{artist.name}</p>
              {artist.genres[0] && (
                <p className="text-xs truncate capitalize" style={{ color: '#666' }}>
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
