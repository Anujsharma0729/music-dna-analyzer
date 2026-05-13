"use client"

import { Navigation } from "@/components/navigation"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LogOut, Trash2, Sparkles, User, Shield, ChevronRight, Waves } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProfileClientProps {
  user: { id: string; email: string }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#333' }}>
      {children}
    </p>
  )
}

function Row({
  icon, label, sublabel, right, danger = false, onClick, disabled,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  right?: React.ReactNode
  danger?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all disabled:opacity-50"
      style={{ background: '#111', border: '1px solid #1e1e1e' }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = danger ? 'rgba(255,65,54,0.3)' : '#2a2a2a' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: danger ? 'rgba(255,65,54,0.08)' : '#1a1a1a' }}
      >
        <span style={{ color: danger ? '#ff4136' : '#555' }}>{icon}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium" style={{ color: danger ? '#ff6b6b' : '#ddd' }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color: '#444' }}>{sublabel}</p>}
      </div>
      {right ?? <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#333' }} />}
    </button>
  )
}

export function ProfileClient({ user }: ProfileClientProps) {
  const { isPro, downgradeToFree } = useSubscription()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try { await fetch("/api/auth/signout", { method: "POST" }) } catch {}
    window.location.href = "/"
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/account/delete", { method: "POST" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setShowDeleteDialog(false)
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDowngrade = async () => {
    setIsDowngrading(true)
    try {
      await downgradeToFree()
      setShowDowngradeDialog(false)
      toast.success("You've been downgraded to the Free plan.")
    } catch {
      toast.error("Failed to downgrade. Please try again.")
    } finally {
      setIsDowngrading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-lg">

        {/* Avatar + email */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#111', border: '1px solid #1e1e1e' }}
          >
            <User className="w-6 h-6" style={{ color: '#444' }} />
          </div>
          <div>
            <p className="text-lg font-bold text-white">My Account</p>
            <p className="text-sm" style={{ color: '#555' }}>{user.email}</p>
          </div>
        </div>

        {/* Plan card */}
        <div className="mb-8">
          <SectionLabel>Subscription</SectionLabel>
          <div
            className="rounded-2xl p-5"
            style={{
              background: isPro
                ? 'linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(29,185,84,0.03) 100%)'
                : '#111',
              border: isPro ? '1px solid rgba(29,185,84,0.25)' : '1px solid #1e1e1e',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: isPro ? 'rgba(29,185,84,0.12)' : '#1a1a1a' }}
                >
                  {isPro
                    ? <Sparkles className="w-4 h-4" style={{ color: '#1DB954' }} />
                    : <Waves className="w-4 h-4" style={{ color: '#555' }} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{isPro ? 'Pro Plan' : 'Free Plan'}</p>
                  <p className="text-xs" style={{ color: isPro ? '#1DB954' : '#444' }}>
                    {isPro ? 'All features unlocked' : 'Basic access'}
                  </p>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={isPro
                  ? { background: 'rgba(29,185,84,0.12)', color: '#1DB954', border: '1px solid rgba(29,185,84,0.2)' }
                  : { background: '#1a1a1a', color: '#444', border: '1px solid #2a2a2a' }}
              >
                {isPro ? 'Active' : 'Free'}
              </span>
            </div>

            {isPro ? (
              <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid rgba(29,185,84,0.1)' }}>
                {['Unlimited analyses', 'Priority support', 'Advanced analytics'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
                    <span style={{ color: '#1DB954' }}>✓</span> {f}
                  </div>
                ))}
                <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
                  <AlertDialogTrigger asChild>
                    <button className="mt-3 text-xs transition-colors hover:opacity-80" style={{ color: '#555' }}>
                      Downgrade to free →
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent style={{ background: '#111', border: '1px solid #222' }}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Downgrade to Free?</AlertDialogTitle>
                      <AlertDialogDescription style={{ color: '#666' }}>
                        You&apos;ll lose Pro features immediately. You can upgrade again anytime.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#aaa' }}>
                        Keep Pro
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); handleDowngrade() }}
                        disabled={isDowngrading}
                        style={{ background: '#333', color: '#fff' }}
                      >
                        {isDowngrading ? 'Downgrading…' : 'Confirm'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Link
                href="/upgrade"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                style={{ background: '#1DB954' }}
              >
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <SectionLabel>Music</SectionLabel>
          <div className="space-y-2">
            <Link href="/results/demo" className="block">
              <Row
                icon={<Sparkles className="w-4 h-4" />}
                label="View Sample Analysis"
                sublabel="See a demo result for a power listener"
              />
            </Link>
          </div>
        </div>

        {/* Account actions */}
        <div>
          <SectionLabel>Account</SectionLabel>
          <div className="space-y-2">
            <Row
              icon={<Shield className="w-4 h-4" />}
              label="Privacy Policy"
              sublabel="How we handle your data"
              onClick={() => window.open('/privacy', '_blank')}
            />

            <Row
              icon={isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              label={isLoggingOut ? 'Signing out…' : 'Sign Out'}
              sublabel="You'll need to reconnect Spotify"
              onClick={handleLogout}
              disabled={isLoggingOut}
              right={<span />}
            />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <div>
                  <Row
                    icon={<Trash2 className="w-4 h-4" />}
                    label="Delete Account"
                    sublabel="Permanently remove all your data"
                    danger
                    right={<span />}
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent style={{ background: '#111', border: '1px solid #222' }}>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription style={{ color: '#666' }}>
                    This is permanent. Your profile, subscription data, and saved analyses will be gone forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#aaa' }}>
                    Keep Account
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => { e.preventDefault(); handleDeleteAccount() }}
                    disabled={isDeleting}
                    style={{ background: '#ff4136', color: '#fff' }}
                  >
                    {isDeleting ? 'Deleting…' : 'Delete Forever'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

      </div>
    </div>
  )
}
