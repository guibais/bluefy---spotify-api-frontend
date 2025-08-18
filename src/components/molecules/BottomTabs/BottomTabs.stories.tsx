import type { Meta, StoryObj } from '@storybook/react'
import { BottomTabs } from './BottomTabs'

const meta = {
  title: 'Molecules/BottomTabs',
  component: BottomTabs,
} satisfies Meta<typeof BottomTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
