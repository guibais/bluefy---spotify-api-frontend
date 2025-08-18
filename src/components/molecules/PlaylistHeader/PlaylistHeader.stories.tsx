import type { Meta, StoryObj } from '@storybook/react'
import { PlaylistHeader } from './PlaylistHeader'

const meta = {
  title: 'Molecules/PlaylistHeader',
  component: PlaylistHeader,
  args: {
    name: 'My Playlist',
    imageUrl: 'https://picsum.photos/seed/header/300/300',
    ownerName: 'Me',
    followers: 12345,
    externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
  },
} satisfies Meta<typeof PlaylistHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
