import { SESSION_KEYS, SPOTIFY_AUTH_URL, SPOTIFY_TOKEN_URL, SPOTIFY_SCOPES } from './constants'
import { AuthError, SpotifyAPIError } from './errors'

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SpotifyTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}

interface StoredToken {
  token: string
  expiresAt: number
}

// ─── PKCE Helpers ────────────────────────────────────────────────────────────

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const byte of bytes) str += String.fromCharCode(byte)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function generateRandomString(length: number): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return base64urlEncode(array.buffer).slice(0, length)
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

// ─── Token Storage ────────────────────────────────────────────────────────────

export function saveToken(tokenResponse: SpotifyTokenResponse): void {
  sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, tokenResponse.access_token)
  sessionStorage.setItem(
    SESSION_KEYS.EXPIRES_AT,
    String(Date.now() + tokenResponse.expires_in * 1000),
  )
}

export function getStoredToken(): StoredToken | null {
  const token = sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN)
  const expiresAt = sessionStorage.getItem(SESSION_KEYS.EXPIRES_AT)
  if (!token || !expiresAt) return null
  return { token, expiresAt: Number(expiresAt) }
}

export function isTokenValid(): boolean {
  const stored = getStoredToken()
  if (!stored) return false
  return stored.expiresAt > Date.now() + 60_000
}

export function clearToken(): void {
  Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key))
}

// ─── OAuth Flow ───────────────────────────────────────────────────────────────

export async function startSpotifyOAuth(): Promise<void> {
  const codeVerifier = generateRandomString(128)
  const state = generateRandomString(32)
  const codeChallenge = base64urlEncode(await sha256(codeVerifier))

  sessionStorage.setItem(SESSION_KEYS.CODE_VERIFIER, codeVerifier)
  sessionStorage.setItem(SESSION_KEYS.STATE, state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state,
    scope: SPOTIFY_SCOPES,
  })

  window.location.href = `${SPOTIFY_AUTH_URL}?${params}`
}

export async function exchangeCodeForToken(
  code: string,
  returnedState: string,
): Promise<void> {
  const storedState = sessionStorage.getItem(SESSION_KEYS.STATE)
  const codeVerifier = sessionStorage.getItem(SESSION_KEYS.CODE_VERIFIER)

  if (!storedState || returnedState !== storedState) {
    throw new AuthError('OAuth state mismatch — possible CSRF attack')
  }
  if (!codeVerifier) {
    throw new AuthError('Missing code verifier in session storage')
  }

  sessionStorage.removeItem(SESSION_KEYS.STATE)
  sessionStorage.removeItem(SESSION_KEYS.CODE_VERIFIER)

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  })

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new SpotifyAPIError(`Token exchange failed: ${text}`, response.status)
  }

  saveToken((await response.json()) as SpotifyTokenResponse)
}

export function getSpotifyToken(): string | null {
  if (typeof window === 'undefined') return null
  if (!isTokenValid()) {
    clearToken()
    return null
  }
  return getStoredToken()?.token ?? null
}
