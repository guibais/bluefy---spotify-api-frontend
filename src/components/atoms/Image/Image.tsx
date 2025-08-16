import { ImgHTMLAttributes, useState } from 'react'
import { clsx } from 'clsx'
import { Music } from 'lucide-react'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string
  showFallbackIcon?: boolean
}

export const Image = ({ 
  className, 
  fallback, 
  showFallbackIcon = true,
  alt,
  onError,
  ...props 
}: ImageProps) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true)
    setIsLoading(false)
    onError?.(e)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError || !props.src) {
    return (
      <div className={clsx(
        'flex items-center justify-center bg-spotify-medium-gray',
        className
      )}>
        {showFallbackIcon && (
          <Music className="w-1/3 h-1/3 text-spotify-light-gray" />
        )}
        {fallback && !showFallbackIcon && (
          <span className="text-spotify-light-gray text-sm">{fallback}</span>
        )}
      </div>
    )
  }

  return (
    <div className={clsx('relative', className)}>
      {isLoading && (
        <div className={clsx(
          'absolute inset-0 flex items-center justify-center bg-spotify-medium-gray skeleton',
          className
        )} />
      )}
      <img
        {...props}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={clsx(
          'w-full h-full object-cover',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100 transition-opacity duration-300'
        )}
      />
    </div>
  )
}
