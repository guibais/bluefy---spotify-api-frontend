import { render, screen } from '@testing-library/react'
import { MobileLayout } from './MobileLayout'

vi.mock('../../molecules/MobileHeader/MobileHeader', () => ({
  MobileHeader: ({ title, backTo, showBack }: any) => (
    <div>
      <h1>{title}</h1>
      {showBack ? <a href={backTo}>back</a> : null}
    </div>
  ),
}))

vi.mock('../../molecules/BottomTabs/BottomTabs', () => ({
  BottomTabs: () => <nav aria-label="tabs" />,
}))

describe('MobileLayout', () => {
  it('renders header, children and tabs by default', () => {
    render(<MobileLayout title="T" backTo="/x">child</MobileLayout>)
    expect(screen.getByRole('heading', { level: 1, name: 'T' })).toBeTruthy()
    expect(screen.getByRole('link')).toBeTruthy()
    expect(screen.getByText('child')).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'tabs' })).toBeTruthy()
  })

  it('hides back and tabs when flags are false', () => {
    render(
      <MobileLayout title="T" showBack={false} showTabs={false}>
        child
      </MobileLayout>
    )
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'tabs' })).toBeNull()
  })
})
