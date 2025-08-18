import type { Meta, StoryObj } from '@storybook/react'
import { LanguageSelector } from './LanguageSelector'

const meta = {
  title: 'Molecules/LanguageSelector',
  component: LanguageSelector,
  args: {
    size: 'md',
  },
} satisfies Meta<typeof LanguageSelector>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
