/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import path from 'path';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      '**/node_modules/**',
      'dist/**',
      '.git/**'
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/components/atoms/**/*.{ts,tsx}', 'src/components/molecules/**/*.{ts,tsx}'],
      exclude: ['**/*.test.*', 'src/**/__mocks__/**', 'src/**/index.{ts,tsx}'],
      thresholds: {
        lines: 60,
        functions: 80,
        branches: 80,
        statements: 60
      }
    }
  }
});