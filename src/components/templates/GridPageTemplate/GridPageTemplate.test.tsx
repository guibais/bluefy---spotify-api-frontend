import { render, screen } from '@testing-library/react'
import { GridPageTemplate } from './GridPageTemplate'

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, showBack, showTabs, children }: any) => (
    <section aria-label="mobile" data-show-back={String(!!showBack)} data-show-tabs={String(!!showTabs)}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  ),
}))

describe('GridPageTemplate', () => {
  it('renders desktop with title, description, toolbar, children and pagination; and mobile with same', () => {
    render(
      <GridPageTemplate
        title="Título Grid"
        description="Descrição Grid"
        toolbar={<div>Toolbar</div>}
        pagination={<button>Paginar</button>}
        showTabs
        mobileShowBack
      >
        <div>Conteúdo</div>
      </GridPageTemplate>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Título Grid' })).toBeTruthy()
    expect(screen.getByText('Descrição Grid')).toBeTruthy()
    expect(screen.getAllByText('Toolbar')).toHaveLength(2)
    expect(screen.getAllByText('Conteúdo')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Paginar' })).toHaveLength(2)

    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(mobile).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Título Grid' })).toBeTruthy()
    expect(mobile.getAttribute('data-show-back')).toBe('true')
    expect(mobile.getAttribute('data-show-tabs')).toBe('true')
  })

  it('omits optional elements and defaults showTabs/mobileShowBack to false', () => {
    render(
      <GridPageTemplate title="Sem opções">
        <span>Child</span>
      </GridPageTemplate>
    )

    expect(screen.queryByText('Descrição Grid')).toBeNull()
    expect(screen.queryByText('Toolbar')).toBeNull()
    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(mobile.getAttribute('data-show-back')).toBe('false')
    expect(mobile.getAttribute('data-show-tabs')).toBe('false')
  })
})
