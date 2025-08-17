export type SpotifyImage = {
  url: string
  height: number | null
  width: number | null
}

export type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term'

export type SpotifyArtist = {
  id: string
  name: string
  popularity: number
  followers: {
    total: number
  }
  genres: string[]
  images: SpotifyImage[]
  external_urls: {
    spotify: string
  }
}

export type SpotifyTrack = {
  id: string
  name: string
  popularity: number
  duration_ms: number
  explicit: boolean
  preview_url: string | null
  track_number: number
  artists: Pick<SpotifyArtist, 'id' | 'name'>[]
  album: Pick<SpotifyAlbum, 'id' | 'name' | 'images'>
  external_urls: {
    spotify: string
  }
}

export type SpotifyAlbum = {
  id: string
  name: string
  album_type: 'album' | 'single' | 'compilation'
  total_tracks: number
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'
  images: SpotifyImage[]
  artists: Pick<SpotifyArtist, 'id' | 'name'>[]
  external_urls: {
    spotify: string
  }
}

export type SpotifySearchResponse<T> = {
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}

export type SpotifyApiResponse<T> = {
  artists?: SpotifySearchResponse<SpotifyArtist>
  albums?: SpotifySearchResponse<SpotifyAlbum>
  tracks?: SpotifySearchResponse<SpotifyTrack>
} & T

export type SearchFilters = {
  query?: string
  artistName?: string
  albumName?: string
  page?: number
  limit?: number
}

export type PaginationInfo = {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrevious: boolean
}

export type SpotifyUser = {
  id: string
  display_name: string | null
  email?: string
  images: SpotifyImage[]
  country?: string
  followers?: { total: number }
  product?: 'premium' | 'free' | 'open'
  external_urls?: { spotify: string }
}

export type SpotifyPlaylistOwner = {
  id: string
  display_name: string | null
  external_urls?: { spotify: string }
  type?: 'user'
  uri?: string
}

export type SpotifyPlaylist = {
  id: string
  name: string
  description?: string | null
  images: SpotifyImage[]
  public?: boolean | null
  collaborative?: boolean
  owner: SpotifyPlaylistOwner
  external_urls: { spotify: string }
  snapshot_id?: string
  tracks?: { total: number }
}
