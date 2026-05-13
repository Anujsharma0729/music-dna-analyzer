import { Skeleton } from '@/components/ui/skeleton'
import { Navigation } from '@/components/navigation'

export function ResultsSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 pb-24 max-w-5xl">

        {/* Hero */}
        <div className="flex flex-col items-center gap-5 text-center pt-16 pb-14">
          <Skeleton className="rounded-full" style={{ width: 96, height: 96, background: '#1a1a1a' }} />
          <Skeleton className="rounded-xl" style={{ width: 300, height: 44, background: '#1a1a1a' }} />
          <Skeleton className="rounded" style={{ width: 360, height: 20, background: '#161616' }} />
          <Skeleton className="rounded" style={{ width: 420, height: 14, background: '#141414' }} />
          {/* Dimension bars card */}
          <div className="w-full max-w-sm rounded-2xl p-6 mt-2" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1.5">
                  <Skeleton className="rounded" style={{ width: 60, height: 10, background: '#1a1a1a' }} />
                  <Skeleton className="rounded" style={{ width: 24, height: 10, background: '#1a1a1a' }} />
                </div>
                <Skeleton className="rounded-full w-full" style={{ height: 5, background: '#1a1a1a' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <Skeleton className="rounded w-full mb-6" style={{ height: 1, background: '#1a1a1a' }} />

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <Skeleton className="rounded-2xl" style={{ height: 340, background: '#111' }} />
          <Skeleton className="rounded-2xl" style={{ height: 340, background: '#111' }} />
        </div>

        {/* Alter ego */}
        <Skeleton className="rounded-2xl mb-10" style={{ height: 88, background: '#111' }} />

        {/* Divider */}
        <Skeleton className="rounded w-full mb-6" style={{ height: 1, background: '#1a1a1a' }} />

        {/* Tracks + artists */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {[0, 1].map((col) => (
            <div key={col} className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
              <Skeleton className="rounded mb-5" style={{ width: 80, height: 10, background: '#1e1e1e' }} />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="rounded shrink-0" style={{ width: 20, height: 12, background: '#1a1a1a' }} />
                    <Skeleton
                      className={col === 0 ? 'rounded-lg shrink-0' : 'rounded-full shrink-0'}
                      style={{ width: 40, height: 40, background: '#1a1a1a' }}
                    />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="rounded" style={{ height: 13, background: '#1e1e1e' }} />
                      <Skeleton className="rounded" style={{ width: '55%', height: 11, background: '#1a1a1a' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <Skeleton className="rounded w-full mb-10" style={{ height: 1, background: '#1a1a1a' }} />

        {/* Card */}
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="rounded-2xl" style={{ width: 480, height: 280, background: '#111' }} />
          <div className="flex gap-4">
            <Skeleton className="rounded-xl" style={{ width: 148, height: 44, background: '#1a1a1a' }} />
            <Skeleton className="rounded-xl" style={{ width: 110, height: 44, background: '#1a1a1a' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
