import type { Decorator } from '@storybook/react'

export const narrow360: Decorator = (Story) => (
  <div style={{ width: 360, margin: '0 auto', padding: 16 }}>
    <Story />
  </div>
)

export const mobileFullscreen: Decorator = (Story) => (
  <div style={{ width: 390, margin: '0 auto', minHeight: '100vh' }}>
    <Story />
  </div>
)
