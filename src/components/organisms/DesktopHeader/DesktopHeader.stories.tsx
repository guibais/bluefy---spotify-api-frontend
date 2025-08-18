import type { Meta, StoryObj } from '@storybook/react'
import { DesktopHeader } from './DesktopHeader'

const meta = {
  title: 'Organisms/DesktopHeader',
  component: DesktopHeader,
  args: {
    isAuthenticated: true,
    onLogout: () => {},
  },
} satisfies Meta<typeof DesktopHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Authenticated: Story = {}
export const Guest: Story = { args: { isAuthenticated: false } }
