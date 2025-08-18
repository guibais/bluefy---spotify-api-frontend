import '@testing-library/jest-dom/vitest'
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
vi.mock('@tanstack/react-devtools', () => ({
  TanstackDevtools: () => null,
}))
vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))
