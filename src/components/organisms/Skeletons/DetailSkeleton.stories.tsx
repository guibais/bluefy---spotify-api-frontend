import type { Meta, StoryObj } from '@storybook/react'
import { DetailSkeleton } from './DetailSkeleton'

const meta = {
  title: 'Organisms/Skeletons/DetailSkeleton',
  component: DetailSkeleton,
} satisfies Meta<typeof DetailSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
