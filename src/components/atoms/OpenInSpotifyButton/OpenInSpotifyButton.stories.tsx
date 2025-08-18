import type { Meta, StoryObj } from '@storybook/react'
import { OpenInSpotifyButton } from './OpenInSpotifyButton'

const meta = {
  title: 'Atoms/OpenInSpotifyButton',
  component: OpenInSpotifyButton,
  args: {
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md'] },
    iconOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof OpenInSpotifyButton>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const IconOnly: Story = {
  args: { iconOnly: true, ariaLabel: 'Open in Spotify' },
}
