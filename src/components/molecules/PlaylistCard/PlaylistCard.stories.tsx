import type { Meta, StoryObj } from '@storybook/react'
import { PlaylistCard } from './PlaylistCard'

const meta = {
  title: 'Molecules/PlaylistCard',
  component: PlaylistCard,
  args: {
    name: 'Focus Beats',
    image: 'https://picsum.photos/seed/playlist/300/300',
    subtitle: 'Músicas para focar',
  },
} satisfies Meta<typeof PlaylistCard>

export default meta

type Story = StoryObj<typeof meta>

export const LinkToRoute: Story = { args: { to: '/playlist/123' } }
export const ExternalSpotify: Story = { args: { spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy' } }
