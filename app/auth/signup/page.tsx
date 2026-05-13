"use client"

import type React from "react"
import { Suspense } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Waves, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      router.push(returnUrl ?? "/")
    }
  }, [user, authLoading, returnUrl, router])

  const passwordsMatch = repeatPassword.length > 0 && password === repeatPassword
  const passwordLongEnough = password.length >= 6

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error

      // If session is null, email confirmation is required
      if (!data.session) {
        router.push("/auth/check-email")
      } else {
        router.push(returnUrl ?? "/")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Card */}
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{ background: '#111', border: '1px solid #1e1e1e' }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
            <p className="text-sm" style={{ color: '#666' }}>
              Join SoundDNA and discover your music personality
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: '#ccc' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
                onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: '#ccc' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
                  onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                />
                {password.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                    style={{ color: passwordLongEnough ? '#1DB954' : '#666' }}>
                    {passwordLongEnough ? '✓' : `${password.length}/6`}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="repeat-password" className="text-sm font-medium" style={{ color: '#ccc' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="repeat-password"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#444] outline-none transition-all"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  onFocus={(e) => (e.target.style.borderColor = '#1DB954')}
                  onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                />
                {repeatPassword.length > 0 && (
                  <CheckCircle2
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: passwordsMatch ? '#1DB954' : '#555' }}
                  />
                )}
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
                style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', color: '#ff6b6b' }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#1DB954' }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm" style={{ color: '#555' }}>
              Already have an account?{" "}
              <Link
                href={
                  returnUrl
                    ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
                    : "/auth/login"
                }
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#1DB954' }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
