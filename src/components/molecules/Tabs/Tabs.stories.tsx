import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  args: {
    items: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ],
    activeId: 'a',
    onChange: () => {},
  },
  argTypes: {
    onChange: { action: 'change' },
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Underline: Story = { args: { variant: 'underline' } }
export const Block: Story = { args: { variant: 'block' } }
