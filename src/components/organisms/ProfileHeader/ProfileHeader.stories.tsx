import type { Meta, StoryObj } from '@storybook/react'
import { ProfileHeader } from './ProfileHeader'
import { Button } from '@/components/atoms'

const baseArgs = {
  name: 'Gui Bais',
  imageUrl: 'https://picsum.photos/seed/profile/256/256',
  subtitle: 'Frontend Engineer',
  stats: [
    { label: 'Followers', value: '1,234' },
    { label: 'Following', value: '321' },
    { label: 'Playlists', value: '12' },
  ],
  rightSlot: <Button size="sm" variant="secondary">Edit</Button>,
}

const meta = {
  title: 'Organisms/ProfileHeader',
  component: ProfileHeader,
  args: baseArgs,
} satisfies Meta<typeof ProfileHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = { args: { layout: 'mobile', rightSlot: undefined } }
