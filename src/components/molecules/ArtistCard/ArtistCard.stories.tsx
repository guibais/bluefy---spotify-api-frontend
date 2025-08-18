import type { Meta, StoryObj } from '@storybook/react'
import { ArtistCard } from './ArtistCard'
import { mockArtist } from '@/stories/mocks'

const meta = {
  title: 'Molecules/ArtistCard',
  component: ArtistCard,
  args: {
    artist: mockArtist(),
  },
} satisfies Meta<typeof ArtistCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
