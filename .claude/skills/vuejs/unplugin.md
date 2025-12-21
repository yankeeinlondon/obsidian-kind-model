# UnPlugins for Vue

The [unplugin](https://unplugin.unjs.io/) ecosystem provides a unified plugin system that works across multiple bundlers (Vite, Webpack, Rollup, esbuild, Rspack). For Vue projects, several key unplugins dramatically improve developer experience.

## Core UnPlugins

1. [unplugin-vue-router](#unplugin-vue-router) - File-based routing with TypeScript
2. [unplugin-vue-components](#unplugin-vue-components) - Auto-import components
3. [unplugin-vue-macros](#unplugin-vue-macros) - Extended compiler macros
4. [unplugin-auto-import](#unplugin-auto-import) - Auto-import APIs

---

## unplugin-vue-router

[unplugin-vue-router](https://uvr.esm.is/) provides file-based routing for Vue 3 with full TypeScript support. Routes are automatically generated based on your file structure.

### Installation

```bash
pnpm add -D unplugin-vue-router
pnpm add vue-router
```

### Vite Configuration

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // VueRouter MUST come before Vue
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    Vue(),
  ],
})
```

### TypeScript Setup

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler"
  },
  "include": [
    "src/typed-router.d.ts"
  ]
}
```

Add to `env.d.ts`:

```typescript
/// <reference types="unplugin-vue-router/client" />
```

### Router Setup

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

### File-Based Routing Conventions

Place Vue components in `src/pages/`:

| File Path | Route Path | Route Name |
|-----------|------------|------------|
| `pages/index.vue` | `/` | `/` |
| `pages/about.vue` | `/about` | `/about` |
| `pages/users/index.vue` | `/users` | `/users` |
| `pages/users/[id].vue` | `/users/:id` | `/users/[id]` |
| `pages/posts/[...slug].vue` | `/posts/:slug(.*)` | `/posts/[...slug]` |
| `pages/[[optional]].vue` | `/:optional?` | `/[[optional]]` |

### Dynamic Parameters

```vue
<!-- pages/users/[id].vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute('/users/[id]')  // Typed route!
console.log(route.params.id)  // string, fully typed
</script>

<template>
  <div>User ID: {{ $route.params.id }}</div>
</template>
```

### Catch-All Routes

```vue
<!-- pages/[...path].vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute('/[...path]')
console.log(route.params.path)  // string[]
</script>
```

### Nested Routes

Create nested layouts with parent folders:

```
pages/
├── users/
│   ├── index.vue        # /users
│   ├── [id].vue         # /users/:id
│   └── [id]/
│       ├── profile.vue  # /users/:id/profile
│       └── settings.vue # /users/:id/settings
└── users.vue            # Layout for all /users/* routes
```

### definePage Macro

Extend route configuration directly in components:

```vue
<script setup lang="ts">
definePage({
  name: 'user-profile',
  meta: {
    requiresAuth: true,
    title: 'User Profile',
  },
})
</script>
```

### Type-Safe Navigation

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()

// Fully typed - IDE autocomplete for route names and params
router.push({ name: '/users/[id]', params: { id: '123' } })

// Type error if params don't match!
// router.push({ name: '/users/[id]', params: { wrong: '123' } })
```

---

## unplugin-vue-components

[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) automatically imports Vue components on-demand. No more manual import statements!

### Installation

```bash
pnpm add -D unplugin-vue-components
```

### Vite Configuration

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      // Folders to scan for components
      dirs: ['src/components'],

      // Valid file extensions
      extensions: ['vue'],

      // Generate TypeScript declaration file
      dts: 'src/components.d.ts',

      // Allow subdirectories as namespace prefix
      directoryAsNamespace: true,

      // Collapse same-name folder/file
      collapseSamePrefixes: true,
    }),
  ],
})
```

### How It Works

Components in `src/components/` are automatically available:

```
src/components/
├── Button.vue           → <Button />
├── Card.vue             → <Card />
├── icons/
│   ├── IconHome.vue     → <IconHome /> or <IconsIconHome />
│   └── IconUser.vue     → <IconUser /> or <IconsIconUser />
└── forms/
    ├── Input.vue        → <FormsInput />
    └── Select.vue       → <FormsSelect />
```

### Using Components

```vue
<script setup lang="ts">
// No imports needed!
</script>

<template>
  <Card>
    <Button>Click me</Button>
    <IconHome />
  </Card>
</template>
```

### UI Library Resolvers

Auto-import components from popular UI libraries:

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver,
  NaiveUiResolver,
  VuetifyResolver,
  AntDesignVueResolver,
  VantResolver,
  QuasarResolver,
} from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        // Choose your UI library
        ElementPlusResolver(),
        // NaiveUiResolver(),
        // VuetifyResolver(),
        // AntDesignVueResolver(),
      ],
    }),
  ],
})
```

### Custom Resolvers

Create resolvers for custom component libraries:

```typescript
// vite.config.ts
Components({
  resolvers: [
    // Custom resolver function
    (componentName) => {
      if (componentName.startsWith('My')) {
        return {
          name: componentName,
          from: '@my-lib/components',
        }
      }
    },
  ],
})
```

### Directives Auto-Import

Auto-import Vue directives (Vue 3 only):

```typescript
Components({
  directives: true,
  resolvers: [
    // Resolver that handles directives
  ],
})
```

---

## unplugin-vue-macros

[Vue Macros](https://vue-macros.dev/) extends Vue's compiler macros with additional syntax sugar and features. Supports Vue 2.7 and Vue 3.

### Installation

```bash
pnpm add -D unplugin-vue-macros
```

### Vite Configuration

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
  ],
})
```

