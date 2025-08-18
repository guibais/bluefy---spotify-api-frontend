import { render, screen } from '@testing-library/react'
import { ProfileHeader } from './ProfileHeader'

vi.mock('@/components/atoms/Image/Image', () => ({
  Image: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}))

describe('ProfileHeader', () => {
  const stats = [
    { label: 'Playlists', value: '5' },
    { label: 'Seguidores', value: '1200' },
    { label: 'Seguindo', value: '42' },
  ]

  it('renders desktop layout with stats and slots', () => {
    render(<ProfileHeader name="Nome" imageUrl="/u.jpg" subtitle="Sub" stats={stats} rightSlot={<button>R</button>} titleExtraLeft={<span>L</span>} />)
    expect(screen.getByRole('img', { name: 'Nome' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'Nome' })).toBeTruthy()
    expect(screen.getByText('Sub')).toBeTruthy()
    expect(screen.getByText('L')).toBeTruthy()
    expect(screen.getAllByText(/Playlists|Seguidores|Seguindo/).length).toBe(3)
    expect(screen.getByRole('button', { name: 'R' })).toBeTruthy()
  })

  it('renders mobile layout compactly', () => {
    render(<ProfileHeader name="Nome" imageUrl="/u.jpg" subtitle="Sub" stats={stats} layout="mobile" rightSlot={<button>R</button>} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Nome' })).toBeTruthy()
    expect(screen.getByText('Sub')).toBeTruthy()
    expect(screen.getAllByText(/Playlists|Seguidores|Seguindo/).length).toBe(3)
  })
})
