import type { Meta, StoryObj } from '@storybook/react'
import { ErrorState } from './ErrorState'
import { Button } from '@/components/atoms'

const meta = {
  title: 'Molecules/ErrorState',
  component: ErrorState,
} satisfies Meta<typeof ErrorState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { title: 'Algo deu errado', message: 'Tente novamente mais tarde' } }
export const WithAction: Story = { args: { title: 'Falha', message: 'Sem conexão', action: <Button>tentar novamente</Button> } }
export const Large: Story = { args: { size: 'lg', title: 'Erro crítico' } }
