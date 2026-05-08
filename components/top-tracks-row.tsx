import type { SpotifyTrack } from '@/lib/spotify/types'
import { Music } from 'lucide-react'

interface TopTracksRowProps {
  tracks: SpotifyTrack[]
}

function truncateArtists(artists: Array<{ name: string }>): string {
  const joined = artists.map((a) => a.name).join(', ')
  return joined.length > 40 ? `${joined.slice(0, 40)}…` : joined
}

export function TopTracksRow({ tracks }: TopTracksRowProps) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#666' }}>
        Top Tracks
      </h3>

      <ol className="space-y-3">
        {tracks.map((track, i) => (
          <li key={track.id} className="flex items-center gap-3">
            <span
              className="text-xs font-bold w-5 shrink-0 text-right"
              style={{ color: '#444' }}
            >
              {i + 1}
            </span>

            <div
              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
              style={{ background: '#1a1a1a' }}
            >
              {track.album.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-9 h-9 rounded-lg object-cover"
                  loading="lazy"
                />
              ) : (
                <Music size={16} style={{ color: '#444' }} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-white">{track.name}</p>
              <p className="text-xs truncate" style={{ color: '#666' }}>
                {truncateArtists(track.artists)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
