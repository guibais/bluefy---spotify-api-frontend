import { Play, Pause } from 'lucide-react'
import { useAudioPlayer as usePlayer } from '@/hooks/useAudioPlayer'

type PlayButtonProps = {
  playlistId?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export const PlayButton = ({ 
  playlistId,
  size = 'md', 
  variant = 'primary',
  className = '' 
}: PlayButtonProps) => {
  const { currentPlaylistId, isPlaying, playPlaylist, togglePlayPause } = usePlayer()

  const targetPlaylistId = playlistId || null
  const isCurrent = !!targetPlaylistId && currentPlaylistId === targetPlaylistId
  const isCurrentlyPlaying = isCurrent && isPlaying

  const handleClick = () => {
    if (!targetPlaylistId) return
    if (isCurrent) {
      togglePlayPause()
    } else {
      playPlaylist(targetPlaylistId)
    }
  }

  const baseClasses = "inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)

  return (
    <button
      onClick={handleClick}
      disabled={!targetPlaylistId}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${!targetPlaylistId ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isCurrentlyPlaying ? 'Pausar playlist' : 'Reproduzir playlist'}
    >
      {isCurrentlyPlaying ? (
        <Pause className={`text-purplefy-white ${getIconSize(size)}`} />
      ) : (
        <Play className={`text-purplefy-white ${getIconSize(size)} ${size !== 'sm' ? 'ml-0.5' : ''}`} />
      )}
    </button>
  )
}

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  return sizes[size]
}

const getIconSize = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }
  return sizes[size]
}

const getVariantClasses = (variant: 'primary' | 'secondary' | 'ghost') => {
  const variants = {
    primary: 'bg-purplefy-primary hover:bg-purplefy-secondary shadow-lg hover:shadow-xl',
    secondary: 'bg-purplefy-medium-gray hover:bg-purplefy-primary border border-purplefy-primary/30',
    ghost: 'bg-transparent hover:bg-purplefy-primary/20 border border-purplefy-primary/50',
  }
  return variants[variant]
}
