import { Link } from '@tanstack/react-router'
import { Image } from '@/components/atoms'
import type { SpotifyAlbum } from '@/types'
import { Calendar, Disc } from 'lucide-react'
import * as m from '@/paraglide/messages.js'

type AlbumCardProps = {
  album: SpotifyAlbum
  className?: string
}

export const AlbumCard = ({ album, className }: AlbumCardProps) => {
  const imageUrl = album.images[0]?.url
  const releaseYear = new Date(album.release_date).getFullYear()

  return (
    <Link
      to="/album/$albumId"
      params={{ albumId: album.id }}
      aria-label={m.album_card_link_label({ name: album.name })}
      className={`card group ${className || ''}`}
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={album.name}
          className="w-full aspect-square rounded-lg mb-4"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-spotify-white text-base truncate group-hover:text-blue-400 transition-colors">
          {album.name}
        </h3>
        
        <p className="text-spotify-light-gray text-sm truncate">
          {album.artists.map(artist => artist.name).join(', ')}
        </p>
        
        <div className="flex items-center justify-between text-spotify-light-gray text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{releaseYear}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Disc className="w-3 h-3" />
            <span>{m.tracks_count({ count: album.total_tracks })}</span>
          </div>
        </div>
        
        <span className="inline-block px-2 py-1 bg-spotify-dark-gray text-spotify-light-gray text-xs rounded-full capitalize">
          {album.album_type}
        </span>
      </div>
    </Link>
  )
}
