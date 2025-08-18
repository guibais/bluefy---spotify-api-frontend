import { render, screen } from '@testing-library/react'
import { PageTemplate } from './PageTemplate'

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, showBack, showTabs, children }: any) => (
    <section aria-label="mobile" data-show-back={String(!!showBack)} data-show-tabs={String(!!showTabs)}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  ),
}))

describe('PageTemplate', () => {
  it('renders desktop and mobile sections with title and description', () => {
    render(
      <PageTemplate
        title="Título"
        description="Descrição"
        showBack
        showTabs
        toolbarDesktop={<div>TD</div>}
        toolbarMobile={<div>TM</div>}
        desktop={<div>Desktop</div>}
        mobile={<div>Mobile</div>}
      />
    )

    // Desktop container
    expect(screen.getByRole('heading', { level: 1, name: 'Título' })).toBeTruthy()
    expect(screen.getByText('Descrição')).toBeTruthy()
    expect(screen.getByText('TD')).toBeTruthy()
    expect(screen.getByText('Desktop')).toBeTruthy()

    // Mobile section (mocked)
    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(mobile).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Título' })).toBeTruthy()
    expect(screen.getByText('TM')).toBeTruthy()
    expect(screen.getByText('Mobile')).toBeTruthy()
    expect(mobile.getAttribute('data-show-back')).toBe('true')
    expect(mobile.getAttribute('data-show-tabs')).toBe('true')
  })

  it('hides description when not provided and defaults showBack/showTabs to false', () => {
    render(
      <PageTemplate
        title="Sem Descrição"
        desktop={<div>D</div>}
        mobile={<div>M</div>}
      />
    )

    expect(screen.queryByText('Descrição')).toBeNull()
    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(mobile.getAttribute('data-show-back')).toBe('false')
    expect(mobile.getAttribute('data-show-tabs')).toBe('false')
  })
})
