import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifySearchResponse, SearchFilters, SpotifyUser, SpotifyPlaylist } from '@/types'

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1'

const spotifyApi = axios.create({
  baseURL: SPOTIFY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

spotifyApi.interceptors.request.use((config) => {
  const storeToken = useAuthStore.getState().getValidToken()
  
  if (storeToken) {
    config.headers.Authorization = `Bearer ${storeToken}`    
  }
  
  return config
})

spotifyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearTokens()
    }
    return Promise.reject(error)
  }
)

export const spotifyService = {
  searchArtists: async (filters: SearchFilters): Promise<SpotifySearchResponse<SpotifyArtist>> => {
    const params = new URLSearchParams()
    
    if (filters.query) {
      params.append('q', `artist:${filters.query}`)
    }
    
    params.append('type', 'artist')
    params.append('limit', String(filters.limit || 20))
    params.append('offset', String((filters.page || 0) * (filters.limit || 20)))

    const response = await spotifyApi.get(`/search?${params.toString()}`)
    return response.data.artists
  },

  getArtist: async (artistId: string): Promise<SpotifyArtist> => {
    const response = await spotifyApi.get(`/artists/${artistId}`)
    return response.data
  },

  getArtistTopTracks: async (artistId: string): Promise<SpotifyTrack[]> => {
    const response = await spotifyApi.get(`/artists/${artistId}/top-tracks?market=BR`)
    return response.data.tracks
  },

  getArtistAlbums: async (
    artistId: string, 
    offset: number = 0,
    limit: number = 20,
    albumFilter?: string
  ): Promise<SpotifySearchResponse<SpotifyAlbum>> => {
    const params = new URLSearchParams()
    params.append('include_groups', 'album,single')
    params.append('market', 'BR')
    params.append('limit', String(limit))
    params.append('offset', String(offset))

    const response = await spotifyApi.get(`/artists/${artistId}/albums?${params.toString()}`)
    let albums = response.data
    
    if (albumFilter && albumFilter.trim()) {
      const filterLower = albumFilter.toLowerCase().trim()
      albums = {
        ...albums,
        items: albums.items.filter((album: SpotifyAlbum) => 
          album.name.toLowerCase().includes(filterLower)
        )
      }
    }
    
    return albums
  },

  getAlbum: async (albumId: string): Promise<SpotifyAlbum> => {
    const response = await spotifyApi.get(`/albums/${albumId}`)
    return response.data
  },

  getAlbumTracks: async (albumId: string): Promise<SpotifySearchResponse<SpotifyTrack>> => {
    const response = await spotifyApi.get(`/albums/${albumId}/tracks`)
    return response.data
  },

  getMe: async (): Promise<SpotifyUser> => {
    const response = await spotifyApi.get(`/me`)
    return response.data
  },

  getMyTopArtists: async (limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifySearchResponse<SpotifyArtist>> => {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    params.append('time_range', timeRange)
    const response = await spotifyApi.get(`/me/top/artists?${params.toString()}`)
    return response.data
  },

  getMyTopTracks: async (limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifySearchResponse<SpotifyTrack>> => {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    params.append('time_range', timeRange)
    const response = await spotifyApi.get(`/me/top/tracks?${params.toString()}`)
    return response.data
  },

  // Playlists
  getMyPlaylists: async (offset: number = 0, limit: number = 20): Promise<SpotifySearchResponse<SpotifyPlaylist>> => {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    params.append('offset', String(offset))
    const response = await spotifyApi.get(`/me/playlists?${params.toString()}`)
    return response.data
  },

  getFeaturedPlaylists: async (offset: number = 0, limit: number = 20, locale?: string): Promise<{ message: string; playlists: SpotifySearchResponse<SpotifyPlaylist> }> => {
    const params = new URLSearchParams()
    params.append('limit', String(limit))
    params.append('offset', String(offset))
    if (locale) params.append('locale', locale)
    const response = await spotifyApi.get(`/browse/featured-playlists?${params.toString()}`)
    return response.data
  },
}
