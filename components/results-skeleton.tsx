import { Skeleton } from '@/components/ui/skeleton'

export function ResultsSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="container mx-auto px-6 py-12 max-w-5xl space-y-10">

        {/* Archetype hero */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="w-20 h-20 rounded-full" style={{ background: '#222' }} />
          <Skeleton className="w-64 h-12 rounded-lg" style={{ background: '#222' }} />
          <Skeleton className="w-80 h-5 rounded" style={{ background: '#222' }} />
          <Skeleton className="w-96 h-4 rounded" style={{ background: '#1a1a1a' }} />
          <Skeleton className="w-72 h-4 rounded" style={{ background: '#1a1a1a' }} />
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[340px] rounded-2xl" style={{ background: '#111' }} />
          <Skeleton className="h-[340px] rounded-2xl" style={{ background: '#111' }} />
        </div>

        {/* Alter ego */}
        <Skeleton className="h-28 rounded-2xl" style={{ background: '#111' }} />

        {/* Tracks + artists */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" style={{ background: '#111' }} />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" style={{ background: '#111' }} />
            ))}
          </div>
        </div>

        {/* Personality card */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="rounded-2xl" style={{ width: 480, height: 280, background: '#111' }} />
          <div className="flex gap-4">
            <Skeleton className="w-36 h-11 rounded-full" style={{ background: '#222' }} />
            <Skeleton className="w-28 h-11 rounded-full" style={{ background: '#222' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
