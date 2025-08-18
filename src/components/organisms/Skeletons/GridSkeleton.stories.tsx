import type { Meta, StoryObj } from '@storybook/react'
import { GridSkeleton } from './GridSkeleton'

const meta = {
  title: 'Organisms/Skeletons/GridSkeleton',
  component: GridSkeleton,
  args: {
    count: 12,
    colsDesktop: 'grid-cols-6',
    colsMobile: 'grid-cols-2',
  },
} satisfies Meta<typeof GridSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const DenseMobile: Story = { args: { colsMobile: 'grid-cols-3' } }
