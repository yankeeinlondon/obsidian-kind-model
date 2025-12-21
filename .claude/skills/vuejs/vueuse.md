# VueUse

[VueUse](https://vueuse.org/) is a collection of essential Vue Composition API utilities. It provides ready-to-use composables for common tasks, reducing boilerplate and promoting consistent patterns.

## Installation

```bash
pnpm add @vueuse/core
```

## Core Philosophy

- **Tree-shakable**: Import only what you need
- **Type-safe**: Full TypeScript support
- **SSR-friendly**: Works with server-side rendering
- **Composition-first**: Designed for Composition API

---

## Categories Overview

VueUse organizes composables into logical categories:

| Category | Purpose |
|----------|---------|
| State | Global state, storage, history |
| Elements | DOM manipulation, sizing, visibility |
| Browser | Clipboard, media queries, device features |
| Sensors | Mouse, keyboard, touch, scroll |
| Network | Fetch, WebSocket, EventSource |
| Animation | Intervals, timeouts, transitions |
| Component | Template refs, lifecycle, v-model |
| Watch | Enhanced watchers with debounce/throttle |

---

## State Composables

### useLocalStorage / useSessionStorage

Reactive browser storage with automatic serialization:

```typescript
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

// Persists across page reloads
const theme = useLocalStorage('theme', 'light')
theme.value = 'dark' // Automatically saved

// Session-only storage
const sessionData = useSessionStorage('session', { user: null })

// With custom serializer
const settings = useLocalStorage('settings', defaultSettings, {
  serializer: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  }
})
```

### createGlobalState

Share state across Vue instances:

```typescript
import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useGlobalState = createGlobalState(() => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
})

// Usage in any component
const { count, increment } = useGlobalState()
```

### useRefHistory

Track value changes with undo/redo:

```typescript
import { ref } from 'vue'
import { useRefHistory } from '@vueuse/core'

const text = ref('')
const { history, undo, redo, canUndo, canRedo } = useRefHistory(text, {
  capacity: 50 // Max history entries
})

text.value = 'hello'
text.value = 'world'

undo() // text.value = 'hello'
redo() // text.value = 'world'
```

### useAsyncState

Handle async operations with loading/error states:

```typescript
import { useAsyncState } from '@vueuse/core'

const { state, isLoading, isReady, error, execute } = useAsyncState(
  async () => {
    const response = await fetch('/api/users')
    return response.json()
  },
  [], // Initial state
  {
    immediate: true, // Execute on mount
    resetOnExecute: false // Keep previous data while loading
  }
)

// Manual re-fetch
await execute()
```

---

## Element Composables

### useElementSize

Track element dimensions:

```typescript
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(el)
```

```vue
<template>
  <div ref="el">
    Size: {{ width }} x {{ height }}
  </div>
</template>
```

### useWindowSize

Track viewport dimensions:

```typescript
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

// Responsive breakpoints
const isMobile = computed(() => width.value < 768)
const isTablet = computed(() => width.value >= 768 && width.value < 1024)
const isDesktop = computed(() => width.value >= 1024)
```

### useIntersectionObserver

Detect element visibility:

```typescript
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  isVisible.value = isIntersecting
})
```

### useDraggable

Make elements draggable:

```typescript
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 100, y: 100 }
})
```

```vue
<template>
  <div ref="el" :style="style">
    Drag me! Position: {{ x }}, {{ y }}
  </div>
</template>
```

### useElementBounding

Get element position and size relative to viewport:

```typescript
import { ref } from 'vue'
import { useElementBounding } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)
```

---

## Browser Composables

### useClipboard

Reactive clipboard access:

```typescript
import { useClipboard } from '@vueuse/core'

const { text, copy, copied, isSupported } = useClipboard()

async function copyToClipboard(content: string) {
  await copy(content)
  if (copied.value) {
    console.log('Copied!')
  }
}
```

### useDark

Reactive dark mode with persistence:

```typescript
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

// Automatically syncs with system preference and localStorage
```

### useMediaQuery

Reactive media queries:

```typescript
import { useMediaQuery } from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

// Combine for responsive behavior
const showSidebar = computed(() => isLargeScreen.value)
```

### useFullscreen

Fullscreen API wrapper:

```typescript
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { isFullscreen, enter, exit, toggle } = useFullscreen(el)
```

### useTitle

Reactive document title:

```typescript
import { useTitle } from '@vueuse/core'

const title = useTitle()
title.value = 'New Page Title'

// Or with template
const title = useTitle('My App')
```

### useUrlSearchParams

Reactive URL search parameters:

```typescript
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('history') // or 'hash'

// Read
console.log(params.page) // ?page=1 -> '1'

// Write (updates URL)
params.page = '2'
```

---

## Sensor Composables

### useMouse

Track mouse position:

```typescript
import { useMouse } from '@vueuse/core'

const { x, y, sourceType } = useMouse()
// sourceType: 'mouse' | 'touch' | null
```

### useKeyStroke / useMagicKeys

Keyboard input detection:

```typescript
import { useKeyStroke, useMagicKeys } from '@vueuse/core'

// Single key
useKeyStroke('Enter', (e) => {
  console.log('Enter pressed')
})

// Magic keys - reactive key states
const { shift, ctrl, a } = useMagicKeys()

// Ctrl+A detection
watchEffect(() => {
  if (ctrl.value && a.value) {
    console.log('Ctrl+A pressed')
  }
})
```

### onClickOutside

Detect clicks outside an element:

```typescript
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const modal = ref<HTMLElement | null>(null)

onClickOutside(modal, () => {
  closeModal()
})
```

### useScroll

Track scroll position:

```typescript
import { useScroll } from '@vueuse/core'

const { x, y, isScrolling, arrivedState, directions } = useScroll(window)

// arrivedState: { top, right, bottom, left }
// directions: { top, right, bottom, left }
```

### useSwipe

Swipe gesture detection:

```typescript
import { ref } from 'vue'
import { useSwipe } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { direction, isSwiping, lengthX, lengthY } = useSwipe(el)

// direction: 'left' | 'right' | 'up' | 'down' | 'none'
```

---

## Network Composables

### useFetch

Reactive fetch with abort support:

```typescript
import { useFetch } from '@vueuse/core'

const { data, error, isFetching, abort, canAbort, execute } = useFetch(url)

// With options
const { data } = useFetch(url, {
  immediate: false, // Don't fetch on mount
  refetch: true, // Refetch when URL changes
  beforeFetch({ url, options, cancel }) {
    // Modify request
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
    return { options }
  },
  afterFetch({ data, response }) {
    // Transform response
    return { data: data.items }
  }
}).json() // Parse as JSON

// Manual trigger
await execute()
```

### useWebSocket

WebSocket client:

```typescript
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close } = useWebSocket('wss://api.example.com', {
  autoReconnect: true,
  heartbeat: {
    message: 'ping',
    interval: 30000
  },
  onConnected() {
    console.log('Connected')
  },
  onMessage(ws, event) {
    console.log('Message:', event.data)
  }
})

// Send message
send('Hello')
```

### useEventSource

Server-Sent Events:

```typescript
import { useEventSource } from '@vueuse/core'

const { data, error, status, close } = useEventSource('/api/events', [], {
  autoReconnect: true
})

// data updates automatically on each event
```

---

## Animation & Timing

### useInterval

Reactive interval:

```typescript
import { useInterval } from '@vueuse/core'

const { counter, pause, resume, isActive } = useInterval(1000, {
  immediate: true,
  callback: () => console.log('tick')
})
```

### useTimeout

Reactive timeout:

```typescript
import { useTimeout } from '@vueuse/core'

const { ready, start, stop } = useTimeout(3000, {
  immediate: false
})

start() // Start countdown
// ready.value becomes true after 3 seconds
```

### useTransition

Smooth value transitions:

```typescript
import { ref } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'

const source = ref(0)
const output = useTransition(source, {
  duration: 1000,
  transition: TransitionPresets.easeOutCubic
})

// output smoothly transitions when source changes
source.value = 100
```

### useRafFn

requestAnimationFrame wrapper:

```typescript
import { useRafFn } from '@vueuse/core'

const { pause, resume, isActive } = useRafFn(() => {
  // Called on every animation frame
  updateAnimation()
})
```

### useDebounceFn / useThrottleFn

Debounced and throttled functions:

```typescript
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// Debounce: Only executes after delay with no new calls
const debouncedSearch = useDebounceFn((term: string) => {
  search(term)
}, 300)

// Throttle: Executes at most once per interval
const throttledScroll = useThrottleFn(() => {
  updatePosition()
}, 100)
```

---

## Watch Utilities

### watchDebounced / watchThrottled

Enhanced watchers:

```typescript
import { ref } from 'vue'
import { watchDebounced, watchThrottled } from '@vueuse/core'

const search = ref('')

// Debounced watch
watchDebounced(search, (value) => {
  fetchResults(value)
}, { debounce: 300 })

// Throttled watch
watchThrottled(scroll, (value) => {
  updateUI(value)
}, { throttle: 100 })
```

### watchPausable

Pausable watcher:

```typescript
import { ref } from 'vue'
import { watchPausable } from '@vueuse/core'

const count = ref(0)

const { pause, resume, isActive } = watchPausable(count, (value) => {
  console.log('Count:', value)
})

pause() // Temporarily stop watching
// ... do something
resume() // Continue watching
```

---

## Add-on Packages

VueUse provides additional packages for specific use cases:

| Package | Purpose |
|---------|---------|
| `@vueuse/router` | Vue Router utilities |
| `@vueuse/firebase` | Firebase bindings |
| `@vueuse/rxjs` | RxJS integration |
| `@vueuse/integrations` | Third-party library wrappers |
| `@vueuse/motion` | Animation utilities |
| `@vueuse/sound` | Audio utilities |
| `@vueuse/math` | Reactive math operations |
| `@vueuse/electron` | Electron integration |

### Router Example

```typescript
import { useRouteQuery, useRouteParams } from '@vueuse/router'

// Reactive route query
const page = useRouteQuery('page', '1')
page.value = '2' // Updates URL query

// Reactive route params
const id = useRouteParams('id')
```

---

## Best Practices

### When to Use VueUse vs Custom Composables

**Use VueUse when:**

- The composable handles a common, well-defined task
- You need browser API wrappers (clipboard, storage, fullscreen)
- You want battle-tested, edge-case-handled utilities
- TypeScript support is important

**Create custom composables when:**

- Business logic is specific to your application
- You need tight integration with your state management
- VueUse doesn't cover your specific use case
- You want to avoid the dependency

### Combining Composables

```typescript
import { ref, computed } from 'vue'
import { useLocalStorage, useDark, useMediaQuery } from '@vueuse/core'

export function useTheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const savedTheme = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto')

  const isDark = computed(() => {
    if (savedTheme.value === 'auto') {
      return prefersDark.value
    }
    return savedTheme.value === 'dark'
  })

  function setTheme(theme: 'light' | 'dark' | 'auto') {
    savedTheme.value = theme
  }

  return { isDark, savedTheme, setTheme }
}
```

### SSR Considerations

Many VueUse composables access browser APIs. For SSR:

```typescript
import { useLocalStorage } from '@vueuse/core'

// Provide initial value for SSR
const theme = useLocalStorage('theme', 'light', {
  // Skip hydration mismatch warnings
  listenToStorageChanges: false
})
```

Or use `useSSRSafeId` for consistent IDs:

```typescript
import { useSSRSafeId } from '@vueuse/core'

const id = useSSRSafeId() // Consistent between server and client
```

---

## Common Patterns

### Modal with Click Outside

```typescript
import { ref } from 'vue'
import { onClickOutside, useKeyStroke } from '@vueuse/core'

export function useModal() {
  const isOpen = ref(false)
  const modalRef = ref<HTMLElement | null>(null)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  onClickOutside(modalRef, close)
  useKeyStroke('Escape', close)

  return { isOpen, modalRef, open, close }
}
```

### Infinite Scroll

```typescript
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const items = ref<Item[]>([])
const page = ref(1)

useInfiniteScroll(el, async () => {
  const newItems = await fetchItems(page.value)
  items.value.push(...newItems)
  page.value++
}, {
  distance: 100 // Pixels from bottom to trigger
})
```

### Copy to Clipboard Button

```vue
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = defineProps<{ text: string }>()
const { copy, copied } = useClipboard()
</script>

<template>
  <button @click="copy(props.text)">
    {{ copied ? 'Copied!' : 'Copy' }}
  </button>
</template>
```
