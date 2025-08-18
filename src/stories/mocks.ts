import type { SpotifyAlbum, SpotifyArtist, SpotifyImage, SpotifyTrack } from '@/types'

const img = (url: string): SpotifyImage => ({ url, width: 300, height: 300 })

export const mockArtist = (overrides: Partial<SpotifyArtist> = {}): SpotifyArtist => ({
  id: 'artist_1',
  name: 'Daft Punk',
  popularity: 85,
  followers: { total: 1234567 },
  genres: ['electronic', 'house'],
  images: [img('https://picsum.photos/seed/artist/300/300')],
  external_urls: { spotify: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi' },
  ...overrides,
})

export const mockAlbum = (overrides: Partial<SpotifyAlbum> = {}): SpotifyAlbum => ({
  id: 'album_1',
  name: 'Random Access Memories',
  album_type: 'album',
  total_tracks: 13,
  release_date: '2013-05-17',
  release_date_precision: 'day',
  images: [img('https://picsum.photos/seed/album/300/300')],
  artists: [{ id: 'artist_1', name: 'Daft Punk' }],
  external_urls: { spotify: 'https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa' },
  ...overrides,
})

export const mockTrack = (overrides: Partial<SpotifyTrack> = {}): SpotifyTrack => ({
  id: 'track_1',
  name: 'Get Lucky',
  popularity: 90,
  duration_ms: 248000,
  explicit: false,
  preview_url: null,
  track_number: 1,
  artists: [{ id: 'artist_1', name: 'Daft Punk' }],
  album: { id: 'album_1', name: 'Random Access Memories', images: [img('https://picsum.photos/seed/track/300/300')] },
  external_urls: { spotify: 'https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq' },
  ...overrides,
})
