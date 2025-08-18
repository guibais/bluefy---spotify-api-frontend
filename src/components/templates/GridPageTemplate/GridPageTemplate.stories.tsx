import type { Meta, StoryObj } from '@storybook/react'
import { GridPageTemplate } from './GridPageTemplate'

const meta = {
  title: 'Templates/GridPageTemplate',
  component: GridPageTemplate,
  args: {
    title: 'Albums',
    description: 'Browse trending albums and new releases.'
  }
} satisfies Meta<typeof GridPageTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    )
  }
}

export const WithToolbarAndPagination: Story = {
  args: {
    showTabs: true,
    mobileShowBack: true,
    toolbar: (
      <div className="flex items-center justify-between">
        <input className="input input-bordered w-64" placeholder="Filter" />
        <div className="join">
          <button className="btn join-item">All</button>
          <button className="btn join-item">New</button>
          <button className="btn join-item">Top</button>
        </div>
      </div>
    ),
    children: (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-24 rounded bg-purplefy-dark/40" />
        ))}
      </div>
    ),
    pagination: (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button className="btn">Prev</button>
        <button className="btn">Next</button>
      </div>
    )
  }
}
