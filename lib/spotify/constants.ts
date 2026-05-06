export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_SCOPES = 'user-top-read user-read-recently-played user-read-private'

export const SESSION_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  EXPIRES_AT: 'spotify_token_expiry',
  CODE_VERIFIER: 'spotify_code_verifier',
  STATE: 'spotify_oauth_state',
} as const
