"use client"

import type React from "react"
import { Suspense } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Waves, AlertCircle, Loader2, CheckCircle2, RefreshCw } from "lucide-react"

type AuthMode = "password" | "otp"
type OtpStep = "email" | "code"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1DB954' }}>
        <Waves className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-lg text-white">
        Sound<span style={{ color: '#1DB954' }}>DNA</span>
      </span>
    </Link>
  )
}

function ModeTabs({ mode, onChange }: { mode: AuthMode; onChange: (m: AuthMode) => void }) {
  return (
    <div className="flex rounded-xl p-1 mb-6" style={{ background: '#1a1a1a' }}>
      {(["password", "otp"] as AuthMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
          style={mode === m ? { background: '#2a2a2a', color: '#fff' } : { background: 'transparent', color: '#555' }}
        >
          {m === "password" ? "Password" : "Email OTP"}
        </button>
      ))}
    </div>
  )
}

function PasswordLogin({ returnUrl }: { returnUrl: string | null }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      window.location.href = returnUrl ?? "/"
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="pw-email" className="text-sm font-medium" style={{ color: '#ccc' }}>Email</label>
        <input
          id="pw-email" type="email" placeholder="you@example.com" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
          onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="pw-password" className="text-sm font-medium" style={{ color: '#ccc' }}>Password</label>
        <input
          id="pw-password" type="password" placeholder="••••••••" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
          onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
          style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', color: '#ff6b6b' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
        </div>
      )}
      <button type="submit" disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: '#1DB954' }}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Signing in…" : "Sign In"}
      </button>
      <p className="text-center text-sm" style={{ color: '#555' }}>
        Don&apos;t have an account?{" "}
        <Link href={returnUrl ? `/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/signup"}
          className="font-medium hover:opacity-80 transition-colors" style={{ color: '#1DB954' }}>
          Create one
        </Link>
      </p>
    </form>
  )
}

const RESEND_COOLDOWN = 60

function OtpLogin({ returnUrl }: { returnUrl: string | null }) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<OtpStep>("email")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN)
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const sendOtp = async (emailAddr: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddr,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      startCooldown()
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await sendOtp(email)
    if (ok) setStep("code")
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    await sendOtp(email)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: "email" })
      if (error) throw error
      window.location.href = returnUrl ?? "/"
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid or expired code. Please try again.")
      setIsLoading(false)
    }
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5">
        {/* Sent banner */}
        <div className="rounded-xl p-3.5 text-sm"
          style={{ background: 'rgba(29,185,84,0.06)', border: '1px solid rgba(29,185,84,0.2)' }}>
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#1DB954' }} />
            <p style={{ color: '#1DB954' }}>
              Code sent to <span className="font-semibold">{email}</span>
            </p>
          </div>
          <p className="text-xs pl-6" style={{ color: '#555' }}>
            📌 Running locally? Check{' '}
            <a href="http://127.0.0.1:54524" target="_blank" rel="noreferrer"
              className="underline hover:opacity-80" style={{ color: '#1DB954' }}>
              Inbucket (127.0.0.1:54524)
            </a>{' '}— local Supabase traps emails there instead of sending them to your real inbox.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="otp-code" className="text-sm font-medium" style={{ color: '#ccc' }}>
            6-digit code
          </label>
          <input
            id="otp-code" type="text" inputMode="numeric" maxLength={6}
            placeholder="123456" required autoFocus
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all tracking-[0.4em] text-center font-mono text-lg"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
            style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', color: '#ff6b6b' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
          </div>
        )}

        <button type="submit" disabled={isLoading || otp.length !== 6}
          className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: '#1DB954' }}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Verifying…" : "Verify & Sign In"}
        </button>

        {/* Resend */}
        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(null) }}
            className="hover:opacity-80 transition-opacity" style={{ color: '#555' }}>
            ← Different email
          </button>
          <button type="button" onClick={handleResend} disabled={cooldown > 0}
            className="inline-flex items-center gap-1.5 transition-opacity disabled:opacity-40"
            style={{ color: cooldown > 0 ? '#555' : '#1DB954' }}>
            <RefreshCw className="w-3.5 h-3.5" />
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="otp-email" className="text-sm font-medium" style={{ color: '#ccc' }}>Email</label>
        <input
          id="otp-email" type="email" placeholder="you@example.com" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
          onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
          style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', color: '#ff6b6b' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
        </div>
      )}
      <button type="submit" disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: '#1DB954' }}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Sending code…" : "Send OTP Code"}
      </button>
      <p className="text-center text-xs" style={{ color: '#444' }}>
        We&apos;ll email you a 6-digit code — no password needed.
      </p>
      <p className="text-center text-sm" style={{ color: '#555' }}>
        Don&apos;t have an account?{" "}
        <Link href={returnUrl ? `/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/signup"}
          className="font-medium hover:opacity-80 transition-colors" style={{ color: '#1DB954' }}>
          Create one
        </Link>
      </p>
    </form>
  )
}

function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("password")
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")

  useEffect(() => {
    if (!authLoading && user) router.push(returnUrl ?? "/")
  }, [user, authLoading, returnUrl, router])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex justify-center pt-10 pb-8"><Logo /></div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm" style={{ color: '#666' }}>Sign in to your SoundDNA account</p>
          </div>
          <ModeTabs mode={mode} onChange={setMode} />
          {mode === "password" ? <PasswordLogin returnUrl={returnUrl} /> : <OtpLogin returnUrl={returnUrl} />}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
