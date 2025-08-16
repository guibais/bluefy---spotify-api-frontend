import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
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
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtistAlbums = (artistId: string, limit: number = 20, albumFilter?: string) => {
  const { isAuthenticated } = useAuth()
  
  return useInfiniteQuery({
    queryKey: ['artistAlbums', artistId, limit, albumFilter],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => 
      spotifyService.getArtistAlbums(artistId, pageParam * limit, limit, albumFilter),
    initialPageParam: 0,
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (lastPage.items.length < limit) return undefined
      return allPages.length
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
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
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMe = () => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['me'],
    queryFn: () => spotifyService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMyTopArtists = (limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['myTopArtists', limit, timeRange],
    queryFn: () => spotifyService.getMyTopArtists(limit, timeRange),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMyTopTracks = (limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['myTopTracks', limit, timeRange],
    queryFn: () => spotifyService.getMyTopTracks(limit, timeRange),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Playlists
export const useMyPlaylists = (limit: number = 20) => {
  const { isAuthenticated } = useAuth()
  return useInfiniteQuery({
    queryKey: ['myPlaylists', limit],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => spotifyService.getMyPlaylists(pageParam * limit, limit),
    initialPageParam: 0,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      if (lastPage.items.length < limit) return undefined
      return allPages.length
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// deprecated useFeaturedPlaylists removed

// New Releases
export const useNewReleases = (limit: number = 12, country: string = 'BR') => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['newReleases', limit, country],
    queryFn: () => spotifyService.getNewReleases(0, limit, country),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}
