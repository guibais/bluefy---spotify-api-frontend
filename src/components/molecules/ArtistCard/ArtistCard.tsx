import { Link } from '@tanstack/react-router'
import { Image } from '@/components/atoms'
import type { SpotifyArtist } from '@/types'
import { Users } from 'lucide-react'
import * as m from '@/paraglide/messages.js'

type ArtistCardProps = {
  artist: SpotifyArtist
  className?: string
}

export const ArtistCard = ({ artist, className }: ArtistCardProps) => {
  const imageUrl = artist.images[0]?.url

  return (
    <Link
      to="/artist/$artistId"
      params={{ artistId: artist.id }}
      search={{ albumPage: 1 }}
      className={`card group ${className || ''}`}
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={artist.name}
          className="w-full aspect-square rounded-lg mb-4"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-spotify-white text-lg truncate group-hover:text-blue-400 transition-colors">
          {artist.name}
        </h3>
        
        <div className="flex items-center gap-2 text-spotify-light-gray text-sm">
          <Users className="w-4 h-4" />
          <span>{artist.followers.total.toLocaleString()} {m.followers_label()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex-1 bg-spotify-dark-gray rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${artist.popularity}%` }}
            />
          </div>
          <span className="text-xs text-spotify-light-gray ml-2">
            {artist.popularity}% {m.popular_label()}
          </span>
        </div>
        
        {artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {artist.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-spotify-dark-gray text-spotify-light-gray text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
