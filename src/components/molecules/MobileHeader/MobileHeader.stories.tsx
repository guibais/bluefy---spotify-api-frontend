import type { Meta, StoryObj } from '@storybook/react'
import { MobileHeader } from './MobileHeader'
import { mobileFullscreen } from '@/stories/decorators'

const meta = {
  title: 'Molecules/MobileHeader',
  component: MobileHeader,
  args: {
    title: 'Página',
    backTo: '/',
    showBack: true,
  },
  decorators: [mobileFullscreen],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
} satisfies Meta<typeof MobileHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutBack: Story = { args: { showBack: false } }
