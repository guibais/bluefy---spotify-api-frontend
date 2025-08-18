import type { Meta, StoryObj } from '@storybook/react'
import { AlbumGrid } from './AlbumGrid'
import { mockAlbum } from '@/stories/mocks'

const meta = {
  title: 'Organisms/AlbumGrid',
  component: AlbumGrid,
  args: {
    albums: Array.from({ length: 8 }).map((_, i) => mockAlbum({ id: `alb_${i}` })),
    loading: false,
    hasNextPage: true,
    loadingMore: false,
  },
} satisfies Meta<typeof AlbumGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { loading: true } }
export const EmptyArtist: Story = { args: { albums: [], emptyKind: 'artist' } }
export const EmptySearch: Story = { args: { albums: [], emptyKind: 'search' } }
export const LoadingMore: Story = { args: { loadingMore: true, hasNextPage: true } }
