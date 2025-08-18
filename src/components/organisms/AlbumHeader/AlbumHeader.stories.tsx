import type { Meta, StoryObj } from '@storybook/react'
import { AlbumHeader } from './AlbumHeader'

const baseArgs = {
  name: 'Random Access Memories',
  imageUrl: 'https://picsum.photos/seed/albumheader/512/512',
  albumType: 'album',
  artists: [
    { id: '1', name: 'Daft Punk' },
    { id: '2', name: 'Pharrell Williams' },
  ],
  year: 2013,
  tracksCount: 13,
  externalUrl: 'https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa',
}

const meta = {
  title: 'Organisms/AlbumHeader',
  component: AlbumHeader,
  args: baseArgs,
} satisfies Meta<typeof AlbumHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = { args: { layout: 'mobile' } }
