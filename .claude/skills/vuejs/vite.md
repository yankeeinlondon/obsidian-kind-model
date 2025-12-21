# Vite

[Vite](https://vite.dev/) is the standard bundler for Vue projects. It provides fast development server startup, instant hot module replacement (HMR), and optimized production builds.

## Why Vite for Vue

- **Instant Server Start**: No bundling during development
- **Lightning Fast HMR**: Updates in milliseconds
- **Optimized Build**: Rollup-based production builds
- **Native ESM**: Leverages modern browser capabilities
- **First-class Vue Support**: Official `@vitejs/plugin-vue`

---

## Project Setup

### Create New Project

```bash
pnpm create vite my-app --template vue-ts
cd my-app
pnpm install
pnpm dev
```

### Add to Existing Project

```bash
pnpm add -D vite @vitejs/plugin-vue
```

---

## Configuration

### Basic Configuration

Create `vite.config.ts` in project root:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

### Path Aliases

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables')
    }
  }
})
```

Update `tsconfig.json` to match:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@composables/*": ["src/composables/*"]
    }
  }
}
```

### Conditional Configuration

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    plugins: [vue()],
    define: {
      __DEV__: isDev
    },
    build: {
      sourcemap: isDev
    }
  }
})
```

---

## Dev Server Options

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true, // Expose to network
    open: true, // Open browser on start

    // API Proxy
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },

    // CORS
    cors: true,

    // HTTPS (for local dev)
    https: false
  }
})
```

---

## Build Options

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Output directory
    outDir: 'dist',

    // Generate source maps
    sourcemap: true,

    // Minification
    minify: 'esbuild', // or 'terser' for more control

    // Target browsers
    target: 'esnext', // or 'es2020', 'chrome90', etc.

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // KB

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vendor: ['lodash-es', 'axios']
        }
      }
    }
  }
})
```

---

## Environment Variables

### Defining Variables

Create `.env` files in project root:

```bash
# .env - Loaded in all cases
VITE_APP_TITLE=My App

# .env.local - Loaded in all cases, ignored by git
VITE_API_KEY=secret

# .env.development - Only in development
VITE_API_URL=http://localhost:8080

# .env.production - Only in production
VITE_API_URL=https://api.example.com
```

### Accessing Variables

```typescript
// Only VITE_ prefixed variables are exposed
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE

// Built-in variables
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const mode = import.meta.env.MODE // 'development' | 'production'
```

### TypeScript Support

Create `src/env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Using in Config

Environment variables aren't automatically available in `vite.config.ts`:

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    define: {
      'process.env.API_URL': JSON.stringify(env.VITE_API_URL)
    }
  }
})
```

---

## Common Plugins

### Auto-import

Automatically import Vue APIs and components:

```bash
pnpm add -D unplugin-auto-import unplugin-vue-components
```

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts'
    })
  ]
})
```

### Vue DevTools

```bash
pnpm add -D vite-plugin-vue-devtools
```

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools()
  ]
})
```

### SVG as Components

```bash
pnpm add -D vite-svg-loader
```

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader()
  ]
})
```

Usage:

```vue
<script setup>
import IconSearch from '@/assets/icons/search.svg'
</script>

<template>
  <IconSearch class="icon" />
</template>
```

---

## Performance Optimization

### Dependency Pre-bundling

Vite pre-bundles dependencies for faster dev server startup:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // Force include dependencies
    include: ['lodash-es', 'axios'],
    // Exclude dependencies
    exclude: ['your-local-package']
  }
})
```

### Code Splitting

```typescript
// Lazy load routes
const UserProfile = () => import('@/views/UserProfile.vue')

// Lazy load components
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
```

### Build Analysis

```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true
    })
  ]
})
```

---

## CSS Configuration

### PostCSS

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('tailwindcss')
      ]
    }
  }
})
```

### CSS Modules

```vue
<style module>
.red {
  color: red;
}
</style>

<template>
  <p :class="$style.red">Red text</p>
</template>
```

### Preprocessors

```bash
pnpm add -D sass
# or
pnpm add -D less
```

```vue
<style lang="scss">
$primary: #3498db;

.button {
  background: $primary;
}
</style>
```

---

## Common Patterns

### Base Path for Deployment

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/my-app/' // For deployment to /my-app/ subdirectory
})
```

### Multi-page Application

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
})
```

### Library Mode

For building component libraries:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: 'my-lib'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```
