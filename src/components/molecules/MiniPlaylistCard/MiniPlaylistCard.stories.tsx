import type { Meta, StoryObj } from '@storybook/react'
import { MiniPlaylistCard } from './MiniPlaylistCard'
import { narrow360 } from '@/stories/decorators'

const meta = {
  title: 'Molecules/MiniPlaylistCard',
  component: MiniPlaylistCard,
  args: {
    id: '1',
    name: 'Daily Mix',
    imageUrl: 'https://picsum.photos/seed/miniplay/300/300',
    tracksCount: 24,
    externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1E4sYVZrM4q6YG',
  },
  decorators: [narrow360],
} satisfies Meta<typeof MiniPlaylistCard>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = { args: { size: 'desktop' } }
export const Mobile: Story = { args: { size: 'mobile' } }
