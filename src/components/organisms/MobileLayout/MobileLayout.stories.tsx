import type { Meta, StoryObj } from '@storybook/react'
import { MobileLayout } from './MobileLayout'
import { mobileFullscreen } from '@/stories/decorators'

const meta = {
  title: 'Organisms/MobileLayout',
  component: MobileLayout,
  args: {
    title: 'Home',
    backTo: '/',
    showBack: true,
    showTabs: true,
    children: (
      <div className="p-4 space-y-4">
        <div className="card p-4">Content block 1</div>
        <div className="card p-4">Content block 2</div>
        <div className="card p-4">Content block 3</div>
      </div>
    ),
  },
  decorators: [mobileFullscreen],
} satisfies Meta<typeof MobileLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoBack: Story = { args: { showBack: false } }
export const NoTabs: Story = { args: { showTabs: false } }
