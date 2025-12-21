# Optimization Strategies

Electron applications have a reputation for being resource-heavy. These optimization strategies help minimize footprint and maximize performance.

## Startup Performance

### 1. Lazy Load Heavy Modules

Don't `require()` heavy modules at startup. Load them only when needed.

**Bad (Slow Startup):**

```javascript
// main.js - loaded at app startup
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const sqlite3 = require('sqlite3');      // Heavy
const sharp = require('sharp');          // Heavy
const ffmpeg = require('fluent-ffmpeg'); // Heavy
```

**Good (Fast Startup):**

```javascript
// main.js - minimal imports at startup
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Lazy load heavy modules when needed
ipcMain.handle('process-image', async (event, imagePath) => {
  const sharp = require('sharp');  // Load only when needed
  return await sharp(imagePath).resize(800).toBuffer();
});

ipcMain.handle('process-video', async (event, videoPath) => {
  const ffmpeg = require('fluent-ffmpeg');  // Load only when needed
  return await processVideo(videoPath);
});
```

### 2. Delay Non-Critical Initialization

Show the window quickly, then initialize features in the background.

```javascript
const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', async () => {
  // 1. Create window immediately
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 2. Load UI immediately
  await mainWindow.loadFile('index.html');
  mainWindow.show();

  // 3. Initialize non-critical features in background
  setImmediate(() => {
    initializeDatabase();
    checkForUpdates();
    loadPlugins();
    warmupCache();
  });
});
```

### 3. Use `ready-to-show` Event

Prevent visual flash by showing window only when content is ready.

```javascript
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  show: false,              // Don't show immediately
  backgroundColor: '#fff'   // Set background color to match UI
});

win.loadFile('index.html');

win.once('ready-to-show', () => {
  win.show();  // Show only when content is rendered
});
```

### 4. Preload Script Optimization

Keep preload scripts minimal—they block window creation.

**Bad (Heavy Preload):**

```javascript
// preload.js - blocks window creation
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const sharp = require('sharp');

// Lots of initialization code...
const db = new sqlite3.Database('./app.db');
const config = JSON.parse(fs.readFileSync('./config.json'));

contextBridge.exposeInMainWorld('api', {
  // ...
});
```

**Good (Minimal Preload):**

```javascript
// preload.js - minimal, fast
const { contextBridge, ipcRenderer } = require('electron');

// Just expose the API bridge—no heavy initialization
contextBridge.exposeInMainWorld('api', {
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content)
  // ...
});
```

## Runtime Performance

### 5. Use Worker Threads for CPU-Intensive Tasks

Never block the main process with heavy computation—it freezes the entire UI.

**Main Process (main.js):**

```javascript
const { Worker } = require('worker_threads');
const path = require('path');

ipcMain.handle('process-large-file', async (event, filepath) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { filepath }
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
});
```

**Worker (worker.js):**

```javascript
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');

async function processFile(filepath) {
  // Heavy CPU work here
  const content = fs.readFileSync(filepath, 'utf8');
  const processed = expensiveTransformation(content);
  return processed;
}

processFile(workerData.filepath)
  .then(result => parentPort.postMessage(result))
  .catch(err => parentPort.postMessage({ error: err.message }));
```

### 6. Debounce/Throttle IPC Messages

Limit the frequency of messages sent from renderer to main.

**Renderer:**

```javascript
// Utility functions
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce search input (wait 300ms after user stops typing)
const debouncedSearch = debounce((query) => {
  window.api.search(query);
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle scroll events (max once per 100ms)
const throttledScroll = throttle((scrollPos) => {
  window.api.updateScrollPosition(scrollPos);
}, 100);

window.addEventListener('scroll', (e) => {
  throttledScroll(window.scrollY);
});
```

### 7. Offload to Renderer Where Possible

Not everything needs to go through the main process. Do lightweight processing in renderer.

**Bad (Unnecessary IPC roundtrip):**

```javascript
// Renderer asks Main to format a string (unnecessary)
const formatted = await window.api.formatText(text);
```

**Good (Do it locally):**

```javascript
// Renderer does lightweight work itself
function formatText(text) {
  return text.trim().toLowerCase();
}

const formatted = formatText(text);
```

**Only use IPC for:**
- File system operations
- System dialogs
- Native integrations
- Cross-window communication
- Operations requiring Node.js modules

## Memory Management

### 8. Limit Window Count

Each `BrowserWindow` spawns a separate Chromium instance—very expensive.

**Pattern: Window Pool**

```javascript
const windowPool = new Map();

function getOrCreateWindow(id) {
  if (windowPool.has(id)) {
    const win = windowPool.get(id);
    win.show();
    return win;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  });

  win.on('close', (event) => {
    event.preventDefault();
    win.hide();  // Hide instead of destroying
  });

  windowPool.set(id, win);
  return win;
}

// Clean up hidden windows after timeout
setInterval(() => {
  windowPool.forEach((win, id) => {
    if (!win.isVisible()) {
      win.destroy();
      windowPool.delete(id);
    }
  }, 5 * 60 * 1000);  // 5 minutes
});
```

