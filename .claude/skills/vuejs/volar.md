# Volar / Vue Language Tools

[Volar](https://github.com/vuejs/language-tools) is Vue's official language tooling infrastructure that provides TypeScript support, IntelliSense, and language features for Vue Single File Components (SFCs). The underlying framework, [Volar.js](https://volarjs.dev/), is a general-purpose toolkit for building language servers that support embedded languages.

## Architecture Overview

Vue Language Tools is a monorepo containing several packages that work together:

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue (Official) Extension                  │
│                    (VSCode, WebStorm, etc.)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   @vue/language-server                       │
│              (Language Server Protocol)                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    vue-tsc      │ │ @vue/typescript │ │vue-component-meta│
│  (CLI tool)     │ │    -plugin      │ │ (Metadata)       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   @vue/language-core                         │
│              (Vue SFC Processing)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Volar.js                               │
│           (Framework-Agnostic Language Tooling)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Packages

### Vue (Official) VSCode Extension

The primary entry point for most developers. Provides:

- TypeScript support in `.vue` files
- Template type checking
- Auto-completion for props, events, slots
- Go-to-definition across templates and scripts
- Refactoring support

**Install**: Search "Vue - Official" in VSCode extensions (formerly "Volar")

### @vue/language-server

The underlying LSP (Language Server Protocol) implementation that enables editor-agnostic functionality. Used by:

- VSCode (via Vue Official extension)
- Neovim (via nvim-lspconfig)
- WebStorm (built-in support)
- Vim, Sublime Text, Emacs, and others

### vue-tsc

Command-line type checking tool. See [vue-tsc documentation](./vue-tsc.md) for details.

### @vue/typescript-plugin

TypeScript LanguageService Plugin that enables Vue support within TypeScript's native compiler. Allows:

- Type checking `.vue` imports in `.ts` files
- IntelliSense for Vue component types in non-Vue files

### vue-component-meta

Extracts type information about component props, events, and slots. Used for:

- Documentation generation
- Design system tooling
- IDE integration

---

## How Volar Works

### Virtual File Transformation

Volar processes Vue SFCs by creating virtual TypeScript files:

```vue
<!-- Input: MyComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

Internally transformed to virtual TypeScript that includes:

- Script content with proper typing
- Template expressions as type-checkable code
- Prop and emit type information

### Embedded Languages

Volar excels at handling files with multiple languages:

```vue
<script setup lang="ts">    <!-- TypeScript -->
// ...
</script>

<template>                   <!-- HTML + Vue directives -->
<!-- ... -->
</template>

<style lang="scss">          <!-- CSS/SCSS/Less -->
/* ... */
</style>
```

Each section is processed by its respective language service while maintaining cross-section features like:

- Go-to-definition from template to script
- Type checking template expressions
- Auto-completion across boundaries

---

## IDE Setup

### VSCode (Recommended)

1. Install "Vue - Official" extension
2. Disable Vetur if previously installed
3. Optionally enable "Take Over Mode" for better performance

**Take Over Mode**: Disables VSCode's built-in TypeScript extension for Vue projects, letting Volar handle all TypeScript processing.

```json
// .vscode/settings.json
{
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  }
}
```

### WebStorm

Built-in support since version 2023.2. Configure under:

- Settings → Languages & Frameworks → TypeScript → Vue
- Enable "Use Volar" for TypeScript 5.0+

### Neovim

Using nvim-lspconfig:

```lua
require('lspconfig').vue_ls.setup({
  init_options = {
    vue = {
      hybridMode = false
    }
  }
})
```

> **Note**: The language server was renamed from `volar` to `vue_ls` in nvim-lspconfig.

---

## Configuration

### tsconfig.json Integration

Volar reads Vue-specific options from `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler"
  },
  "vueCompilerOptions": {
    "target": 3.5,
    "strictTemplates": true,
    "plugins": []
  }
}
```

### Vue Compiler Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `number` | `3.3` | Vue version for language features |
| `strictTemplates` | `boolean` | `false` | Strict type checking in templates |
| `extensions` | `string[]` | `[".vue"]` | File extensions to process |
| `plugins` | `array` | `[]` | Additional language plugins (Pug, etc.) |
| `skipTemplateCodegen` | `boolean` | `false` | Skip template codegen for faster checking |

### Extension Settings

Common VSCode settings:

```json
{
  // Enable/disable specific features
  "vue.inlayHints.inlineHandlerLeading": true,
  "vue.inlayHints.missingProps": true,
  "vue.autoInsert.dotValue": true,

  // Format settings
  "vue.format.template.initialIndent": true,
  "vue.format.script.initialIndent": false,
  "vue.format.style.initialIndent": false
}
```

---

## Features

### Template Type Checking

Volar provides type checking within templates:

```vue
<script setup lang="ts">
interface User {
  name: string
  age: number
}

