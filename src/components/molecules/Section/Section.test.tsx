import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('renders title, action and children', () => {
    render(
      <Section title="Featured" action={<button>More</button>}>
        <div role="list">items</div>
      </Section>
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Featured' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'More' })).toBeTruthy()
    expect(screen.getByRole('list')).toBeTruthy()
  })
})
