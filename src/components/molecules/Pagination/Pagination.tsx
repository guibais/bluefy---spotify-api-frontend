import { Button } from '@/components/atoms'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationInfo } from '@/types'

type PaginationProps = {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({ pagination, onPageChange, className }: PaginationProps) => {
  const { currentPage, totalPages, hasNext, hasPrevious } = pagination

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className || ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="p-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getVisiblePages().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-2 text-spotify-light-gray">
              ...
            </span>
          )
        }

        const pageNum = page as number
        const isActive = pageNum === currentPage

        return (
          <Button
            key={pageNum}
            variant={isActive ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className="min-w-[2.5rem] h-10"
          >
            {pageNum}
          </Button>
        )
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="p-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
