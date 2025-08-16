import axios from 'axios'
import type { SpotifyArtist, SpotifyAlbum, SpotifyTrack, SpotifySearchResponse, SearchFilters } from '@/types'

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1'

const spotifyApi = axios.create({
  baseURL: SPOTIFY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

spotifyApi.interceptors.request.use((config) => {
  const envToken = import.meta.env.VITE_SPOTIFY_TOKEN
  const localToken = localStorage.getItem('spotify_token')
  const token = envToken || localToken
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
    filters: SearchFilters
  ): Promise<SpotifySearchResponse<SpotifyAlbum>> => {
    const params = new URLSearchParams()
    params.append('include_groups', 'album,single')
    params.append('market', 'BR')
    params.append('limit', String(filters.limit || 20))
    params.append('offset', String((filters.page || 0) * (filters.limit || 20)))

    const response = await spotifyApi.get(`/artists/${artistId}/albums?${params.toString()}`)
    return response.data
  },

  getAlbum: async (albumId: string): Promise<SpotifyAlbum> => {
    const response = await spotifyApi.get(`/albums/${albumId}`)
    return response.data
  },

  getAlbumTracks: async (albumId: string): Promise<SpotifySearchResponse<SpotifyTrack>> => {
    const response = await spotifyApi.get(`/albums/${albumId}/tracks`)
    return response.data
  },
}
