export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Mail, Waves } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0a0a0a' }}
    >
      {/* Top bar */}
      <div className="flex justify-center pt-10 pb-8">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#1DB954' }}
          >
            <Waves className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg text-white">
            Sound<span style={{ color: '#1DB954' }}>DNA</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div
          className="w-full max-w-sm rounded-2xl p-8 text-center"
          style={{ background: '#111', border: '1px solid #1e1e1e' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.2)' }}
          >
            <Mail className="w-7 h-7" style={{ color: '#1DB954' }} />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#666' }}>
            We&apos;ve sent a confirmation link to your inbox. Click it to verify your account and get started.
          </p>

          <Link
            href="/auth/login"
            className="block w-full py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90"
            style={{ background: '#1DB954' }}
          >
            Return to Sign In
          </Link>

          <p className="mt-4 text-xs" style={{ color: '#444' }}>
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  )
}
