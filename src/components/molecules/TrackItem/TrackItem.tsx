import { Image } from '@/components/atoms'
import type { SpotifyTrack } from '@/types'
import { Play, Clock, ExternalLink } from 'lucide-react'

type TrackItemProps = {
  track: SpotifyTrack
  index?: number
  showAlbum?: boolean
  className?: string
}

export const TrackItem = ({ track, index, showAlbum = false, className }: TrackItemProps) => {
  const duration = Math.floor(track.duration_ms / 1000)
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const handlePlayClick = () => {
    if (track.preview_url) {
      window.open(track.preview_url, '_blank')
    }
  }

  const handleSpotifyClick = () => {
    window.open(track.external_urls.spotify, '_blank')
  }

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg hover:bg-spotify-medium-gray/50 transition-all duration-200 group ${className || ''}`}>
      {index !== undefined && (
        <div className="w-6 text-center">
          <span className="text-spotify-light-gray text-sm group-hover:hidden">
            {index + 1}
          </span>
          <button
            onClick={handlePlayClick}
            disabled={!track.preview_url}
            className="hidden group-hover:block text-spotify-green hover:text-spotify-green-light disabled:text-spotify-light-gray disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      )}

      {showAlbum && (
        <Image
          src={track.album.images[0]?.url}
          alt={track.album.name}
          className="w-12 h-12 rounded"
        />
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-spotify-white truncate group-hover:text-spotify-green transition-colors">
          {track.name}
          {track.explicit && (
            <span className="ml-2 px-1 py-0.5 bg-spotify-light-gray text-spotify-black text-xs rounded">
              E
            </span>
          )}
        </h4>
        <p className="text-sm text-spotify-light-gray truncate">
          {track.artists.map(artist => artist.name).join(', ')}
          {showAlbum && ` • ${track.album.name}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-spotify-dark-gray rounded-full h-1 w-16">
          <div 
            className="bg-spotify-green h-1 rounded-full transition-all duration-300"
            style={{ width: `${track.popularity}%` }}
          />
        </div>
        
        <button
          onClick={handleSpotifyClick}
          className="opacity-0 group-hover:opacity-100 text-spotify-light-gray hover:text-spotify-green transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 text-spotify-light-gray text-sm min-w-0">
          <Clock className="w-3 h-3" />
          <span>{formattedDuration}</span>
        </div>
      </div>
    </div>
  )
}
