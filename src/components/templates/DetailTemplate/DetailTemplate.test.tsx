import { render, screen } from '@testing-library/react'
import { DetailTemplate } from './DetailTemplate'

vi.mock('@/components/organisms/MobileLayout/MobileLayout', () => ({
  MobileLayout: ({ title, backTo, showTabs, children }: any) => (
    <section aria-label="mobile" data-back-to={backTo} data-show-tabs={String(!!showTabs)}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  ),
}))

describe('DetailTemplate', () => {
  it('renders desktop with actions and header and children; passes props to mobile with default backTo and showTabs=false', () => {
    render(
      <DetailTemplate
        title="Detalhe"
        actions={<button>Ações</button>}
        header={<div>Cabeçalho</div>}
      >
        <div>Conteúdo</div>
      </DetailTemplate>
    )

    expect(screen.getByRole('button', { name: 'Ações' })).toBeTruthy()
    expect(screen.getAllByText('Cabeçalho')).toHaveLength(2)
    expect(screen.getAllByText('Conteúdo')).toHaveLength(2)
    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(screen.getByRole('heading', { level: 2, name: 'Detalhe' })).toBeTruthy()
    expect(mobile.getAttribute('data-back-to')).toBe('/home')
    expect(mobile.getAttribute('data-show-tabs')).toBe('false')
  })

  it('overrides backTo and showTabs and renders without actions', () => {
    render(
      <DetailTemplate title="Outra" backTo="/profile" showTabs header={<span>H</span>}>
        <span>C</span>
      </DetailTemplate>
    )

    expect(screen.queryByRole('button', { name: 'Ações' })).toBeNull()
    const mobile = screen.getByRole('region', { name: 'mobile' })
    expect(mobile.getAttribute('data-back-to')).toBe('/profile')
    expect(mobile.getAttribute('data-show-tabs')).toBe('true')
  })
})
