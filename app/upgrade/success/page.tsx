"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { CheckCircle, Sparkles, Zap, Shield, Star, ArrowRight } from "lucide-react"
import { useEffect } from "react"

const UNLOCKED = [
  { icon: <Zap className="w-4 h-4" />,     text: 'Unlimited re-analyses' },
  { icon: <Sparkles className="w-4 h-4" />, text: 'Advanced analytics & insights' },
  { icon: <Shield className="w-4 h-4" />,   text: 'Priority support' },
  { icon: <Star className="w-4 h-4" />,     text: 'Early access to new features' },
]

export default function UpgradeSuccessPage() {
  useEffect(() => {
    // lightweight confetti using CSS animation via DOM
    const colors = ['#1DB954', '#ffffff', '#9B59B6', '#F39C12']
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        width:${Math.random() * 8 + 4}px; height:${Math.random() * 8 + 4}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        left:${Math.random() * 100}vw; top:-10px;
        opacity:${Math.random() * 0.8 + 0.2};
        animation: fall ${Math.random() * 2 + 1.5}s linear ${Math.random() * 1}s forwards;
      `
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 4000)
    }

    const style = document.createElement('style')
    style.textContent = `@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md text-center">

          {/* Icon */}
          <div className="relative inline-flex mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(29,185,84,0.12)', border: '1px solid rgba(29,185,84,0.25)' }}
            >
              <CheckCircle className="w-9 h-9" style={{ color: '#1DB954' }} />
            </div>
            <div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: '#1DB954' }}
            >
              <Sparkles className="w-4 h-4 text-black" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">
            Welcome to <span style={{ color: '#1DB954' }}>Pro!</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: '#555' }}>
            Your upgrade was successful. All features are now unlocked.
          </p>

          {/* What's unlocked */}
          <div
            className="rounded-2xl p-5 mb-6 text-left"
            style={{ background: '#111', border: '1px solid rgba(29,185,84,0.15)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1DB954' }}>
              Now unlocked
            </p>
            <div className="space-y-3">
              {UNLOCKED.map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm" style={{ color: '#aaa' }}>
                  <span style={{ color: '#1DB954' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90"
              style={{ background: '#1DB954' }}
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/profile"
              className="flex-1 inline-flex items-center justify-center py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
              style={{ border: '1px solid #2a2a2a', color: '#777' }}
            >
              View Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
