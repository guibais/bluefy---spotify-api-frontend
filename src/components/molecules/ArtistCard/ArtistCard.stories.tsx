import type { Meta, StoryObj } from '@storybook/react'
import { ArtistCard } from './ArtistCard'
import { mockArtist } from '@/stories/mocks'
import { narrow360 } from '@/stories/decorators'

const meta = {
  title: 'Molecules/ArtistCard',
  component: ArtistCard,
  args: {
    artist: mockArtist(),
  },
  decorators: [narrow360],
} satisfies Meta<typeof ArtistCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
