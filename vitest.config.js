import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      'server-only': fromRoot('./src/tests/mocks/server-only'),
    },
  },
  test: {
    clearMocks: true,
    restoreMocks: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['src/tests/setup'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/index.js',
        'src/tests/**',
        'src/app/robots.js',
        'src/**/*.test.{js,jsx}',
      ],
      reporter: ['text', 'html'],
    },
  },
})
