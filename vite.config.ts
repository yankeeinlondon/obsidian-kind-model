/// <reference types="vitest" />
import { defineConfig } from 'vite'
import Markdown from './src'

// used for testing, library code uses TSUP to build exports
export default defineConfig({
  test: {
    dir: 'tests',
    exclude: ['**/*.spec.ts'],
    environment: 'happy-dom',
    api: {
      host: '0.0.0.0',
    },
  },
  plugins: [

    // Markdown(),
  ],
})
