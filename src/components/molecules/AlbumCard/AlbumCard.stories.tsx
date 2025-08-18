import type { Meta, StoryObj } from '@storybook/react'
import { AlbumCard } from './AlbumCard'
import { mockAlbum } from '@/stories/mocks'
import { narrow360 } from '@/stories/decorators'

const meta = {
  title: 'Molecules/AlbumCard',
  component: AlbumCard,
  args: {
    album: mockAlbum(),
  },
  decorators: [narrow360],
} satisfies Meta<typeof AlbumCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
