"use client"

import Link from "next/link"
import { Waves } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-auto"
      style={{ borderTop: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.98)' }}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: '#1DB954' }}
            >
              <Waves className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold text-white/80">
              Sound<span style={{ color: '#1DB954' }}>DNA</span>
            </span>
            <span className="text-sm text-white/30 ml-2">
              © {currentYear} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
