import { Play, Pause } from 'lucide-react'
import { useAudioPlayer } from '../../../hooks/useAudioPlayer'

type Track = {
  id: string
  name: string
  artists: Array<{ name: string }>
  preview_url?: string | null
  duration_ms: number
}

type PlayButtonProps = {
  track: Track
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export const PlayButton = ({ 
  track, 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: PlayButtonProps) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, hasPreview } = useAudioPlayer()

  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlayPause()
    } else {
      playTrack(track)
    }
  }

  if (!hasPreview(track)) {
    return (
      <div className={`inline-flex items-center justify-center rounded-full bg-purplefy-medium-gray/50 cursor-not-allowed ${getSizeClasses(size)} ${className}`}>
        <Play className={`text-purplefy-light-gray/50 ${getIconSize(size)}`} />
      </div>
    )
  }

  const baseClasses = "inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {isCurrentlyPlaying ? (
        <Pause className={`text-purplefy-white ${getIconSize(size)}`} />
      ) : (
        <Play className={`text-purplefy-white ${getIconSize(size)} ${size !== 'sm' ? 'ml-0.5' : ''}`} />
      )}
    </button>
  )
}

const getSizeClasses = (size: string) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  return sizes[size as keyof typeof sizes] || sizes.md
}

const getIconSize = (size: string) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  }
  return sizes[size as keyof typeof sizes] || sizes.md
}

const getVariantClasses = (variant: string) => {
  const variants = {
    primary: 'bg-purplefy-primary hover:bg-purplefy-secondary shadow-lg hover:shadow-xl',
    secondary: 'bg-purplefy-medium-gray hover:bg-purplefy-primary border border-purplefy-primary/30',
    ghost: 'bg-transparent hover:bg-purplefy-primary/20 border border-purplefy-primary/50'
  }
  return variants[variant as keyof typeof variants] || variants.primary
}