const user = ref<User>({ name: 'Ken', age: 30 })
</script>

<template>
  <!-- Type-checked: user.value.name is string -->
  <p>{{ user.name }}</p>

  <!-- Error: 'email' doesn't exist on type User -->
  <p>{{ user.email }}</p>
</template>
```

### Prop Validation

Auto-completion and type checking for component props:

```vue
<script setup lang="ts">
// ChildComponent.vue
const props = defineProps<{
  title: string
  count?: number
}>()
</script>

<!-- ParentComponent.vue -->
<template>
  <!-- Error: 'title' is required -->
  <ChildComponent />

  <!-- Error: Type 'string' is not assignable to type 'number' -->
  <ChildComponent title="Hello" :count="'invalid'" />

  <!-- Correct -->
  <ChildComponent title="Hello" :count="42" />
</template>
```

### Event Handling

Type-safe event handlers:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  update: [id: number, value: string]
  delete: [id: number]
}>()
</script>

<!-- In parent -->
<template>
  <!-- Type-safe: (id: number, value: string) => void -->
  <MyComponent @update="(id, value) => console.log(id, value)" />
</template>
```

### Slot Typing

Type-safe scoped slots:

```vue
<script setup lang="ts">
defineSlots<{
  default(props: { item: Item; index: number }): any
  header(): any
}>()
</script>

<!-- In parent: auto-completion for slot props -->
<template>
  <MyList>
    <template #default="{ item, index }">
      {{ item.name }} - {{ index }}
    </template>
  </MyList>
</template>
```

---

## Performance

### Optimization Strategies

Volar is optimized for large codebases:

1. **Lazy Loading**: Language features loaded on-demand
2. **Incremental Updates**: Only re-processes changed files
3. **Caching**: Maintains caches for virtual file transformations
4. **Worker Threads**: Heavy operations in separate threads

### Performance Tips

1. **Enable `skipLibCheck`** in tsconfig.json
2. **Use `strictTemplates` judiciously** - can be slower in very large templates
3. **Consider Take Over Mode** in VSCode for better performance
4. **Exclude unnecessary files** in tsconfig.json

```json
{
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts"
  ]
}
```

---

## Volar.js Framework

The underlying [Volar.js](https://volarjs.dev/) framework is a general-purpose toolkit for building language servers that support embedded languages. It powers:

- **Vue Language Tools** - Vue SFCs
- **Astro** - `.astro` files
- **Svelte** - `.svelte` files
- **MDX** - Markdown with JSX

### Core Concepts

**VirtualCode**: Represents transformed source files that language services can process.

**Embedded Languages**: First-class support for files containing multiple languages.

**Language Plugins**: Extend Volar to support new file types or languages.

---

## Troubleshooting

### Common Issues

**"Cannot find module" for .vue imports**

Ensure `env.d.ts` or similar type declaration exists:

```typescript
// env.d.ts
/// <reference types="vite/client" />
```

**Template errors not showing**

1. Check `vueCompilerOptions.strictTemplates` is enabled
2. Ensure Vue extension is active (check VSCode status bar)
3. Restart the Vue language server: `Vue: Restart Vue Language Server`

**Slow performance in large projects**

1. Enable Take Over Mode
2. Add `skipLibCheck: true` to tsconfig.json
3. Check for circular dependencies

**Type errors in template don't match runtime behavior**

Vue templates have some type inference limitations. Use explicit typing:

```vue
<script setup lang="ts">
// Explicit type annotation helps Volar
const items = ref<Item[]>([])
</script>
```

### Debugging

VSCode Command Palette commands:

- `Vue: Restart Vue Language Server` - Restart the language server
- `Vue: Show Virtual Files` - View generated virtual TypeScript files
- `TypeScript: Open TS Server Log` - View TypeScript server logs

---

## Migration from Vetur

If migrating from Vetur:

1. Uninstall or disable Vetur
2. Install "Vue - Official" extension
3. Update `jsconfig.json` or `tsconfig.json` with Vue compiler options
4. Remove Vetur-specific configurations
5. Consider enabling `strictTemplates` for better type checking

---

## Related Resources

- [vue-tsc](./vue-tsc.md) - Command-line type checking
- [VueJS](./SKILL.md) - Core Vue.js patterns and best practices
- [Vite Configuration](./vite.md) - Bundler configuration
- [Volar.js Documentation](https://volarjs.dev/) - Framework documentation
