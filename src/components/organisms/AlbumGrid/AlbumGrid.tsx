import { AlbumCard } from '@/components/molecules'
import { Button } from '@/components/atoms'
import type { SpotifyAlbum } from '@/types'

type AlbumGridProps = {
  albums: SpotifyAlbum[]
  loading?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
  className?: string
}

export const AlbumGrid = ({ 
  albums, 
  loading = false, 
  hasNextPage = false,
  onLoadMore,
  loadingMore = false,
  className 
}: AlbumGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className || ''}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="card">
            <div className="skeleton w-full aspect-square rounded-lg mb-4" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-1/2 mb-2" />
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">💿</div>
        <h3 className="text-xl font-semibold text-spotify-white mb-2">
          Nenhum álbum encontrado
        </h3>
        <p className="text-spotify-light-gray">
          Este artista ainda não possui álbuns disponíveis
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className || ''}`}>
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} className="fade-in" />
        ))}
      </div>
      
      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            loading={loadingMore}
            variant="secondary"
          >
            {loadingMore ? 'Carregando...' : 'Carregar mais álbuns'}
          </Button>
        </div>
      )}
    </div>
  )
}
