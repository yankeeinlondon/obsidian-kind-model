---
name: electron
description: Comprehensive guide to building cross-platform desktop applications with Electron
created: 2025-12-21
last_updated: 2025-12-21T00:00:00Z
hash: dd8190a5b7438445
tags:
  - electron
  - desktop
  - cross-platform
  - chromium
  - nodejs
---

# Electron

Electron is a framework for building cross-platform desktop applications using web technologies (HTML, CSS, and JavaScript). It combines Chromium (for the UI rendering) and Node.js (for backend system access) into a single runtime, enabling developers to create native applications for Windows, macOS, and Linux from a single codebase.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core APIs](#core-apis)
  - [Main Process APIs](#main-process-apis)
  - [Native Integration APIs](#native-integration-apis)
  - [Inter-Process Communication](#inter-process-communication)
- [Development Constraints](#development-constraints)
- [Best Practices](#best-practices)
  - [Security](#security)
  - [Performance](#performance)
  - [User Experience](#user-experience)
- [Electron vs Tauri](#electron-vs-tauri)
- [Resources](#resources)

## Architecture Overview

Electron applications run two types of processes:

**Main Process**: The entry point of your application with full Node.js access. It controls the application lifecycle and manages all BrowserWindow instances.

**Renderer Process**: Each BrowserWindow runs in its own isolated renderer process, which displays the web-based UI. For security reasons, renderer processes should not have direct access to Node.js APIs.

**Preload Scripts**: Special scripts that run before the renderer process loads, bridging the gap between main and renderer processes via the `contextBridge` API.

## Core APIs

Electron's APIs are organized by the process type they're designed for. Understanding this division is essential for proper application architecture.

### Main Process APIs

These APIs are only available in the main process and provide system-level control:

**`app`** - Controls the application's event lifecycle. Key events include:

- `ready`: Fired when Electron has finished initialization
- `window-all-closed`: Fired when all windows are closed
- `quit`: Application is shutting down
- `activate`: macOS-specific event for dock icon clicks

**`BrowserWindow`** - Creates and manages native windows that host your web pages. Each window runs in its own renderer process.

```javascript
const { BrowserWindow } = require('electron');
const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false
  }
});
```

**`dialog`** - Opens native system dialogs for file operations and alerts:

- File picking (open/save dialogs)
- Alert messages
- Confirmation dialogs

**`Menu` / `MenuItem`** - Creates native application menus and context menus. These integrate with the OS menu bar on macOS and window menus on Windows/Linux.

**`shell`** - Manages files and URLs using default desktop applications:

```javascript
const { shell } = require('electron');
shell.openExternal('https://example.com'); // Opens in default browser
shell.showItemInFolder('/path/to/file'); // Shows file in file manager
```

**`globalShortcut`** - Registers keyboard shortcuts that work even when the app doesn't have focus.

### Native Integration APIs

These APIs provide deep integration with the operating system:

**`Notification`** - Triggers native OS desktop notifications with system-consistent styling.

**`Tray`** - Adds icons and menus to the system tray (Windows/Linux) or menu bar (macOS).

**`powerMonitor`** - Monitors power state changes:

- Battery status
- Sleep/resume events
- Power source changes

**`autoUpdater`** - Enables automatic application updates. Typically integrates with services like electron-updater or uses built-in Squirrel framework support.

### Inter-Process Communication

The security model requires careful IPC design:

**`ipcMain`** (Main Process) - Receives messages from renderer processes:

```javascript
const { ipcMain } = require('electron');
ipcMain.handle('read-file', async (event, filepath) => {
  // Always validate inputs from renderer
  return await fs.readFile(filepath, 'utf8');
});
```

**`ipcRenderer`** (Renderer Process) - Sends messages to main process. Should be exposed through preload script:

```javascript
// In preload.js
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  readFile: (path) => ipcRenderer.invoke('read-file', path)
});
```

## Development Constraints

Understanding Electron's constraints is crucial for architectural decisions:

### Resource Footprint

**Heavy Bundling**: Every Electron app bundles its own Chromium instance, resulting in:

- Large installer sizes (typically 80MB+ before compression)
- High baseline RAM usage (often 150MB+ for minimal apps)
- Increased disk space requirements

This is the primary trade-off for cross-platform consistency and not relying on system browsers.

### Process Isolation

**Security by Isolation**: By default, renderer processes cannot access Node.js APIs directly. You must:

1. Enable `contextIsolation: true` in webPreferences
2. Use a preload script to selectively expose APIs
3. Use `contextBridge` to create a safe API surface

This constraint prevents XSS vulnerabilities from escalating to system-level access.

### Main Thread Blocking

**UI Responsiveness**: Heavy CPU tasks in the main process will freeze the entire application UI. Solutions include:

- Worker threads for CPU-intensive operations
- Utility processes for isolated tasks
- Asynchronous operations with proper event loop management

### Security Hardening Required

**Default Configuration is Insecure**: Electron's flexibility means dangerous defaults exist for backward compatibility. You must manually:

- Disable `nodeIntegration`
- Enable `contextIsolation`
- Implement Content Security Policy
- Validate all IPC messages
- Sanitize user input

The combination of browser + system access makes Electron a high-value target for XSS-to-RCE (Remote Code Execution) attacks.

## Best Practices

### Security

**Enable Context Isolation** - Always set `contextIsolation: true` and never enable `nodeIntegration` in renderer processes:

```javascript
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

**Content Security Policy** - Define strict CSP headers to limit script sources and network connections:

```javascript
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'"]
    }
  });
});
```

**Validate IPC Messages** - Treat all renderer-originated messages as untrusted:

```javascript
ipcMain.handle('write-file', async (event, filepath, data) => {
  // Validate filepath is in allowed directory
  // Sanitize data
  // Check permissions
  // Then perform operation
});
```

### Performance

**Lazy Loading** - Avoid loading heavy Node.js modules at startup:

```javascript
// Bad: Loads immediately
const heavyModule = require('heavy-module');

// Good: Loads on demand
let heavyModule;
function getHeavyModule() {
  if (!heavyModule) {
    heavyModule = require('heavy-module');
  }
  return heavyModule;
}
```

**Window Management** - Show windows only after content is ready:

```javascript
const win = new BrowserWindow({ show: false });
win.once('ready-to-show', () => {
  win.show();
});
```

### User Experience

**Code Signing** - Sign your binaries to avoid security warnings and enable features:

- **macOS**: Required for notarization and bypassing Gatekeeper
- **Windows**: Required for SmartScreen reputation and auto-updates
- **Linux**: Recommended for package managers

Without code signing, users see "Unidentified Developer" warnings that reduce trust and adoption.

**Native Look and Feel** - Use native UI patterns where possible:

- System fonts
- Native dialogs
- OS-appropriate menu structures
- System tray/menu bar integration

## Electron vs Tauri

Tauri has emerged as a modern alternative to Electron, prioritizing performance and security:

| Feature | Electron | Tauri |
|---------|----------|-------|
| **Runtime** | Bundles Chromium + Node.js | Uses System WebView (Edge/WebKit) + Rust |
| **App Size** | Large (80MB - 150MB+) | Tiny (3MB - 10MB) |
| **Memory Usage** | High (150MB - 400MB) | Low (30MB - 80MB) |
| **Backend Language** | JavaScript / TypeScript | Rust |
| **Security Model** | Flexible (requires manual hardening) | Secure by default (isolated by design) |
| **Platform Support** | Windows, macOS, Linux | Windows, macOS, Linux, iOS, Android |
| **Rendering Consistency** | Identical across platforms | Varies by system WebView version |
| **Ecosystem Maturity** | Very mature (2013+) | Growing rapidly (2020+) |
| **Mobile Support** | No | Yes (iOS, Android) |

### When to Choose Electron

- Need identical rendering across all platforms
- Require access to Electron's mature ecosystem
- Team is JavaScript/TypeScript-only
- Need extensive Chromium-specific features
- Building complex web apps with existing web codebases

### When to Choose Tauri

- Need minimal application size
- Performance is critical
- Want to target mobile platforms
- Team comfortable with Rust
- Security is paramount
- Building new applications from scratch

**Verdict**: Electron remains the standard for JavaScript developers building cross-platform desktop apps, offering unmatched consistency and ecosystem support. Tauri is ideal for performance-critical applications where teams can leverage Rust's benefits.

## Resources

- [Official Electron Documentation](https://www.electronjs.org/docs)
- [Electron API Demos](https://github.com/electron/electron-api-demos)
- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [electron-builder](https://www.electron.build/) - Complete solution for packaging and building
- [electron-updater](https://www.electron.build/auto-update) - Auto-update implementation
- [Tauri Documentation](https://tauri.app/) - Alternative framework for comparison
