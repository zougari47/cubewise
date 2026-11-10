import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.ts so tests of plain logic do not load the
// app's server and routing plugins.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ['src/**/*.test.ts'],
    testTimeout: 30_000,
  },
})
