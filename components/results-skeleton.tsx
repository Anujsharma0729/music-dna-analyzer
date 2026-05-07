import { Skeleton } from '@/components/ui/skeleton'

export function ResultsSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="container mx-auto px-6 pb-20 max-w-5xl">

        {/* ── Hero: emoji circle + archetype name + tagline + summary ── */}
        <div className="flex flex-col items-center gap-4 text-center py-12">
          <Skeleton
            className="rounded-full shrink-0"
            style={{ width: 80, height: 80, background: '#222222' }}
          />
          <Skeleton
            className="rounded-lg"
            style={{ width: 280, height: 48, background: '#222222' }}
          />
          <Skeleton
            className="rounded"
            style={{ width: 340, height: 22, background: '#1e1e1e' }}
          />
          <Skeleton
            className="rounded"
            style={{ width: 420, height: 16, background: '#1a1a1a' }}
          />
          <Skeleton
            className="rounded"
            style={{ width: 360, height: 16, background: '#1a1a1a' }}
          />
        </div>

        {/* ── Charts: Genre DNA + Mood Radar (300px tall each) ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Skeleton
            className="rounded-2xl"
            style={{ height: 300, background: '#111111' }}
          />
          <Skeleton
            className="rounded-2xl"
            style={{ height: 300, background: '#111111' }}
          />
        </div>

        {/* ── Alter Ego (full width) ── */}
        <div className="mb-6">
          <Skeleton
            className="rounded-2xl"
            style={{ height: 96, background: '#111111' }}
          />
        </div>

        {/* ── Top 5 Tracks + Top 5 Artists (5 row skeletons each) ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div
            className="rounded-2xl p-6"
            style={{ background: '#111111', border: '1px solid #1a1a1a' }}
          >
            <Skeleton
              className="rounded mb-4"
              style={{ width: 80, height: 12, background: '#1e1e1e' }}
            />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton
                    className="rounded"
                    style={{ width: 20, height: 14, background: '#1a1a1a', flexShrink: 0 }}
                  />
                  <Skeleton
                    className="rounded-lg"
                    style={{ width: 36, height: 36, background: '#1a1a1a', flexShrink: 0 }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="rounded" style={{ height: 14, background: '#1e1e1e' }} />
                    <Skeleton
                      className="rounded"
                      style={{ width: '60%', height: 12, background: '#1a1a1a' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: '#111111', border: '1px solid #1a1a1a' }}
          >
            <Skeleton
              className="rounded mb-4"
              style={{ width: 80, height: 12, background: '#1e1e1e' }}
            />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton
                    className="rounded"
                    style={{ width: 20, height: 14, background: '#1a1a1a', flexShrink: 0 }}
                  />
                  <Skeleton
                    className="rounded-full"
                    style={{ width: 36, height: 36, background: '#1a1a1a', flexShrink: 0 }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="rounded" style={{ height: 14, background: '#1e1e1e' }} />
                    <Skeleton
                      className="rounded"
                      style={{ width: '50%', height: 12, background: '#1a1a1a' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Personality Card 480×280 + two action buttons ── */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton
            className="rounded-2xl"
            style={{ width: 480, height: 280, background: '#111111' }}
          />
          <div className="flex gap-4">
            <Skeleton
              className="rounded-full"
              style={{ width: 148, height: 44, background: '#222222' }}
            />
            <Skeleton
              className="rounded-full"
              style={{ width: 112, height: 44, background: '#1e1e1e' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
