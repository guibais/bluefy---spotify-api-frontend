import type { Meta, StoryObj } from '@storybook/react'
import { AlbumCard } from './AlbumCard'
import { mockAlbum } from '@/stories/mocks'

const meta = {
  title: 'Molecules/AlbumCard',
  component: AlbumCard,
  args: {
    album: mockAlbum(),
  },
} satisfies Meta<typeof AlbumCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
