import type { Meta, StoryObj } from '@storybook/react'
import { Loading } from './Loading'

const meta = {
  title: 'Atoms/Loading',
  component: Loading,
  args: {
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Loading>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const Large: Story = {
  args: { size: 'lg' },
}
