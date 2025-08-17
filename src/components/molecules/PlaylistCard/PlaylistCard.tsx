import { Link } from '@tanstack/react-router'
import { Image } from '@/components/atoms/Image/Image'
import { Button } from '@/components/atoms/Button/Button'
import * as m from '@/paraglide/messages.js'

type CardProps = {
  id: string
  name: string
  image?: string
  subtitle?: string
  spotifyUrl?: string
  to?: string
}

export function PlaylistCard({ name, image, subtitle, spotifyUrl, to }: CardProps) {
  const handleOpen = () => {
    if (spotifyUrl) window.open(spotifyUrl, '_blank')
  }
  return (
    <div className="group bg-purplefy-dark/40 border border-purplefy-medium-gray rounded-xl p-3 hover:border-purplefy-primary/50 transition-colors">
      {to ? (
        <Link to={to} className="block w-full text-left">
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-3 bg-purplefy-black">
            {image ? (
              <Image src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purplefy-light-gray">🎶</div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purplefy-white line-clamp-1">{name}</h3>
            {subtitle && (
              <p className="text-xs text-purplefy-light-gray line-clamp-1">{subtitle}</p>
            )}
          </div>
        </Link>
      ) : (
        <button onClick={handleOpen} className="w-full text-left">
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-3 bg-purplefy-black">
            {image ? (
              <Image src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purplefy-light-gray">🎶</div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purplefy-white line-clamp-1">{name}</h3>
            {subtitle && (
              <p className="text-xs text-purplefy-light-gray line-clamp-1">{subtitle}</p>
            )}
          </div>
        </button>
      )}
      {spotifyUrl && (
        <div className="mt-3">
          <Button onClick={handleOpen} variant="secondary" className="w-full">{m.open_in_spotify()}</Button>
        </div>
      )}
    </div>
  )
}
