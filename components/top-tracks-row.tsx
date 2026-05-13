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
      style={{ background: '#111', border: '1px solid #1e1e1e' }}
    >
      <h3
        className="text-xs font-bold uppercase tracking-widest mb-5"
        style={{ color: '#444' }}
      >
        Top Tracks
      </h3>

      <ol className="space-y-4">
        {tracks.slice(0, 5).map((track, i) => (
          <li key={track.id} className="flex items-center gap-3 group">
            <span
              className="text-xs font-black w-5 shrink-0 text-right tabular-nums"
              style={{ color: i === 0 ? '#1DB954' : '#333' }}
            >
              {i + 1}
            </span>

            <div
              className="w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
              style={{ background: '#1a1a1a' }}
            >
              {track.album.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-10 h-10 object-cover"
                  loading="lazy"
                />
              ) : (
                <Music size={14} style={{ color: '#333' }} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-white leading-tight">
                {track.name}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: '#555' }}>
                {truncateArtists(track.artists)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
