import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { spotifyService } from '@/services/spotify'
import { useAuth } from '@/hooks/useAuth'
import type {
  SearchFilters,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifySearchResponse,
  SpotifyTimeRange,
  SpotifyTrack,
  SpotifyUser,
} from '@/types'

export const useSearchArtists = (filters: SearchFilters) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifySearchResponse<SpotifyArtist>>({
    queryKey: ['searchArtists', filters],
    queryFn: () => spotifyService.searchArtists(filters),
    enabled: !!filters.query && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useSearchAlbumsAndArtists = (filters: SearchFilters) => {
  const { isAuthenticated } = useAuth()
  return useQuery<{ albums: SpotifySearchResponse<SpotifyAlbum>; artists: SpotifySearchResponse<SpotifyArtist>}>({
    queryKey: ['searchAlbumsAndArtists', filters],
    queryFn: () => spotifyService.searchAlbumsAndArtists(filters),
    enabled: (!!filters.query || !!filters.artistName || !!filters.albumName) && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useSearchAlbums = (filters: SearchFilters) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifySearchResponse<SpotifyAlbum>>({
    queryKey: ['searchAlbums', filters],
    queryFn: () => spotifyService.searchAlbums(filters),
    enabled: (!!filters.query || !!filters.artistName || !!filters.albumName) && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtist = (artistId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifyArtist>({
    queryKey: ['artist', artistId],
    queryFn: () => spotifyService.getArtist(artistId),
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtistTopTracks = (artistId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifyTrack[]>({
    queryKey: ['artistTopTracks', artistId],
    queryFn: () => spotifyService.getArtistTopTracks(artistId),
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useArtistAlbums = (artistId: string, limit: number = 20, albumFilter?: string) => {
  const { isAuthenticated } = useAuth()
  
  return useInfiniteQuery<SpotifySearchResponse<SpotifyAlbum>>({
    queryKey: ['artistAlbums', artistId, limit, albumFilter],
    queryFn: ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0
      return spotifyService.getArtistAlbums(artistId, page * limit, limit, albumFilter)
    },
    initialPageParam: 0,
    enabled: !!artistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useAlbum = (albumId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifyAlbum>({
    queryKey: ['album', albumId],
    queryFn: () => spotifyService.getAlbum(albumId),
    enabled: !!albumId && isAuthenticated,
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useAlbumTracks = (albumId: string) => {
  const { isAuthenticated } = useAuth()
  
  return useQuery<SpotifySearchResponse<SpotifyTrack>>({
    queryKey: ['albumTracks', albumId],
    queryFn: () => spotifyService.getAlbumTracks(albumId),
    enabled: !!albumId && isAuthenticated,
    staleTime: 15 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMe = () => {
  const { isAuthenticated } = useAuth()
  return useQuery<SpotifyUser>({
    queryKey: ['me'],
    queryFn: () => spotifyService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMyTopArtists = (limit: number = 20, timeRange: SpotifyTimeRange = 'medium_term') => {
  const { isAuthenticated } = useAuth()
  return useQuery<SpotifySearchResponse<SpotifyArtist>>({
    queryKey: ['myTopArtists', limit, timeRange],
    queryFn: () => spotifyService.getMyTopArtists(limit, timeRange),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const useMyTopTracks = (limit: number = 20, timeRange: SpotifyTimeRange = 'medium_term') => {
  const { isAuthenticated } = useAuth()
  return useQuery<SpotifySearchResponse<SpotifyTrack>>({
    queryKey: ['myTopTracks', limit, timeRange],
    queryFn: () => spotifyService.getMyTopTracks(limit, timeRange),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Playlists
export const useMyPlaylists = (limit: number = 20) => {
  const { isAuthenticated } = useAuth()
  return useInfiniteQuery<SpotifySearchResponse<SpotifyPlaylist>>({
    queryKey: ['myPlaylists', limit],
    queryFn: ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 0
      return spotifyService.getMyPlaylists(page * limit, limit)
    },
    initialPageParam: 0,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    getNextPageParam: (_lastPage, allPages) => allPages.length,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Playlist detail
export const usePlaylist = (playlistId: string) => {
  const { isAuthenticated } = useAuth()
  return useQuery<SpotifyPlaylist>({
    queryKey: ['playlist', playlistId],
    queryFn: () => spotifyService.getPlaylist(playlistId),
    enabled: !!playlistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

export const usePlaylistTracks = (playlistId: string) => {
  const { isAuthenticated } = useAuth()
  return useQuery<SpotifySearchResponse<SpotifyTrack>>({
    queryKey: ['playlistTracks', playlistId],
    queryFn: async () => {
      const data = await spotifyService.getPlaylistTracks(playlistId)
      // Some APIs return items with { track } shape; normalize to items: Track[] if needed
      if (Array.isArray((data as any).items) && (data as any).items.length && (data as any).items[0]?.track) {
        const tracks = (data as any).items.map((it: any) => it.track)
        return { ...data, items: tracks } as SpotifySearchResponse<SpotifyTrack>
      }
      return data
    },
    enabled: !!playlistId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
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
  return useQuery<{ albums: SpotifySearchResponse<SpotifyAlbum> }>({
    queryKey: ['newReleases', limit, country],
    queryFn: () => spotifyService.getNewReleases(0, limit, country),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if ((error as any)?.response?.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}
