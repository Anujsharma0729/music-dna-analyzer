import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Waves } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          {/* Big 404 */}
          <div className="relative mb-8 select-none">
            <p
              className="text-[120px] sm:text-[160px] font-black leading-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px #1e1e1e',
                letterSpacing: '-0.05em',
              }}
            >
              404
            </p>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ filter: 'drop-shadow(0 0 40px rgba(29,185,84,0.3))' }}
            >
              <span className="text-6xl">🎵</span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white mb-3">
            This track doesn&apos;t exist
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#555' }}>
            The page you&apos;re looking for has been removed, renamed, or never existed.
            Let&apos;s get you back to the music.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#1DB954' }}
            >
              <Waves className="w-4 h-4" />
              Back to SoundDNA
            </Link>
            <Link
              href="/results/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
              style={{ border: '1px solid #2a2a2a', color: '#777' }}
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
