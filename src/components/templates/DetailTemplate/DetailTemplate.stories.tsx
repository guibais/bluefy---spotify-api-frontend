import type { Meta, StoryObj } from '@storybook/react'
import { DetailTemplate } from './DetailTemplate'

const meta = {
  title: 'Templates/DetailTemplate',
  component: DetailTemplate,
  args: {
    title: 'Playlist Name',
    showTabs: false
  }
} satisfies Meta<typeof DetailTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    header: (
      <div className="flex items-center gap-4">
        <div className="size-24 rounded bg-purplefy-dark/40" />
        <div>
          <div className="font-semibold text-xl">Header area</div>
          <div className="text-purplefy-light-gray">Additional details</div>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    )
  }
}

export const WithActions: Story = {
  args: {
    backTo: '/home',
    showTabs: true,
    actions: (
      <div className="flex gap-2">
        <button className="btn btn-primary">Play</button>
        <button className="btn">Shuffle</button>
      </div>
    ),
    header: (
      <div className="flex items-center gap-4">
        <div className="size-24 rounded bg-purplefy-dark/40" />
        <div>
          <div className="font-semibold text-xl">Header area</div>
          <div className="text-purplefy-light-gray">With CTA actions</div>
        </div>
      </div>
    ),
    children: (
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    )
  }
}
