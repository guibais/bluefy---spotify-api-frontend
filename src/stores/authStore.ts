import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  setTokens: (tokenData: SpotifyTokenData) => void
  clearTokens: () => void
  getValidToken: () => string | null
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

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
      version: 1,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
)
