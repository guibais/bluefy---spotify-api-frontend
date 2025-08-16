import { useQuery } from '@tanstack/react-query'
import { spotifyService } from '@/services/spotify'
import { useAuth } from '@/hooks/useAuth'
import type { SearchFilters } from '@/types'

export const useSearchArtists = (filters: SearchFilters) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['searchArtists', filters],
    queryFn: () => spotifyService.searchArtists(filters),
    enabled: !!filters.query && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtist = (artistId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => spotifyService.getArtist(artistId),
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtistTopTracks = (artistId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['artistTopTracks', artistId],
    queryFn: () => spotifyService.getArtistTopTracks(artistId),
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtistAlbums = (artistId: string, page: number = 0, limit: number = 20) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['artistAlbums', artistId, page, limit],
    queryFn: () => spotifyService.getArtistAlbums(artistId, page * limit, limit),
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}

export const useAlbum = (albumId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: () => spotifyService.getAlbum(albumId),
    enabled: !!albumId && isAuthenticated,
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}

export const useAlbumTracks = (albumId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery({
    queryKey: ['albumTracks', albumId],
    queryFn: () => spotifyService.getAlbumTracks(albumId),
    enabled: !!albumId && isAuthenticated,
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearTokens()
        return false
      }
      return failureCount < 3
    },
  })
}
