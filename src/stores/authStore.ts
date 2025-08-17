import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

type SpotifyTokenData = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  codeVerifier: string | null
  setTokens: (tokenData: SpotifyTokenData) => void
  clearTokens: () => void
  getValidToken: () => string | null
  isAuthenticated: () => boolean
  setCodeVerifier: (value: string | null) => void
  consumeCodeVerifier: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      codeVerifier: null,

      setTokens: (tokenData: SpotifyTokenData) => {
        const expiresAt = Date.now() + (tokenData.expires_in * 1000)
        
        set({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt,
        })
      },

      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        })
      },

      setCodeVerifier: (value: string | null) => {
        set({ codeVerifier: value })
      },

      consumeCodeVerifier: () => {
        const { codeVerifier } = get()
        set({ codeVerifier: null })
        return codeVerifier
      },

      getValidToken: () => {
        const { accessToken, expiresAt, clearTokens } = get()
        
        if (!accessToken || !expiresAt) return null
        
        if (Date.now() > expiresAt) {
          clearTokens()
          return null
        }
        
        return accessToken
      },

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get()
        return !!(accessToken && expiresAt && Date.now() < expiresAt)
      },
    }),
    {
      name: 'spotify-auth',
      version: 2,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        codeVerifier: state.codeVerifier,
      }),
      storage: createJSONStorage(() => {
        const cookieStorage: StateStorage = {
          getItem: (name) => {
            if (typeof document === 'undefined') return null
            const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
            if (!match) return null
            const value = decodeURIComponent(match.split('=')[1] || '')
            return value
          },
          setItem: (name, value) => {
            if (typeof document === 'undefined') return
            let maxAge = 60 * 60
            try {
              const parsed = JSON.parse(value as string)
              const expiresAt = parsed?.state?.expiresAt || parsed?.expiresAt
              if (typeof expiresAt === 'number') {
                const seconds = Math.max(1, Math.floor((expiresAt - Date.now()) / 1000))
                maxAge = seconds
              }
            } catch {}
            const encoded = encodeURIComponent(value as string)
            document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`
          },
          removeItem: (name) => {
            if (typeof document === 'undefined') return
            document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Strict; Secure`
          },
        }
        return cookieStorage
      }),
    }
  )
)
