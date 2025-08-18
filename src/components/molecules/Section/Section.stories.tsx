import type { Meta, StoryObj } from '@storybook/react'
import { Section } from './Section'

const meta = {
  title: 'Molecules/Section',
  component: Section,
  args: {
    title: 'Seção',
  },
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Seção',
    children: (
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-purplefy-medium-gray rounded" />
        <div className="h-16 bg-purplefy-medium-gray rounded" />
      </div>
    ),
  },
}
