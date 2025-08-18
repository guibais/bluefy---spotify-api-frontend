import type { Meta, StoryObj } from '@storybook/react'
import { ArtistGrid } from './ArtistGrid'
import { mockArtist } from '@/stories/mocks'

const meta = {
  title: 'Organisms/ArtistGrid',
  component: ArtistGrid,
  args: {
    artists: Array.from({ length: 10 }).map((_, i) => mockArtist({ id: `art_${i}` })),
    loading: false,
  },
} satisfies Meta<typeof ArtistGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { artists: [] } }
