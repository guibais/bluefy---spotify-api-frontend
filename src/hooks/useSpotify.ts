import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { spotifyService } from '@/services/spotify'
import type { SearchFilters } from '@/types'

export const useSearchArtists = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['artists', 'search', filters],
    queryFn: () => spotifyService.searchArtists(filters),
    enabled: !!filters.query,
    staleTime: 5 * 60 * 1000,
  })
}

export const useArtist = (artistId: string) => {
  return useQuery({
    queryKey: ['artists', artistId],
    queryFn: () => spotifyService.getArtist(artistId),
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useArtistTopTracks = (artistId: string) => {
  return useQuery({
    queryKey: ['artists', artistId, 'top-tracks'],
    queryFn: () => spotifyService.getArtistTopTracks(artistId),
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useArtistAlbums = (artistId: string, filters: SearchFilters) => {
  return useInfiniteQuery({
    queryKey: ['artists', artistId, 'albums', filters],
    queryFn: ({ pageParam = 0 }) => 
      spotifyService.getArtistAlbums(artistId, { ...filters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.next) return undefined
      return pages.length
    },
    enabled: !!artistId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useAlbum = (albumId: string) => {
  return useQuery({
    queryKey: ['albums', albumId],
    queryFn: () => spotifyService.getAlbum(albumId),
    enabled: !!albumId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useAlbumTracks = (albumId: string) => {
  return useQuery({
    queryKey: ['albums', albumId, 'tracks'],
    queryFn: () => spotifyService.getAlbumTracks(albumId),
    enabled: !!albumId,
    staleTime: 10 * 60 * 1000,
  })
}