### 9. Use BrowserView for Embedded Content

`BrowserView` is lighter than `BrowserWindow` for embedded content.

```javascript
const { BrowserView, BrowserWindow } = require('electron');

const win = new BrowserWindow({ width: 1200, height: 800 });

const view = new BrowserView({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false
  }
});

win.setBrowserView(view);
view.setBounds({ x: 0, y: 100, width: 1200, height: 700 });
view.webContents.loadURL('https://example.com');
```

### 10. Clear Cache and Data Periodically

Prevent unbounded growth of cache and storage.

```javascript
const { session } = require('electron');

// Clear cache on startup
app.on('ready', () => {
  session.defaultSession.clearCache();
});

// Clear specific data
session.defaultSession.clearStorageData({
  storages: ['cookies', 'localstorage'],
  quotas: ['temporary'],
});

// Limit cache size
app.commandLine.appendSwitch('disk-cache-size', '50000000'); // 50MB
```

## Bundle Size Optimization

### 11. Use `asar` Archives

Package app files into a single archive for faster loading.

**electron-builder (automatic):**

```json
{
  "build": {
    "asar": true
  }
}
```

**Exclude large files from asar:**

```json
{
  "build": {
    "asar": true,
    "asarUnpack": [
      "node_modules/sharp/**/*",
      "resources/videos/**/*"
    ]
  }
}
```

### 12. Exclude DevDependencies

Don't bundle development tools in production.

```json
{
  "build": {
    "files": [
      "!**/*.map",
      "!**/*.ts",
      "!node_modules/@types",
      "!node_modules/typescript"
    ]
  }
}
```

### 13. Use Native Modules Sparingly

Native modules increase bundle size and require rebuilding for Electron.

**Check if you really need it:**
- `sqlite3` → Consider `better-sqlite3` or SQL.js (WASM)
- `sharp` → Consider browser Canvas API for simple operations
- Native crypto → Use Web Crypto API where possible

**Rebuild native modules for Electron:**

```bash
npm install --save-dev electron-rebuild

# After npm install
npx electron-rebuild
```

## Renderer Optimization

### 14. Use Virtual Scrolling for Large Lists

Don't render 10,000 DOM elements—use virtualization.

**Libraries:**
- [react-window](https://github.com/bvaughn/react-window) (React)
- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) (Vue)
- [clusterize.js](https://github.com/NeXTs/Clusterize.js) (Vanilla)

**Concept:**

```javascript
// Bad: Render all 10,000 items
items.forEach(item => {
  list.appendChild(createItemElement(item));
});

// Good: Render only visible items (~20)
function renderVisibleItems(scrollTop) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + visibleCount;
  const visibleItems = items.slice(startIndex, endIndex);

  list.innerHTML = '';
  visibleItems.forEach(item => {
    list.appendChild(createItemElement(item));
  });
}
```

### 15. Avoid Memory Leaks in Renderer

Remove event listeners and clean up resources.

**Bad (Memory Leak):**

```javascript
window.api.onUpdate((data) => {
  updateUI(data);
});
// Listener is never removed—memory leak if page reloads
```

**Good (Cleanup):**

```javascript
const unsubscribe = window.api.onUpdate((data) => {
  updateUI(data);
});

// Clean up when component unmounts
window.addEventListener('beforeunload', () => {
  unsubscribe();
});
```

## Performance Monitoring

### 16. Use Chrome DevTools Performance Profiler

Electron renderer is just Chromium—use DevTools.

```javascript
// Enable DevTools
win.webContents.openDevTools();

// In renderer, profile performance
console.time('operation');
expensiveOperation();
console.timeEnd('operation');

// Or use Performance API
const start = performance.now();
expensiveOperation();
const duration = performance.now() - start;
console.log(`Took ${duration}ms`);
```

### 17. Monitor Main Process Performance

Log slow operations in main process.

```javascript
function measureAsync(name, fn) {
  return async (...args) => {
    const start = Date.now();
    try {
      return await fn(...args);
    } finally {
      const duration = Date.now() - start;
      if (duration > 100) {  // Log if > 100ms
        console.warn(`Slow operation: ${name} took ${duration}ms`);
      }
    }
  };
}

ipcMain.handle('read-file', measureAsync('read-file', async (event, path) => {
  return await fs.promises.readFile(path, 'utf8');
}));
```

## Best Practices Summary

- **Startup:** Lazy load modules, delay initialization, use `ready-to-show`
- **Runtime:** Use Worker Threads for CPU work, debounce IPC, keep windows minimal
- **Memory:** Limit window count, clear cache, avoid memory leaks
- **Bundle:** Use asar, exclude devDependencies, minimize native modules
- **Renderer:** Virtual scrolling, cleanup listeners, profile with DevTools

## Related

- [Main Process APIs](./main-process-apis.md) - Efficient API usage
- [Security](./security.md) - Security overhead considerations
