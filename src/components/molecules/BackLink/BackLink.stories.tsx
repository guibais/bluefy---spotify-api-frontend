import type { Meta, StoryObj } from '@storybook/react'
import { BackLink } from './BackLink'

const meta = {
  title: 'Molecules/BackLink',
  component: BackLink,
  args: {
    to: '/',
    label: 'Voltar',
  },
} satisfies Meta<typeof BackLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