### Key Macros

#### defineOptions

Declare component options without a separate `<script>` block:

```vue
<script setup lang="ts">
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false,
})
</script>
```

#### defineSlots (Enhanced)

Type-safe slot definitions:

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { item: Item }): any
  header(props: { title: string }): any
}>()
</script>
```

#### defineModels

Simplified two-way binding for multiple v-models:

```vue
<script setup lang="ts">
const { modelValue, count } = defineModels<{
  modelValue: string
  count: number
}>()

// Use directly
modelValue.value = 'new value'
count.value++
</script>
```

#### shortVmodel

Shorter v-model syntax:

```vue
<template>
  <!-- Instead of v-model:value -->
  <input ::value="inputValue" />

  <!-- Instead of v-model -->
  <input ::="inputValue" />
</template>
```

#### defineProps Destructuring

Destructure props with reactivity preserved:

```vue
<script setup lang="ts">
// With defaults and reactivity
const { name = 'default', count = 0 } = defineProps<{
  name?: string
  count?: number
}>()
</script>
```

#### hoistStatic

Automatically hoist static expressions:

```vue
<script setup lang="ts">
// This will be hoisted outside the component
const CONFIG = {
  api: 'https://api.example.com',
  timeout: 5000,
}
</script>
```

### All Available Macros

**Stable:**
- `defineOptions` - Component options
- `defineSlots` - Typed slots
- `shortEmits` - Abbreviated emit syntax
- `defineModels` - Multiple v-model bindings
- `defineProps` - Enhanced prop destructuring
- `shortVmodel` - Short v-model syntax

**Experimental:**
- `defineProp` - Individual prop definition
- `defineEmit` - Single emit definition
- `setupComponent` / `setupSFC` - Alternative setup patterns
- `chainCall` - Method chaining

---

## unplugin-auto-import

[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) automatically imports APIs from Vue, Vue Router, VueUse, and more.

### Installation

```bash
pnpm add -D unplugin-auto-import
```

### Vite Configuration

```typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        // Use VueRouterAutoImports when using unplugin-vue-router
        VueRouterAutoImports,
        // Or standard vue-router
        // 'vue-router',
        '@vueuse/core',
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables/**',
        'src/stores/**',
      ],
      vueTemplate: true,  // Enable auto-import in templates
    }),
  ],
})
```

### How It Works

APIs are automatically available without imports:

```vue
<script setup lang="ts">
// No imports needed!

// Vue APIs
const count = ref(0)
const doubled = computed(() => count.value * 2)

// VueUse
const { x, y } = useMouse()

// Vue Router
const router = useRouter()
const route = useRoute()

// Your composables from src/composables/
const { data } = useFetch('/api/data')
</script>
```

### Custom Composables

Auto-import your own composables:

```typescript
AutoImport({
  dirs: [
    'src/composables',
    'src/composables/**/use*.ts',  // Only files starting with 'use'
  ],
})
```

---

## Complete Setup Example

A complete Vite config with all unplugins:

```typescript
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // VueRouter must come before Vue
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),

    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),

    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
    }),

    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/**'],
      vueTemplate: true,
    }),
  ],
})
```

### Generated Type Files

Add to `.gitignore`:

```gitignore
# Auto-generated type declarations
src/typed-router.d.ts
src/components.d.ts
src/auto-imports.d.ts
```

Add to `tsconfig.json`:

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.vue",
    "src/typed-router.d.ts",
    "src/components.d.ts",
    "src/auto-imports.d.ts"
  ]
}
```

---

## Related Resources

- [unplugin-vue-router Docs](https://uvr.esm.is/)
- [unplugin-vue-components GitHub](https://github.com/unplugin/unplugin-vue-components)
- [Vue Macros Docs](https://vue-macros.dev/)
- [unplugin-auto-import GitHub](https://github.com/unplugin/unplugin-auto-import)
- [unplugin Ecosystem](https://unplugin.unjs.io/)
