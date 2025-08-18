import type { Meta, StoryObj } from '@storybook/react'
import { AuthStatus } from './AuthStatus'
import { Button } from '@/components/atoms'

const meta = {
  title: 'Molecules/AuthStatus',
  component: AuthStatus,
  args: {
    status: 'processing',
  },
} satisfies Meta<typeof AuthStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Processing: Story = { args: { status: 'processing' } }
export const Success: Story = { args: { status: 'success' } }
export const Error: Story = { args: { status: 'error', errorMessage: 'Login falhou', action: <Button>tentar novamente</Button> } }
