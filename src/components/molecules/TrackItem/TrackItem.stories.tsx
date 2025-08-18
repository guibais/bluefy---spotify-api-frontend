import type { Meta, StoryObj } from '@storybook/react'
import { TrackItem } from './TrackItem'
import { mockTrack } from '@/stories/mocks'

const meta = {
  title: 'Molecules/TrackItem',
  component: TrackItem,
  args: {
    track: mockTrack(),
    index: 0,
  },
} satisfies Meta<typeof TrackItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithAlbum: Story = { args: { showAlbum: true } }
