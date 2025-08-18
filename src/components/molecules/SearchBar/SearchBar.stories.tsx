import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from './SearchBar'

const meta = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  args: {
    placeholder: 'Buscar artistas',
    initialValue: '',
    onSearch: () => {},
  },
  argTypes: {
    onSearch: { action: 'search' },
  },
} satisfies Meta<typeof SearchBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
