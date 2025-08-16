import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useAudioPlayer } from '../../../hooks/useAudioPlayer'

type AudioPlayerProps = {
  className?: string
}

export const AudioPlayer = ({ className = '' }: AudioPlayerProps) => {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlayPause,
    seekTo,
    setVolume
  } = useAudioPlayer()

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-4 md:rounded-xl bg-purplefy-black/95 backdrop-blur-lg border-t md:border border-purplefy-medium-gray shadow-2xl z-50 ${className}`}>
      <div className="flex items-center gap-4 p-4">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-purplefy-white font-medium text-sm truncate">
            {currentTrack.name}
          </h4>
          <p className="text-purplefy-light-gray text-xs truncate">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-purplefy-primary hover:bg-purplefy-secondary transition-colors flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-purplefy-white" />
            ) : (
              <Play className="w-5 h-5 text-purplefy-white ml-0.5" />
            )}
          </button>

          {/* Volume Control - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="text-purplefy-light-gray hover:text-purplefy-white transition-colors"
            >
              {volume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-purplefy-medium-gray rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Time Display */}
          <div className="text-xs text-purplefy-light-gray whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div 
          className="w-full h-1 bg-purplefy-medium-gray rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            seekTo(percentage * duration)
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-purplefy-primary to-purplefy-secondary rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
