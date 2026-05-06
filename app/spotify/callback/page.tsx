'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { exchangeCodeForToken } from '@/lib/spotify/auth'
import { AuthError } from '@/lib/spotify/errors'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    async function handleCallback() {
      if (error) {
        toast.error(`Spotify denied access: ${error}`)
        router.push('/')
        return
      }

      if (!code || !state) {
        toast.error('Invalid response from Spotify. Please try again.')
        router.push('/')
        return
      }

      try {
        await exchangeCodeForToken(code, state)
        router.push('/results')
      } catch (err) {
        if (err instanceof AuthError) {
          toast.error(err.message)
        } else {
          toast.error('Connection failed. Please try again.')
        }
        router.push('/')
      }
    }

    void handleCallback()
  }, [searchParams, router])

  return <LoadingScreen />
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0a0a0a' }}
    >
      <Loader2 size={48} className="text-[#1DB954] animate-spin" />
      <p className="text-xl text-white mt-4">Connecting to Spotify…</p>
      <p className="mt-2" style={{ color: '#666' }}>
        Hang tight, this only takes a second
      </p>
    </div>
  )
}

export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CallbackHandler />
    </Suspense>
  )
}
