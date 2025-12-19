# Vite SSG

[Vite SSG](https://github.com/antfu-collective/vite-ssg) enables static site generation for Vue 3 applications built with Vite. It pre-renders your Vue app into static HTML files at build time, improving performance and SEO.

## Why Use SSG?

- **Faster First Paint**: Pre-rendered HTML loads instantly
- **Better SEO**: Search engines can crawl fully rendered content
- **Simpler Deployment**: Static files can be hosted anywhere (CDN, GitHub Pages, Netlify)
- **Lower Server Costs**: No Node.js server required in production

---

## Installation

```bash
pnpm add -D vite-ssg vue-router @unhead/vue
```

**Node.js 14+ required.**

Update your build script in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "preview": "vite preview"
  }
}
```

---

## Basic Setup

Replace your standard Vue entry point with the Vite SSG pattern:

```typescript
// src/main.ts
import { ViteSSG } from 'vite-ssg'
import { routes } from './router/routes'
import App from './App.vue'

// Export createApp instead of mounting directly
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  (ctx) => {
    // Install plugins here
    // ctx provides: app, router, routes, isClient, initialState
  },
)
```

### Context Object

The callback receives a context object with:

| Property | Type | Description |
|----------|------|-------------|
| `app` | `App<Element>` | Vue application instance |
| `router` | `Router` | Vue Router instance |
| `routes` | `RouteRecordRaw[]` | Route definitions |
| `isClient` | `boolean` | `true` in browser, `false` during SSG |
| `initialState` | `Record<string, any>` | Shared state between server/client |
| `onSSRAppRendered` | `(fn) => void` | Callback after SSR render completes |
| `triggerOnSSRAppRendered` | `() => Promise` | Manually trigger SSR callbacks |
| `transformState` | `(state) => any` | Custom state serialization |

---

## Plugin Installation

Install Vue plugins in the context callback:

```typescript
// src/main.ts
import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './router/routes'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient, initialState }) => {
    // Install Pinia
    const pinia = createPinia()
    app.use(pinia)

    // Hydrate Pinia state (see Initial State section)
    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
    } else {
      pinia.state.value = initialState.pinia || {}
    }

    // Install other plugins
    // app.use(i18n)
    // app.use(headPlugin)
  },
)
```

---

## Single Page Mode (No Router)

For simple apps without routing:

```bash
pnpm add -D vite-ssg @unhead/vue
# vue-router not needed
```

```typescript
// src/main.ts
import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'

export const createApp = ViteSSG(App)
```

---

## SSR Detection

Use `import.meta.env.SSR` to conditionally execute code:

```typescript
// src/composables/useAnalytics.ts
export function useAnalytics() {
  if (import.meta.env.SSR) {
    // Server-side: skip analytics
    return { track: () => {} }
  }

  // Client-side: initialize analytics
  const analytics = initAnalytics()
  return { track: analytics.track }
}
```

**Build Optimization:** Vite tree-shakes server/client-specific code:

```typescript
// This entire block is removed from client bundle
if (import.meta.env.SSR) {
  // Server-only code
}
```

---

## Document Head Management

Vite SSG includes [@unhead/vue](https://unhead.unjs.io/setup/vue) for managing document head:

```vue
<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'My Page Title',
  meta: [
    { name: 'description', content: 'Page description for SEO' },
    { property: 'og:title', content: 'Open Graph Title' },
    { property: 'og:image', content: '/og-image.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' },
  ],
})
</script>
```

### Dynamic Titles

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'

const props = defineProps<{ product: Product }>()

useHead({
  title: computed(() => `${props.product.name} | My Store`),
  meta: [
    {
      name: 'description',
      content: computed(() => props.product.description),
    },
  ],
})
</script>
```

### Template Params

Use template params for consistent formatting:

```typescript
// src/main.ts
import { createHead } from '@unhead/vue'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    const head = createHead()
    head.push({
      titleTemplate: '%s | My Site',
    })
    app.use(head)
  },
)
```

---

## Initial State

Transfer data from server to client during hydration:

```typescript
// src/main.ts
export const createApp = ViteSSG(
  App,
  { routes },
  ({ initialState }) => {
    if (import.meta.env.SSR) {
      // Server: populate initial state
      initialState.serverTime = Date.now()
      initialState.config = { apiUrl: process.env.API_URL }
    } else {
      // Client: use hydrated state
      console.log('Server time:', initialState.serverTime)
      console.log('Config:', initialState.config)
    }
  },
)
```

### With Pinia

Persist Pinia store state across SSR:

```typescript
// src/main.ts
import { createPinia } from 'pinia'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)

    if (import.meta.env.SSR) {
      // Server: serialize store state
      initialState.pinia = pinia.state.value
    } else {
      // Client: restore store state
      pinia.state.value = initialState.pinia || {}
    }
  },
)
```

### Data Fetching Pattern

Fetch data during SSG and hydrate on client:

