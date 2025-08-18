import type { Meta, StoryObj } from '@storybook/react'
import { SpotifyLogin } from './SpotifyLogin'

const meta = {
  title: 'Molecules/SpotifyLogin',
  component: SpotifyLogin,
  args: {
    state: 'storybook',
  },
  argTypes: {
    onLogin: { action: 'login' },
  },
} satisfies Meta<typeof SpotifyLogin>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
