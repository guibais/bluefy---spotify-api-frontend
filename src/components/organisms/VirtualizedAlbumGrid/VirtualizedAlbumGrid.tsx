import { useCallback, useMemo } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { AlbumCard } from '@/components/molecules'
import { Button } from '@/components/atoms'
import type { SpotifyAlbum } from '@/types'

type VirtualizedAlbumGridProps = {
  albums: SpotifyAlbum[]
  loading?: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  loadingMore?: boolean
  className?: string
}

const ITEM_WIDTH = 200
const ITEM_HEIGHT = 280
const GAP = 16

export const VirtualizedAlbumGrid = ({ 
  albums, 
  loading = false, 
  hasNextPage = false,
  onLoadMore,
  loadingMore = false,
  className 
}: VirtualizedAlbumGridProps) => {
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1200
  const columnsCount = Math.floor((containerWidth - GAP) / (ITEM_WIDTH + GAP))
  const rowsCount = Math.ceil(albums.length / columnsCount)
  
  const isItemLoaded = useCallback((index: number) => {
    return !!albums[index]
  }, [albums])

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && onLoadMore && !loadingMore) {
      onLoadMore()
    }
    return Promise.resolve()
  }, [hasNextPage, onLoadMore, loadingMore])

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnsCount + columnIndex
    const album = albums[index]
    
    if (!album) {
      return (
        <div style={style} className="p-2">
          <div className="card">
            <div className="skeleton w-full aspect-square rounded-lg mb-4" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-1/2 mb-2" />
            <div className="skeleton h-3 w-full" />
          </div>
        </div>
      )
    }

    return (
      <div style={style} className="p-2">
        <AlbumCard album={album} className="fade-in" />
      </div>
    )
  }, [albums, columnsCount])

  const itemCount = useMemo(() => {
    return hasNextPage ? albums.length + columnsCount : albums.length
  }, [albums.length, hasNextPage, columnsCount])

  if (loading && albums.length === 0) {
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

  if (albums.length === 0 && !loading) {
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
      <div className={className}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <Grid
              ref={ref}
              columnCount={columnsCount}
              columnWidth={ITEM_WIDTH + GAP}
              height={Math.min(600, rowsCount * ITEM_HEIGHT)}
              rowCount={Math.ceil(itemCount / columnsCount)}
              rowHeight={ITEM_HEIGHT}
              width={containerWidth}
              onItemsRendered={({
                visibleColumnStartIndex,
                visibleColumnStopIndex,
                visibleRowStartIndex,
                visibleRowStopIndex,
              }) => {
                onItemsRendered({
                  overscanStartIndex: visibleRowStartIndex * columnsCount + visibleColumnStartIndex,
                  overscanStopIndex: visibleRowStopIndex * columnsCount + visibleColumnStopIndex,
                  visibleStartIndex: visibleRowStartIndex * columnsCount + visibleColumnStartIndex,
                  visibleStopIndex: visibleRowStopIndex * columnsCount + visibleColumnStopIndex,
                })
              }}
            >
              {Cell}
            </Grid>
          )}
        </InfiniteLoader>
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
