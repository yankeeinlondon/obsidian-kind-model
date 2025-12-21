# Progressive Web Apps (PWA)

PWAs have shifted from fragmentation to a "baseline" era where core features are universal, but advanced hardware integration remains browser-specific.

## Core PWA Architecture

### The Universal Trio

1. **Service Workers**: Offline caching, background fetch, resource management
2. **Web App Manifest**: Metadata for installation (name, icons, display mode)
3. **HTTPS**: Hard requirement (except localhost for development)

## Baseline Features (Universal Support)

These work across Chrome/Edge, Safari, and Firefox as of late 2025:

- **Service Workers**: Full lifecycle support
- **Web App Manifest**: `name`, `icons`, `start_url`, `display`, `theme_color`
- **Web Push Notifications**: Cross-browser standard (including Safari iOS 16.4+)
- **Mobile Installation**: "Add to Home Screen" functionality
- **OPFS (Origin Private File System)**: High-performance sandboxed storage
- **App Badging** (Chrome/Edge/Safari): `navigator.setAppBadge()`

## Service Worker Basics

### Registration

```javascript
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.register('/sw.js');
  console.log('Service Worker registered:', registration.scope);
}
```

### Service Worker File (sw.js)

```javascript
const CACHE_NAME = 'v1';
const CACHE_URLS = [
  '/',
  '/styles.css',
  '/script.js',
  '/offline.html'
];

// Install: Cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});
```

## Web App Manifest

### manifest.json

```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A powerful PWA example",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/icons/dashboard.png", "sizes": "96x96" }]
    }
  ]
}
```

### Link in HTML

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3b82f6">
```

## Installation

### Detect Install Prompt

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent automatic prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  document.getElementById('install-btn').style.display = 'block';
});

document.getElementById('install-btn').addEventListener('click', async () => {
  if (!deferredPrompt) return;

  // Show native install prompt
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`User choice: ${outcome}`);
  deferredPrompt = null;
});
```

### Detect Installation Status

```javascript
// Check if app is installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Running as installed PWA');
}

// Listen for app install
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
});
```

## Web Push Notifications

### Client-Side Subscription

```javascript
async function subscribeToPush() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });

  // Send subscription to server
  await fetch('/api/push-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
```

### Service Worker Push Handler

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'close', title: 'Dismiss' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
```

## Feature Comparison by Browser

| Feature | Chromium (Chrome/Edge) | Safari | Firefox |
|---------|------------------------|--------|---------|
| **Desktop Installation** | Full (standalone window) | "Add to Dock" (macOS 14+) | Experimental (Windows) |
| **File System Access API** | Full (read/write) | Partial (WritableStream) | Read-only/Hidden |
| **Web Bluetooth/USB** | ✅ Supported | ❌ Privacy concerns | ❌ Security concerns |
| **Badging API** | ✅ Supported | ✅ Supported | ❌ No |
| **App Shortcuts** | ✅ Supported | ✅ Supported | ❌ No |
| **Multi-Screen Window** | ✅ Supported | ❌ No | ❌ No |

## Browser-Specific Strategies

### Safari (Privacy-First)

- Focus: Seamless macOS/iOS integration
- 2025-2026 Roadmap: Digital Credentials API, Apple Intelligence integration
- Limitations: No Web Bluetooth/USB support

### Firefox (Taskbar Tabs)

- Focus: Privacy-first desktop experience
- "Taskbar Tabs" (Windows): Pin sites to taskbar with extensions intact
- 2026 Roadmap: Linux/macOS support for Taskbar Tabs

### Chromium (Project Fugu)

- Focus: Native-level hardware access
- Exclusive features: File System Access, Protocol Handlers, Web Bluetooth/USB
- Best for: Professional desktop PWAs (IDEs, design tools)

## Universal PWA Wrapper Pattern

```javascript
const PWA_API = {
  // Service Worker registration
  async register() {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('PWA Core active');
      return reg;
    }
  },

  // File handling with graceful degradation
  async saveFile(content, filename = 'data.txt') {
    if ('showSaveFilePicker' in window) {
      // Chromium: Direct file access
      const handle = await window.showSaveFilePicker({
        suggestedName: filename
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      // Safari/Firefox: Blob download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  // Hardware capabilities check
  canAccessHardware() {
    return {
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      systemBadging: 'setAppBadge' in navigator,
      fileSystemAccess: 'showOpenFilePicker' in window
    };
  }
};
```

## Origin Private File System (OPFS)

High-performance sandboxed storage, hidden from user.

### Main Thread (Async)

```javascript
const root = await navigator.storage.getDirectory();
const fileHandle = await root.getFileHandle('data.db', { create: true });
const file = await fileHandle.getFile();
const contents = await file.text();
```

### Web Worker (Sync for Performance)

```javascript
// Inside worker
const root = await navigator.storage.getDirectory();
const fileHandle = await root.getFileHandle('database.db', { create: true });
const accessHandle = await fileHandle.createSyncAccessHandle();

const buffer = new Uint8Array([1, 2, 3]);
accessHandle.write(buffer); // Synchronous!
accessHandle.flush();
accessHandle.close();
```

**Use Cases**:
- SQLite databases (WebAssembly)
- Game asset caching
- Email client local index
- Large file processing

## App Badging

```javascript
// Set badge
if ('setAppBadge' in navigator) {
  navigator.setAppBadge(5); // Shows "5" on app icon
}

// Clear badge
navigator.clearAppBadge();
```

**Browser Support**: Chrome/Edge/Safari (iOS/macOS)

## Best Practices

### Offline-First Strategy

1. Cache essential resources during install
2. Use cache-first for static assets
3. Use network-first for API calls with cache fallback
4. Provide meaningful offline page

### Update Strategy

```javascript
// In main app
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});

// In service worker
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### Installation UX

- Don't show install prompt immediately
- Wait for user engagement (2+ visits, meaningful interaction)
- Provide clear value proposition
- Use custom UI, not just native prompt

## Related

- [File System Access](./file-system.md)
- [Web Storage](./web-storage.md)
- [Web Push Implementation](./web-push.md)
