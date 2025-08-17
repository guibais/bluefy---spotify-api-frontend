import { Users } from 'lucide-react'
import { Image } from '@/components/atoms/Image/Image'
import { OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'

type Props = {
  name: string
  imageUrl?: string
  followers?: number
  popularity?: number
  genres?: string[]
  externalUrl?: string
  layout?: 'desktop' | 'mobile'
}

export function ArtistHeader({ name, imageUrl, followers, popularity, genres = [], externalUrl, layout = 'desktop' }: Props) {
  if (layout === 'mobile') {
    return (
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-48 h-48 mb-4">
          <Image src={imageUrl} alt={name} className="w-full h-full rounded-xl shadow-lg" />
        </div>
        <h1 className="text-2xl font-bold text-purplefy-white mb-2">{name}</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-purplefy-light-gray text-sm">
            <Users className="w-4 h-4" />
            <span>{followers ? (followers / 1000000).toFixed(1) + 'M' : '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-purplefy-dark-gray rounded-full h-1.5 w-16">
              <div className="bg-gradient-to-r from-purplefy-primary to-purplefy-secondary h-1.5 rounded-full" style={{ width: `${popularity ?? 0}%` }} />
            </div>
            <span className="text-xs text-purplefy-light-gray">{popularity ?? 0}%</span>
          </div>
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {genres.slice(0, 3).map((genre) => (
              <span key={genre} className="px-2 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-xs rounded-full">
                {genre}
              </span>
            ))}
          </div>
        )}
        {externalUrl && <OpenInSpotifyButton url={externalUrl} variant="primary" size="sm" />}
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="w-full md:w-80">
        <Image src={imageUrl} alt={name} className="w-full aspect-square rounded-xl shadow-2xl" />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl md:text-6xl font-bold text-purplefy-white mb-4">{name}</h1>
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-purplefy-light-gray">
            <Users className="w-5 h-5" />
            <span>{followers?.toLocaleString() ?? '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-purplefy-dark-gray rounded-full h-2 w-24">
              <div className="bg-gradient-to-r from-purplefy-primary to-purplefy-secondary h-2 rounded-full transition-all duration-300" style={{ width: `${popularity ?? 0}%` }} />
            </div>
            <span className="text-sm text-purplefy-light-gray">{popularity ?? 0}% {m.popular_label()}</span>
          </div>
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <span key={genre} className="px-3 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-sm rounded-full border border-purplefy-primary/20">
                {genre}
              </span>
            ))}
          </div>
        )}
        {externalUrl && <OpenInSpotifyButton url={externalUrl} variant="primary" />}
      </div>
    </div>
  )
}
