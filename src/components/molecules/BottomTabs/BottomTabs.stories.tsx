import type { Meta, StoryObj } from '@storybook/react'
import { BottomTabs } from './BottomTabs'
import { mobileFullscreen } from '@/stories/decorators'

const meta = {
  title: 'Molecules/BottomTabs',
  component: BottomTabs,
  decorators: [mobileFullscreen],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
} satisfies Meta<typeof BottomTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
