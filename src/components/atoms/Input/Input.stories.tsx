import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  args: {
    placeholder: 'Type here',
    fullWidth: true,
  },
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    showSearch: { control: 'boolean' },
    onClear: { action: 'clear' },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Label', placeholder: 'Search', showSearch: true },
}

export const WithError: Story = {
  args: { label: 'Email', error: 'Invalid email' },
}

export const Clearable: Story = {
  render: (args) => {
    const [value, setValue] = useState('hello')
    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        onClear={() => setValue('')}
        showSearch
        label="Search"
      />
    )
  },
}
