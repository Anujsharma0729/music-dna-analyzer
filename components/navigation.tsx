"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, Waves } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/contexts/subscription-context"
import { useState } from "react"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: '#1DB954' }}
      >
        <Waves className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-lg tracking-tight text-white">
        Sound<span style={{ color: '#1DB954' }}>DNA</span>
      </span>
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const { isPro } = useSubscription()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation */}
      <nav
        className="md:hidden sticky top-0 z-50 w-full backdrop-blur"
        style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.95)' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="px-6 py-4 space-y-3"
            style={{ borderTop: '1px solid #1a1a1a' }}
          >
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 py-2 text-white/70 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    {!isPro && (
                      <Link
                        href="/upgrade"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center py-2.5 rounded-lg font-semibold text-sm"
                        style={{ background: '#1DB954', color: '#000' }}
                      >
                        Upgrade to Pro
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/upgrade"
                      className="block py-2 text-white/70 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-2.5 rounded-lg font-semibold text-sm"
                      style={{ background: '#1DB954', color: '#000' }}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav
        className="hidden md:block sticky top-0 z-50 backdrop-blur"
        style={{ borderBottom: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.95)' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="flex items-center gap-6">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Link
                        href="/profile"
                        className={`transition-colors ${
                          pathname === '/profile'
                            ? 'text-[#1DB954]'
                            : 'text-white/60 hover:text-white'
                        }`}
                        title="Profile"
                      >
                        <User className="w-5 h-5" />
                      </Link>
                      {!isPro && (
                        <Link
                          href="/upgrade"
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                          style={{ background: '#1DB954', color: '#000' }}
                        >
                          Upgrade to Pro
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        href="/upgrade"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/auth/login"
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: '#1DB954', color: '#000' }}
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
