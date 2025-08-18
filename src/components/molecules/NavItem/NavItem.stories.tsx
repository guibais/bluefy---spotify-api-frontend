import type { Meta, StoryObj } from '@storybook/react'
import { NavItem } from './NavItem'

const meta = {
  title: 'Molecules/NavItem',
  component: NavItem,
  args: {
    to: '/home',
    label: 'Início',
  },
} satisfies Meta<typeof NavItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
