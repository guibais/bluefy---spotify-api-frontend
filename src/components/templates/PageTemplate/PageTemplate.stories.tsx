import type { Meta, StoryObj } from '@storybook/react'
import { PageTemplate } from './PageTemplate'

const meta = {
  title: 'Templates/PageTemplate',
  component: PageTemplate,
  args: {
    title: 'Discover',
    description: 'Explore curated content and playlists tailored for you.'
  }
} satisfies Meta<typeof PageTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    desktop: (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    ),
    mobile: (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    )
  }
}

export const WithToolbars: Story = {
  args: {
    showBack: true,
    showTabs: true,
    toolbarDesktop: (
      <div className="flex items-center justify-between mb-6">
        <input className="input input-bordered w-80" placeholder="Search" />
        <div className="join">
          <button className="btn join-item">Newest</button>
          <button className="btn join-item">Popular</button>
        </div>
      </div>
    ),
    toolbarMobile: (
      <div className="flex items-center gap-2 mb-4">
        <input className="input input-bordered w-full" placeholder="Search" />
        <button className="btn">Go</button>
      </div>
    ),
    desktop: (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    ),
    mobile: (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    )
  }
}
