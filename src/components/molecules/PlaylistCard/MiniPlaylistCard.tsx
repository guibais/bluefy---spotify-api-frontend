import { Link } from '@tanstack/react-router'
import { Image } from '@/components/atoms/Image/Image'
import { OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'

type Props = {
  id: string
  name: string
  imageUrl?: string
  tracksCount?: number
  externalUrl?: string
  size?: 'desktop' | 'mobile'
}

export function MiniPlaylistCard({ id, name, imageUrl, tracksCount = 0, externalUrl, size = 'desktop' }: Props) {
  const containerClass = size === 'desktop' ? 'card p-3 hover:bg-purplefy-medium-gray/40 transition-colors' : 'card p-2 hover:bg-purplefy-medium-gray/40 transition-colors'
  const imageClass = size === 'desktop' ? 'w-full aspect-square rounded-lg mb-3' : 'w-full aspect-square rounded-lg mb-2'
  const titleClass = size === 'desktop' ? 'text-sm font-medium text-spotify-white truncate' : 'text-xs font-medium text-spotify-white truncate'
  const metaClass = size === 'desktop' ? 'text-xs text-spotify-light-gray truncate' : 'text-[10px] text-spotify-light-gray truncate'

  return (
    <Link to="/playlist/$playlistId" params={{ playlistId: id }} className={containerClass}>
      <Image src={imageUrl} alt={name} className={imageClass} />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className={titleClass}>{name}</h3>
          <p className={metaClass}>{tracksCount} {m.tracks_suffix()}</p>
        </div>
        {externalUrl && (
          <OpenInSpotifyButton url={externalUrl} iconOnly ariaLabel={`${m.open_in_spotify()} - ${name}`} />
        )}
      </div>
    </Link>
  )
}
