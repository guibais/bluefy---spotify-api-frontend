import type { Meta, StoryObj } from '@storybook/react'
import { ArtistHeader } from './ArtistHeader'

const baseArgs = {
  name: 'Daft Punk',
  imageUrl: 'https://picsum.photos/seed/artistheader/512/512',
  followers: 1234567,
  popularity: 85,
  genres: ['electronic', 'house', 'disco'],
  externalUrl: 'https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi',
}

const meta = {
  title: 'Organisms/ArtistHeader',
  component: ArtistHeader,
  args: baseArgs,
} satisfies Meta<typeof ArtistHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = { args: { layout: 'mobile' } }
