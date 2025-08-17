import { TrackItem } from '@/components/molecules'
import type { SpotifyTrack } from '@/types'
import * as m from '@/paraglide/messages.js'

type TrackListProps = {
  tracks: SpotifyTrack[]
  loading?: boolean
  showAlbum?: boolean
  title?: string
  className?: string
}

export const TrackList = ({ 
  tracks, 
  loading = false, 
  showAlbum = false,
  title,
  className 
}: TrackListProps) => {
  if (loading) {
    return (
      <div className={`space-y-2 ${className || ''}`}>
        {title && (
          <h3 className="text-xl font-bold text-purplefy-white mb-4">{title}</h3>
        )}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-3">
            <div className="skeleton w-6 h-4" />
            {showAlbum && <div className="skeleton w-12 h-12 rounded" />}
            <div className="flex-1">
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
            <div className="skeleton h-3 w-12" />
          </div>
        ))}
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🎶</div>
        <h3 className="text-xl font-semibold text-purplefy-white mb-2">
          {m.tracks_empty_title()}
        </h3>
        <p className="text-purplefy-light-gray">
          {m.tracks_empty_message()}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`space-y-2 ${className || ''}`}
      role="list"
      aria-label={title || m.tracks_title()}
    >
      {title && (
        <h3 className="text-xl font-bold text-purplefy-white mb-4">{title}</h3>
      )}
      {tracks.map((track, index) => (
        <TrackItem
          key={track.id}
          track={track}
          index={index}
          showAlbum={showAlbum}
          className="slide-up"
        />
      ))}
    </div>
  )
}
