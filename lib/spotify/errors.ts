export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class SpotifyAPIError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'SpotifyAPIError'
    this.status = status
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super('Spotify token has expired')
    this.name = 'TokenExpiredError'
  }
}
