import { useAuthStore } from '@/stores/authStore'

const CLIENT_ID = '450f718a72f3440f86d87571eb65367b'
const REDIRECT_URI = 'https://10.32.10.199:9091/callback'
const SCOPE = 'user-read-private user-read-email user-top-read user-read-recently-played'

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export const spotifyAuth = {
  async redirectToSpotifyAuth(): Promise<void> {
    const codeVerifier = generateRandomString(64)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)

    localStorage.setItem('code_verifier', codeVerifier)

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    const params = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPE,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    }

    authUrl.search = new URLSearchParams(params).toString()
    window.location.href = authUrl.toString()
  },

  async getToken(code: string): Promise<void> {
    const codeVerifier = localStorage.getItem('code_verifier')
    
    if (!codeVerifier) {
      throw new Error('Code verifier não encontrado')
    }

    const url = 'https://accounts.spotify.com/api/token'
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    }

    const response = await fetch(url, payload)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description || 'Erro ao obter token')
    }

    useAuthStore.getState().setTokens(data)
    localStorage.removeItem('code_verifier')
  },

  getStoredToken(): string | null {
    return useAuthStore.getState().getValidToken()
  },

  clearTokens(): void {
    useAuthStore.getState().clearTokens()
    localStorage.removeItem('code_verifier')
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated()
  }
}
