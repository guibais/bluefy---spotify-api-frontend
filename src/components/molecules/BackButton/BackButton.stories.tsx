import type { Meta, StoryObj } from '@storybook/react'
import { BackButton } from './BackButton'

const meta = {
  title: 'Molecules/BackButton',
  component: BackButton,
  args: {
    children: 'Voltar',
    fallbackTo: '/home',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof BackButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
