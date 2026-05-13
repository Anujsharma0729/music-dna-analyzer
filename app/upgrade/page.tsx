"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CheckCircle, Sparkles, Zap, Shield, Waves, ArrowRight, Loader2 } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

const FREE_FEATURES = [
  'Full personality analysis',
  'All 8 archetypes',
  'Genre DNA chart',
  'Mood radar',
  'Shareable card download',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited re-analyses',
  'Advanced analytics & insights',
  'Historical archetype tracking',
  'Priority support',
  'Early access to new features',
]

export default function UpgradePage() {
  const { isPro, upgradeToPro, downgradeToFree, isLoading: subLoading } = useSubscription()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    if (!user) { router.push("/auth/signup?returnUrl=/upgrade"); return }
    setIsProcessing(true)
    try {
      await upgradeToPro()
      toast.success("Welcome to Pro!")
      router.push("/upgrade/success")
    } catch {
      toast.error("Failed to upgrade. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDowngrade = async () => {
    setIsProcessing(true)
    try {
      await downgradeToFree()
      toast.success("Downgraded to Free plan.")
    } catch {
      toast.error("Failed to downgrade. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPro && !subLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
        <Navigation />
        <div className="flex items-center justify-center px-4 py-20 min-h-[calc(100vh-64px)]">
          <div className="max-w-md w-full text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(29,185,84,0.12)', border: '1px solid rgba(29,185,84,0.2)' }}
            >
              <Sparkles className="w-9 h-9" style={{ color: '#1DB954' }} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              You&apos;re on <span style={{ color: '#1DB954' }}>Pro</span>
            </h1>
            <p className="text-sm mb-8" style={{ color: '#555' }}>
              All features are unlocked. Enjoy your full Music DNA experience.
            </p>

            <div className="rounded-2xl p-5 mb-6 text-left space-y-2"
              style={{ background: '#111', border: '1px solid rgba(29,185,84,0.15)' }}>
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#aaa' }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#1DB954' }} />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/profile"
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-black text-center transition-all hover:opacity-90"
                style={{ background: '#1DB954' }}>
                Manage Account
              </Link>
              <button onClick={handleDowngrade} disabled={isProcessing}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5 disabled:opacity-50"
                style={{ border: '1px solid #2a2a2a', color: '#555' }}>
                {isProcessing ? 'Processing…' : 'Downgrade to Free'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', color: '#1DB954' }}
          >
            Simple pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Go deeper with <span style={{ color: '#1DB954' }}>Pro</span>
          </h1>
          <p className="text-base max-w-sm mx-auto" style={{ color: '#555' }}>
            Start free, upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {/* Free */}
          <div className="rounded-2xl p-7" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#1a1a1a' }}>
                <Waves className="w-4 h-4" style={{ color: '#555' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Free</p>
                <p className="text-xs" style={{ color: '#444' }}>Forever free</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-sm ml-1" style={{ color: '#444' }}>/month</span>
            </div>

            <div className="space-y-2.5 mb-7">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#666' }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#333' }} />
                  {f}
                </div>
              ))}
            </div>

            <div className="w-full py-3 rounded-xl text-sm font-semibold text-center"
              style={{ background: '#1a1a1a', color: '#444', border: '1px solid #222' }}>
              Current Plan
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(29,185,84,0.07) 0%, #111 50%)',
              border: '1px solid rgba(29,185,84,0.3)',
              boxShadow: '0 0 60px rgba(29,185,84,0.06)',
            }}>
            {/* Recommended badge */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: '#1DB954', color: '#000' }}>
              Recommended
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(29,185,84,0.12)' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#1DB954' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Pro</p>
                <p className="text-xs" style={{ color: '#1DB954' }}>Everything unlocked</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">$9.99</span>
              <span className="text-sm ml-1" style={{ color: '#555' }}>/month</span>
            </div>

            <div className="space-y-2.5 mb-7">
              {PRO_FEATURES.map((f, i) => (
                <div key={f} className="flex items-center gap-2.5 text-sm"
                  style={{ color: i === 0 ? '#888' : '#aaa' }}>
                  {i === 0
                    ? <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#555' }} />
                    : i <= 2
                      ? <Zap className="w-4 h-4 shrink-0" style={{ color: '#1DB954' }} />
                      : <Shield className="w-4 h-4 shrink-0" style={{ color: '#1DB954' }} />}
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isProcessing || authLoading || subLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#1DB954' }}
            >
              {isProcessing
                ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
                : <>{user ? 'Upgrade to Pro' : 'Get Started'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: '#333' }}>
          This is a demo — no real payment is processed.
        </p>
      </div>
    </div>
  )
}
