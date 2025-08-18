import type { Meta, StoryObj } from '@storybook/react'
import { PlayButton } from './PlayButton'

const meta = {
  title: 'Atoms/PlayButton',
  component: PlayButton,
  args: {
    playlistId: 'demo-playlist',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
  },
} satisfies Meta<typeof PlayButton>

export default meta

type Story = StoryObj<typeof meta>

export const PrimaryMd: Story = {
  args: { variant: 'primary', size: 'md' },
}

export const SecondarySm: Story = {
  args: { variant: 'secondary', size: 'sm' },
}

export const GhostLg: Story = {
  args: { variant: 'ghost', size: 'lg' },
}

export const Disabled: Story = {
  args: { playlistId: undefined },
}
