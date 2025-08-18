import { render } from '@testing-library/react'
import { DetailSkeleton } from './DetailSkeleton'

describe('DetailSkeleton', () => {
  it('renders placeholders', () => {
    const { container } = render(<DetailSkeleton />)
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
  })
})
