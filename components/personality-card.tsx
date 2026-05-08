'use client'

import { useState } from 'react'
import type { RefObject } from 'react'
import { Download, Share2, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { PersonalityResult } from '@/lib/spotify/personality'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PersonalityCardDisplayProps {
  result: PersonalityResult
  cardRef: RefObject<HTMLDivElement | null>
}

interface PersonalityCardActionsProps {
  cardRef: RefObject<HTMLDivElement | null>
  archetypeName: string
  archetypeEmoji: string
  archetypeTagline: string
}

interface PersonalityCardProps {
  result: PersonalityResult
  cardRef: RefObject<HTMLDivElement | null>
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatMonthYear(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// ─── PersonalityCardDisplay (html2canvas target — ALL inline styles) ─────────

function PersonalityCardDisplay({ result, cardRef }: PersonalityCardDisplayProps) {
  const { archetype, alterEgo, topGenres, spotifyUser } = result

  return (
    <div
      ref={cardRef}
      style={{
        width: 480,
        height: 280,
        backgroundColor: '#0a0a0a',
        border: '1px solid #1DB954',
        borderRadius: 16,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: 13,
            color: '#1DB954',
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}
        >
          ◉ Music DNA
        </span>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1DB954',
          }}
        />
      </div>

      {/* Archetype name + tagline */}
      <div>
        <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 6 }}>
          {archetype.emoji}
          {'  '}
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {archetype.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: '#A0A0A0',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          &ldquo;{archetype.tagline}&rdquo;
        </p>
      </div>

      {/* Genre pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {topGenres.slice(0, 3).map((genre) => (
          <span
            key={genre}
            style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: 'rgba(29,185,84,0.15)',
              color: '#1DB954',
              border: '1px solid rgba(29,185,84,0.3)',
              textTransform: 'capitalize',
            }}
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#555555' }}>
          Alter Ego:{' '}
          <span style={{ color: '#A0A0A0' }}>
            {alterEgo.emoji} {alterEgo.name}
          </span>
        </span>
        <span style={{ fontSize: 11, color: '#444444' }}>
          @{spotifyUser.id} · {formatMonthYear()}
        </span>
      </div>
    </div>
  )
}

// ─── PersonalityCardActions ───────────────────────────────────────────────────

function PersonalityCardActions({
  cardRef,
  archetypeName,
  archetypeEmoji,
  archetypeTagline,
}: PersonalityCardActionsProps) {
  const [downloading, setDownloading] = useState(false)
  const [shared, setShared] = useState(false)

  async function handleDownload() {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = 'my-music-dna.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleShare() {
    const text = `My music personality is ${archetypeEmoji} ${archetypeName} — "${archetypeTagline}" | Music DNA`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Music DNA', text })
      } catch {
        // User cancelled share — no toast needed
      }
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setShared(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setShared(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard.')
    }
  }

  return (
    <>
      <button
        onClick={() => {
          void handleDownload()
        }}
        disabled={downloading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-50"
        style={{ background: '#1DB954', color: '#000000' }}
      >
        <Download size={16} />
        {downloading ? 'Exporting…' : 'Download Card'}
      </button>

      <button
        onClick={() => {
          void handleShare()
        }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
        style={{
          background: 'transparent',
          border: '1px solid #333333',
          color: '#ffffff',
        }}
      >
        {shared ? <Check size={16} style={{ color: '#1DB954' }} /> : <Share2 size={16} />}
        {shared ? 'Copied!' : 'Share'}
      </button>
    </>
  )
}

// ─── PersonalityCard (composed export) ───────────────────────────────────────

export function PersonalityCard({ result, cardRef }: PersonalityCardProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <PersonalityCardDisplay result={result} cardRef={cardRef} />
      <div className="flex gap-4">
        <PersonalityCardActions
          cardRef={cardRef}
          archetypeName={result.archetype.name}
          archetypeEmoji={result.archetype.emoji}
          archetypeTagline={result.archetype.tagline}
        />
      </div>
    </div>
  )
}
