import { useMemo } from 'react'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const expiresAt = useAuthStore((state) => state.expiresAt)
  const clearTokens = useAuthStore((state) => state.clearTokens)
  
  const isAuthenticated = useMemo(() => {
    return !!(accessToken && expiresAt && Date.now() < expiresAt)
  }, [accessToken, expiresAt])
  
  return {
    isAuthenticated,
    accessToken,
    expiresAt,
    clearTokens,
  }
}
