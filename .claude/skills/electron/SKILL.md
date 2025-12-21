---
name: electron
description: Expert knowledge for building cross-platform desktop applications with Electron using Chromium and Node.js, including IPC patterns, security best practices, and deployment considerations
last_updated: 2025-12-21T00:00:00Z
hash: 12251b9727b9a525
---

# Electron

Build cross-platform desktop applications using web technologies (HTML, CSS, JavaScript/TypeScript). Electron combines **Chromium** (UI rendering) with **Node.js** (system access) into a single runtime.

## Core Principles

- **Enable context isolation** - Always use `contextIsolation: true` and never set `nodeIntegration: true` in renderer processes
- **Validate IPC messages** - Treat all messages from renderer processes as untrusted; validate arguments before system actions
- **Use preload scripts** - Expose specific APIs via `contextBridge` rather than giving renderer direct Node.js access
- **Avoid main thread blocking** - Run heavy CPU tasks in Worker Threads or utility processes to prevent UI freezing
- **Sign your binaries** - Code signing is mandatory for macOS/Windows to avoid security warnings and enable auto-updates
- **Implement CSP** - Use Content Security Policy to restrict script sources and network connections
- **Lazy load modules** - Defer `require()` of heavy Node modules until needed to speed up startup
- **Plan for resource overhead** - Expect 80MB+ installer sizes and 150MB+ RAM usage per instance

## Process Architecture

Electron uses a **multi-process architecture**:

```
Main Process (Node.js + system access)
  ├── Renderer Process 1 (Chromium - isolated UI)
  ├── Renderer Process 2 (Chromium - isolated UI)
  └── Utility Processes (background workers)
```

**Main Process:**
- Entry point of the application
- Full Node.js and OS access
- Controls app lifecycle and windows
- Runs once per application

**Renderer Process:**
- Isolated Chromium instance per window
- No direct Node.js access (by design)
- Communicates with Main via IPC

## Quick Reference

### Secure Window Setup

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    contextIsolation: true,      // REQUIRED for security
    nodeIntegration: false,       // REQUIRED for security
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### IPC Communication Pattern

**Main Process (main.js):**
```javascript
const { ipcMain } = require('electron');

ipcMain.handle('read-file', async (event, filepath) => {
  // Validate input
  if (!isValidPath(filepath)) {
    throw new Error('Invalid path');
  }
  return await fs.promises.readFile(filepath, 'utf8');
});
```

**Preload Script (preload.js):**
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readFile: (filepath) => ipcRenderer.invoke('read-file', filepath)
});
```

**Renderer (index.html):**
```javascript
const content = await window.api.readFile('/path/to/file.txt');
```

## Topics

### Core APIs

- [Main Process APIs](./main-process-apis.md) - System-level APIs for app lifecycle and windows
- [Native Integration](./native-integration.md) - OS notifications, tray icons, power monitoring, auto-updates

### Security

- [Security Hardening](./security.md) - Context isolation, CSP, input validation, secure IPC patterns

### Performance

- [Optimization Strategies](./optimization.md) - Lazy loading, worker threads, startup performance

## Common Patterns

### Safe File Dialog

```javascript
// Main Process
const { dialog } = require('electron');

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});
```

### Native Menu

```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

## Constraints

- **Heavy resource footprint:** Each app bundles Chromium (~80MB+) and uses significant RAM (~150MB minimum)
- **Process isolation:** Renderer cannot access filesystem/Node.js directly; requires IPC bridge
- **Main thread sensitivity:** CPU-intensive work blocks entire UI; must use Worker Threads
- **Security hardening:** High XSS-to-RCE risk; requires manual configuration of security defaults

## Electron vs Tauri

| Feature | Electron | Tauri |
|---------|----------|-------|
| **Runtime** | Chromium + Node.js | System WebView + Rust |
| **App Size** | 80-150MB+ | 3-10MB |
| **Memory** | 150-400MB | 30-80MB |
| **Backend** | JavaScript/TypeScript | Rust |
| **Security** | Manual hardening required | Secure by default |
| **Platforms** | Windows, macOS, Linux | Windows, macOS, Linux, iOS, Android |

**Choose Electron** if you need mature ecosystem, identical cross-platform rendering, or JS-only team.
**Choose Tauri** if you need small footprint, high performance, or mobile platform support.

## Resources

- [Official Docs](https://www.electronjs.org/docs)
- [Security Tutorial](https://www.electronjs.org/docs/latest/tutorial/security)
- [GitHub](https://github.com/electron/electron)
