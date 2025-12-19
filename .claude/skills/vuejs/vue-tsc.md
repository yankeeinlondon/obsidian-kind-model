# vue-tsc CLI and Library

[vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) is the official command-line TypeScript type-checking tool for Vue Single File Components (SFCs). It wraps TypeScript's `tsc` compiler and integrates `@vue/language-core` to process `.vue` files as valid TypeScript inputs.

## When to Use vue-tsc

- **CI/CD pipelines**: Validate types before deployment
- **Pre-commit hooks**: Catch type errors before they're committed
- **Build processes**: Ensure type safety before bundling
- **Library development**: Generate `.d.ts` declaration files for component libraries

> **Note**: Vite only performs transpilation on `.ts` files and does NOT perform type checking. Type checking should be handled by your IDE and build process using vue-tsc.

---

## Installation

```bash
pnpm add -D vue-tsc typescript
```

**Version Requirements:**
- vue-tsc >= 2.0.0 requires TypeScript >= 5.0.0
- For older TypeScript versions, use vue-tsc 0.6.x or below

---

## CLI Commands

### Type Checking (Most Common)

```bash
# Check types without emitting files
vue-tsc --noEmit

# Check with specific config
vue-tsc --noEmit -p tsconfig.app.json

# Watch mode for development
vue-tsc --noEmit --watch

# Build mode (recommended for modern projects)
vue-tsc --build --force
```

### Declaration File Generation

```bash
# Generate .d.ts files for component libraries
vue-tsc --declaration --emitDeclarationOnly

# With custom output directory
vue-tsc --declaration --emitDeclarationOnly --outDir dist/types
```

All standard TypeScript compiler options are supported and forwarded directly to the underlying `tsc` process.

---

## Package.json Scripts

### Standard Setup

```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

### Modern Setup (Vue 3.5+)

```json
{
  "scripts": {
    "type-check": "vue-tsc --build --force",
    "build": "vue-tsc --build && vite build"
  }
}
```

### Library Development

```json
{
  "scripts": {
    "build": "vite build && vue-tsc --declaration --emitDeclarationOnly",
    "type-check": "vue-tsc --noEmit"
  }
}
```

---

## How It Works

vue-tsc transforms `.vue` files into virtual TypeScript files that the TypeScript compiler can process:

```
.vue file → Vue Parser → Virtual TypeScript → Type Checker → Results
```

### Internal Architecture

1. **Configuration Resolution**: Reads `tsconfig.json` and extracts Vue-specific compiler options
2. **Global Types Setup**: Generates `__VLS_*` prefixed type helpers for Vue-specific features
3. **Virtual Code Transformation**: Transforms `.vue` files via Volar's language plugin
4. **Type Checking**: Standard TypeScript type checking on the virtual files
5. **Results**: Diagnostics printed to console with exit code 0 (success) or non-zero (errors)

---

## Integration with Vite

### Option 1: Separate Process (Recommended for CI)

Run vue-tsc alongside the Vite dev server in watch mode:

```bash
# Terminal 1
pnpm dev

# Terminal 2
vue-tsc --noEmit --watch
```

### Option 2: vite-plugin-checker (Recommended for Development)

Run type checking in a separate worker thread with browser overlay:

```bash
pnpm add -D vite-plugin-checker
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
    checker({
      vueTsc: true
    })
  ]
})
```

**Benefits:**
- Type errors displayed in browser overlay during development
- Runs in a worker thread (doesn't block dev server)
- Supports ESLint, Stylelint, and other checkers simultaneously

---

## Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

### Vue Compiler Options

Vue-specific options can be added to `tsconfig.json`:

```json
{
  "vueCompilerOptions": {
    "target": 3.5,
    "extensions": [".vue"],
    "strictTemplates": true,
    "skipTemplateCodegen": false
  }
}
```

| Option | Type | Description |
|--------|------|-------------|
| `target` | `number` | Vue language feature target version (3.3, 3.4, 3.5) |
| `extensions` | `string[]` | File extensions to treat as Vue SFCs (default: `['.vue']`) |
| `strictTemplates` | `boolean` | Enable strict template type checking |
| `skipTemplateCodegen` | `boolean` | Skip template code generation for faster checking |

---

## Declaration File Generation

When building component libraries, generate type declarations:

```bash
vue-tsc --declaration --emitDeclarationOnly --outDir dist/types
```

**Output naming convention:**
- `Component.vue` → `Component.vue.d.ts`

### Example Library tsconfig.json

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist/types",
    "rootDir": "src"
  },
  "include": ["src/**/*.vue", "src/**/*.ts"]
}
```

---

## Common Issues

### "Referenced Project may not disable emit"

This occurs when using project references with `noEmit: true`. Either:
1. Remove project references
2. Use `vue-tsc --build` instead of `vue-tsc --noEmit`

### Extension Changes Error

Vue compiler options may define custom file extensions (like `.md` or `.html`). vue-tsc automatically retries with correct extensions when this occurs.

### Performance Tips

1. **Use `skipLibCheck: true`** to skip checking declaration files in `node_modules`
2. **Narrow your `include` patterns** to only files that need checking
3. **Use `--build` mode** for incremental compilation in large projects

---

## Comparison with Other Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **vue-tsc** | CLI type checking | CI/CD, pre-commit hooks, builds |
| **@vue/language-server** | Real-time IDE checking | Editor integration via LSP |
| **@vue/typescript-plugin** | TS language service | Enhanced TypeScript integration |
| **vite-plugin-checker** | Dev server integration | Browser overlay during development |

---

## Best Practices

1. **Always run in CI/CD**: Add `vue-tsc --noEmit` to your CI pipeline
2. **Use pre-commit hooks**: Validate types before commits with tools like lint-staged
3. **Watch mode during development**: Run `vue-tsc --noEmit --watch` alongside your dev server
4. **Generate declarations for libraries**: Ship `.d.ts` files with your component libraries
5. **Keep configurations aligned**: Ensure `tsconfig.json` settings match your Vue compiler options

---

## Related Resources

- [Volar / Vue Language Tools](./volar.md) - The underlying language tooling
- [VueJS](./SKILL.md) - Core Vue.js patterns and best practices
- [Vite Configuration](./vite.md) - Bundler configuration for Vue projects
