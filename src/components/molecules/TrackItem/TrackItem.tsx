import { Image } from '@/components/atoms'
import { PlayButton } from '../../atoms/PlayButton/PlayButton'
import type { SpotifyTrack } from '@/types'
import { Clock, ExternalLink } from 'lucide-react'

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

  const handleSpotifyClick = () => {
    window.open(track.external_urls.spotify, '_blank')
  }

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg hover:bg-purplefy-medium-gray/50 transition-all duration-200 group ${className || ''}`}>
      {index !== undefined && (
        <div className="w-8 flex items-center justify-center">
          <span className="hidden md:inline text-purplefy-light-gray text-sm group-hover:hidden">
            {index + 1}
          </span>
          <div className="hidden md:block md:group-hover:block">
            <PlayButton 
              track={track} 
              size="sm" 
              variant="ghost"
            />
          </div>
          <div className="md:hidden">
            <PlayButton 
              track={track} 
              size="sm" 
              variant="primary"
            />
          </div>
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
        <h4 className="font-medium text-purplefy-white truncate group-hover:text-purplefy-primary transition-colors">
          {track.name}
          {track.explicit && (
            <span className="ml-2 px-1 py-0.5 bg-purplefy-light-gray text-purplefy-black text-xs rounded">
              E
            </span>
          )}
        </h4>
        <p className="text-sm text-purplefy-light-gray truncate">
          {track.artists.map(artist => artist.name).join(', ')}
          {showAlbum && ` • ${track.album.name}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-purplefy-dark-gray rounded-full h-1 w-16">
          <div 
            className="bg-gradient-to-r from-purplefy-primary to-purplefy-secondary h-1 rounded-full transition-all duration-300"
            style={{ width: `${track.popularity}%` }}
          />
        </div>
        
        <button
          onClick={handleSpotifyClick}
          className="opacity-0 group-hover:opacity-100 text-purplefy-light-gray hover:text-purplefy-primary transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 text-purplefy-light-gray text-sm min-w-0">
          <Clock className="w-3 h-3" />
          <span>{formattedDuration}</span>
        </div>
      </div>
    </div>
  )
}
