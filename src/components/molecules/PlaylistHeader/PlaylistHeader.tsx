import { User } from 'lucide-react'
import { Image } from '@/components/atoms/Image/Image'
import { OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'

type Props = {
  name: string
  imageUrl?: string
  ownerName?: string | null
  followers?: number
  externalUrl?: string
}

export function PlaylistHeader({ name, imageUrl, ownerName, followers, externalUrl }: Props) {
  return (
    <div className="flex items-center justify-between gap-6 mb-10">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24">
          <Image src={imageUrl} alt={name} className="w-24 h-24 rounded-lg object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-purplefy-white">{name}</h1>
          <div className="flex items-center gap-3 text-purplefy-light-gray mt-2 text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="w-4 h-4" />
              {ownerName || '-'}
            </span>
            <span>•</span>
            <span>{followers?.toLocaleString() ?? '-'} {m.followers_label()}</span>
          </div>
        </div>
      </div>
      {externalUrl && <OpenInSpotifyButton url={externalUrl} />}
    </div>
  )
}
