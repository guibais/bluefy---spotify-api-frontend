import { Link } from '@tanstack/react-router'
import { Calendar, Disc } from 'lucide-react'
import { Image } from '@/components/atoms/Image/Image'
import { OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'

type ArtistRef = { id: string; name: string }

type Props = {
  name: string
  imageUrl?: string
  albumType?: string
  artists: ArtistRef[]
  year?: number | string
  tracksCount?: number
  externalUrl?: string
  layout?: 'desktop' | 'mobile'
}

export function AlbumHeader({ name, imageUrl, albumType, artists, year, tracksCount, externalUrl, layout = 'desktop' }: Props) {
  if (layout === 'mobile') {
    return (
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-64 h-64 mb-4">
          <Image src={imageUrl} alt={name} className="w-full h-full rounded-xl shadow-lg" />
        </div>
        {albumType && (
          <span className="inline-block px-2 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-xs rounded-full capitalize mb-2">
            {albumType}
          </span>
        )}
        <h1 className="text-xl font-bold text-purplefy-white mb-2">{name}</h1>
        <p className="text-purplefy-light-gray text-sm mb-4">
          {m.by()} {artists.map((a, idx) => (
            <span key={a.id}>
              <Link to="/artist/$artistId" params={{ artistId: a.id }} search={{ albumPage: 1 }} className="hover:text-purplefy-white underline-offset-2 hover:underline">
                {a.name}
              </Link>
              {idx < artists.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <div className="flex items-center gap-4 mb-4 text-purplefy-light-gray text-sm">
          {typeof year !== 'undefined' && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{year}</span>
            </div>
          )}
          {typeof tracksCount !== 'undefined' && (
            <div className="flex items-center gap-1">
              <Disc className="w-4 h-4" />
              <span>{m.tracks_count({ count: tracksCount })}</span>
            </div>
          )}
        </div>
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
        {albumType && (
          <span className="inline-block px-3 py-1 bg-purplefy-medium-gray text-purplefy-light-gray text-sm rounded-full capitalize mb-4">
            {albumType}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-purplefy-white mb-4">{name}</h1>
        <p className="text-xl text-purplefy-light-gray mb-6">
          {m.by()} {artists.map((a, idx) => (
            <span key={a.id}>
              <Link to="/artist/$artistId" params={{ artistId: a.id }} search={{ albumPage: 1 }} className="hover:text-purplefy-white underline-offset-2 hover:underline">
                {a.name}
              </Link>
              {idx < artists.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <div className="flex items-center gap-6 mb-6 text-purplefy-light-gray">
          {typeof year !== 'undefined' && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{year}</span>
            </div>
          )}
          {typeof tracksCount !== 'undefined' && (
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5" />
              <span>{m.tracks_count({ count: tracksCount })}</span>
            </div>
          )}
        </div>
        {externalUrl && <OpenInSpotifyButton url={externalUrl} variant="primary" />}
      </div>
    </div>
  )
}
