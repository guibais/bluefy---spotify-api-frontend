import type { Meta, StoryObj } from '@storybook/react'
import { TrackList } from './TrackList'
import { mockTrack } from '@/stories/mocks'

const meta = {
  title: 'Organisms/TrackList',
  component: TrackList,
  args: {
    title: 'Top Tracks',
    tracks: Array.from({ length: 5 }).map((_, i) => mockTrack({ id: `trk_${i}`, track_number: i + 1 })),
    loading: false,
    showAlbum: false,
  },
} satisfies Meta<typeof TrackList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithAlbum: Story = { args: { showAlbum: true } }
export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { tracks: [] } }
