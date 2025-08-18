import type { Meta, StoryObj } from '@storybook/react'
import { MobileHeader } from './MobileHeader'

const meta = {
  title: 'Molecules/MobileHeader',
  component: MobileHeader,
  args: {
    title: 'Página',
    backTo: '/',
    showBack: true,
  },
} satisfies Meta<typeof MobileHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutBack: Story = { args: { showBack: false } }
