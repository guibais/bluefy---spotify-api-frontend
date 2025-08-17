import { ArtistCard } from '@/components/molecules'
import type { SpotifyArtist } from '@/types'
import * as m from '@/paraglide/messages.js'

type ArtistGridProps = {
  artists: SpotifyArtist[]
  loading?: boolean
  className?: string
}

export const ArtistGrid = ({ artists, loading = false, className }: ArtistGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className || ''}`}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="card">
            <div className="skeleton w-full aspect-square rounded-lg mb-4" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-1/2 mb-2" />
            <div className="skeleton h-2 w-full mb-1" />
            <div className="skeleton h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-spotify-white mb-2">
          {m.artists_empty_title()}
        </h3>
        <p className="text-spotify-light-gray">
          {m.artists_empty_suggestion()}
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className || ''}`}>
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} className="fade-in" />
      ))}
    </div>
  )
}
