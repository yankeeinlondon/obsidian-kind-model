# UnoCSS

[UnoCSS](https://unocss.dev/) is the instant on-demand Atomic CSS engine. It's fully customizable with no core utilitiesall functionality is provided via presets.

## Why UnoCSS?

- **Blazing Fast**: 5x faster than Windi CSS or Tailwind CSS JIT (no parsing, no AST, no scanning)
- **Lightweight**: ~6kb min+brotli with zero dependencies
- **Flexible**: Fully customizable through presets
- **Framework Agnostic**: Works with Vue, React, Svelte, Astro, and more

---

## Installation

```bash
pnpm add -D unocss
```

### Vite Configuration

```typescript
// vite.config.ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})
```

### Create Configuration File

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
})
```

### Import in Entry Point

```typescript
// main.ts
import 'virtual:uno.css'
```

---

## Core Presets

### @unocss/preset-uno (Default)

The default preset provides Tailwind CSS / Windi CSS compatible utilities. This is a superset of popular utility-first frameworks.

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">
    <span class="font-bold text-lg">Hello UnoCSS</span>
    <button class="px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-50">
      Click me
    </button>
  </div>
</template>
```

### @unocss/preset-attributify

Enables attributify modewrite utilities as HTML attributes instead of class strings.

**Installation:**

```bash
pnpm add -D @unocss/preset-attributify
```

**Configuration:**

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
})
```

**Usage:**

```vue
<template>
  <!-- Instead of class="bg-blue-400 hover:bg-blue-500 text-sm text-white" -->
  <button
    bg="blue-400 hover:blue-500"
    text="sm white"
    font="mono light"
    p="y-2 x-4"
    border="~ rounded blue-200"
  >
    Attributify Button
  </button>
</template>
```

**Key Features:**

- **Prefix grouping**: Group utilities by their prefix (`text="sm white"`)
- **Self-referencing (`~`)**: `border="~"` equals `border` class
- **Valueless attributes**: `<div m-2 rounded />`
- **Conflict resolution**: Use `un-` prefix for conflicts (`un-text="red"`)

### @unocss/preset-icons

Pure CSS icons powered by [Iconify](https://iconify.design/). Supports 100+ icon collections.

**Installation:**

```bash
pnpm add -D @unocss/preset-icons
# Install specific icon collections
pnpm add -D @iconify-json/mdi @iconify-json/carbon @iconify-json/ph
```

**Configuration:**

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
```

**Usage:**

```vue
<template>
  <!-- Basic icons -->
  <div class="i-mdi-home" />
  <div class="i-carbon-sun" />
  <div class="i-ph-user-duotone" />

  <!-- With sizing and color -->
  <div class="i-mdi-heart text-red-500 text-2xl" />

  <!-- Dark mode switching -->
  <button class="i-carbon-sun dark:i-carbon-moon" />
</template>
```

**Icon Naming Pattern:**

- `i-{collection}-{icon}` (e.g., `i-mdi-home`)
- `i-{collection}:{icon}` (e.g., `i-mdi:home`)

**Browse Icons:**

- [Icônes](https://icones.js.org/) - Icon explorer with search
- [Iconify](https://icon-sets.iconify.design/) - Official icon sets browser

---

## Shortcuts

Define custom utility combinations:

```typescript
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    // Static shortcuts
    'btn': 'px-4 py-2 rounded-lg font-medium transition-colors',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',

    // Dynamic shortcuts (using regex)
    [/^btn-(.*)$/, ([, color]) => `btn bg-${color}-500 text-white hover:bg-${color}-600`],
  },
})
```

**Usage:**

```vue
<template>
  <button class="btn-primary">Primary</button>
  <button class="btn-secondary">Secondary</button>
  <button class="btn-green">Dynamic Green</button>
</template>
```

---

## Variant Groups

Group utilities with common variants using `@unocss/transformer-variant-group`:

```typescript
// uno.config.ts
import { defineConfig, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerVariantGroup()],
})
```

**Usage:**

```vue
<template>
  <!-- Instead of: hover:bg-blue-500 hover:text-white hover:font-bold -->
  <button class="hover:(bg-blue-500 text-white font-bold)">
    Hover me
  </button>

  <!-- Dark mode group -->
  <div class="dark:(bg-gray-800 text-white border-gray-700)">
    Dark mode content
  </div>
</template>
```

---

## CSS Directives

Use `@apply` directive with `@unocss/transformer-directives`:

```typescript
// uno.config.ts
import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()],
})
```

**Usage in CSS/SCSS:**

```css
.custom-button {
  @apply px-4 py-2 rounded-lg bg-blue-500 text-white;
  @apply hover:bg-blue-600 transition-colors;
}

.card {
  @apply p-6 rounded-xl shadow-lg;
  @apply dark:bg-gray-800 dark:text-white;
}
```

---

## Theme Configuration

Extend or customize the default theme:

```typescript
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      brand: '#ff6b6b',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
})
```

**Usage:**

```vue
<template>
  <div class="bg-primary-500 text-brand font-sans">
    Custom themed content
  </div>
</template>
```

---

## Rules (Custom Utilities)

Define custom utility rules:

```typescript
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    // Static rule
    ['custom-padding', { padding: '20px' }],

    // Dynamic rule with regex
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) * 4}px` })],

    // Complex rule
    [/^text-ellipsis-(\d+)$/, ([, lines]) => ({
      'display': '-webkit-box',
      '-webkit-line-clamp': lines,
      '-webkit-box-orient': 'vertical',
      'overflow': 'hidden',
    })],
  ],
})
```

---

## Safelist

Ensure specific utilities are always generated:

```typescript
// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    // Dynamic patterns
    ...Array.from({ length: 5 }, (_, i) => `opacity-${(i + 1) * 20}`),
  ],
})
```

---

## Vue Integration Best Practices

### With Attributify in Vue SFCs

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)
</script>

<template>
  <div
    flex="~ col"
    items-center
    gap-4
    p-6
    :class="{ 'bg-blue-500': isActive }"
  >
    <button
      @click="isActive = !isActive"
      bg="gray-200 hover:gray-300"
      text="gray-800"
      px-4
      py-2
      rounded
    >
      Toggle Active
    </button>
  </div>
</template>
```

### DevTools Integration

For development, enable the UnoCSS devtools:

```typescript
// main.ts (development only)
import 'virtual:uno.css'

if (import.meta.env.DEV) {
  import('virtual:unocss-devtools')
}
```

### VS Code Extension

Install the [UnoCSS VS Code extension](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) for:

- Autocomplete for utilities
- Inline preview of generated CSS
- Color decorators

---

## Common Patterns

### Responsive Design

```vue
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="p-4 sm:p-6 lg:p-8">
      Responsive padding
    </div>
  </div>
</template>
```

### Dark Mode

```vue
<template>
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    Automatic dark mode support
  </div>
</template>
```

### Conditional Classes with Vue

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const status = ref<'success' | 'error' | 'warning'>('success')

const statusClasses = computed(() => ({
  'bg-green-100 text-green-800': status.value === 'success',
  'bg-red-100 text-red-800': status.value === 'error',
  'bg-yellow-100 text-yellow-800': status.value === 'warning',
}))
</script>

<template>
  <span class="px-3 py-1 rounded-full text-sm font-medium" :class="statusClasses">
    {{ status }}
  </span>
</template>
```

---

## Related Resources

- [Official Documentation](https://unocss.dev/)
- [Interactive Playground](https://unocss.dev/play/)
- [GitHub Repository](https://github.com/unocss/unocss)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
- [Icônes - Icon Browser](https://icones.js.org/)
