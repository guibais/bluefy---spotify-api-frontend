import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta = {
  title: 'Atoms/Image',
  component: Image,
  args: {
    alt: 'Example',
    className: 'w-48 h-48 rounded-md',
  },
  argTypes: {
    fallback: { control: 'text' },
    showFallbackIcon: { control: 'boolean' },
    className: { control: 'text' },
    src: { control: 'text' },
  },
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60',
  },
}

export const WithFallbackIcon: Story = {
  args: {
    src: '',
    showFallbackIcon: true,
  },
}

export const WithFallbackText: Story = {
  args: {
    src: '',
    fallback: 'No image',
    showFallbackIcon: false,
  },
}