```vue
<script setup lang="ts">
import { ref, onServerPrefetch } from 'vue'

const posts = ref<Post[]>([])

// Runs only during SSG
onServerPrefetch(async () => {
  posts.value = await fetchPosts()
})

// Fallback for client-side navigation
onMounted(async () => {
  if (posts.value.length === 0) {
    posts.value = await fetchPosts()
  }
})
</script>
```

### Custom State Serialization

Use custom serialization for complex data:

```typescript
import devalue from 'devalue'

export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => { /* ... */ },
  {
    transformState(state) {
      return import.meta.env.SSR
        ? devalue(state)  // Serialize on server
        : state           // Pass through on client
    },
  },
)
```

---

## Route Configuration

### Include/Exclude Routes

Control which routes are pre-rendered:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  ssgOptions: {
    includedRoutes(paths, routes) {
      // Exclude admin routes from SSG
      return paths.filter(path => !path.includes('/admin'))
    },
  },
})
```

### Custom Routes

Generate routes dynamically (e.g., from CMS):

```typescript
// vite.config.ts
export default defineConfig({
  ssgOptions: {
    async includedRoutes(paths, routes) {
      // Fetch dynamic routes
      const posts = await fetch('https://api.example.com/posts')
        .then(r => r.json())

      const postRoutes = posts.map(post => `/blog/${post.slug}`)

      return [...paths, ...postRoutes]
    },
  },
})
```

### Export from Entry File

Access environment variables in route generation:

```typescript
// src/main.ts
export async function includedRoutes(paths: string[]) {
  // Can access import.meta.env here
  const apiUrl = import.meta.env.VITE_API_URL

  const products = await fetch(`${apiUrl}/products`).then(r => r.json())
  const productRoutes = products.map(p => `/products/${p.id}`)

  return [...paths, ...productRoutes]
}

export const createApp = ViteSSG(/* ... */)
```

---

## Critical CSS

Automatically inline critical CSS for faster first paint:

```bash
pnpm add -D beasties
```

```typescript
// vite.config.ts
export default defineConfig({
  ssgOptions: {
    beastiesOptions: {
      // Strategy for loading non-critical CSS
      preload: 'media',  // or 'swap', 'js', 'js-lazy'
    },
  },
})
```

This extracts critical CSS and inlines it in the `<head>`, deferring non-critical CSS.

---

## ClientOnly Component

Prevent components from rendering during SSG:

```vue
<template>
  <client-only>
    <!-- Only rendered in browser -->
    <ThirdPartyWidget />

    <!-- Placeholder during SSG -->
    <template #placeholder>
      <div class="widget-skeleton">Loading widget...</div>
    </template>
  </client-only>
</template>
```

The `ClientOnly` component is globally registered automatically.

---

## Async Components and Suspense

Handle async operations during SSG:

```typescript
// src/main.ts
export const createApp = ViteSSG(
  App,
  { routes },
  ({ onSSRAppRendered, initialState }) => {
    const store = useDataStore()

    if (import.meta.env.SSR) {
      // Wait for async operations before serializing state
      onSSRAppRendered(() => {
        initialState.data = store.state
      })
    } else {
      store.state = initialState.data
    }
  },
)
```

---

## Configuration Options

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  ssgOptions: {
    // Script loading strategy: 'async' | 'defer' | 'sync'
    script: 'async',

    // Enable/disable formatting of output HTML
    formatting: 'minify',  // or 'prettify', 'none'

    // Custom routes to include
    includedRoutes: (paths, routes) => paths,

    // Critical CSS options
    beastiesOptions: {},

    // Called before each page renders
    onBeforePageRender: (route, indexHTML, appCtx) => indexHTML,

    // Called after each page renders
    onPageRendered: (route, renderedHTML, appCtx) => renderedHTML,

    // Called after all pages rendered
    onFinished: () => {},

    // Root element selector
    rootContainerId: 'app',

    // Output directory
    dirStyle: 'nested',  // or 'flat'
  },
})
```

---

## Complete Example

```typescript
// src/main.ts
import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import { routes } from './router/routes'

import './styles/main.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash }
      return { top: 0 }
    },
  },
  ({ app, router, isClient, initialState }) => {
    // Pinia
    const pinia = createPinia()
    app.use(pinia)

    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
    } else {
      pinia.state.value = initialState.pinia || {}
    }

    // Head management
    const head = createHead()
    head.push({
      titleTemplate: '%s | My Vue App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    })
    app.use(head)

    // Router guards
    router.beforeEach((to, from, next) => {
      // Navigation logic
      next()
    })
  },
)
```

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Vue()],

  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})
```

---

## Alternatives

| Tool | Use Case |
|------|----------|
| **VitePress** | Documentation sites, content-focused |
| **Nuxt** | Full-featured framework with SSR/SSG |
| **Astro** | Content sites with partial hydration |
| **vite-ssg** | Lightweight SSG for existing Vue apps |

---

## Related Resources

- [GitHub Repository](https://github.com/antfu-collective/vite-ssg)
- [npm Package](https://www.npmjs.com/package/vite-ssg)
- [@unhead/vue Documentation](https://unhead.unjs.io/setup/vue)
- [Vitesse Template](https://github.com/antfu/vitesse) - Opinionated starter using vite-ssg
