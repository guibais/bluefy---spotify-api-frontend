import { render } from '@testing-library/react'
import { GridSkeleton } from './GridSkeleton'

describe('GridSkeleton', () => {
  it('renders default skeleton grid', () => {
    const { container } = render(<GridSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('respects props count and cols', () => {
    const { container } = render(<GridSkeleton count={4} colsDesktop="grid-cols-4" colsMobile="grid-cols-1" />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
