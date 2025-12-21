# File System Access

Modern browsers provide two distinct file system APIs: **File System Access API** (user-visible files) and **Origin Private File System (OPFS)** (sandboxed storage).

## The Two Worlds

| Feature | File System Access API | Origin Private File System (OPFS) |
|---------|------------------------|-----------------------------------|
| **Visibility** | User picks files from disk | Hidden from user, browser-managed |
| **Persistence** | Permanent (until user deletes) | Persistent (tied to origin data) |
| **Performance** | Standard disk I/O | Ultra-fast (byte-level sync access) |
| **Permission** | Explicit user prompt required | No prompts (implicit origin access) |
| **Use Case** | Text editors, IDEs, media tools | SQLite, game assets, local-first apps |

## File System Access API (Device-Level)

Allows web apps to act like desktop apps by accessing real files on the user's system.

### Browser Support (Late 2025)

| Browser | OPFS | File System Access API |
|---------|------|------------------------|
| **Chrome/Edge** | ✅ Full | ✅ Full |
| **Safari** | ✅ Full | ❌ No (pickers not implemented) |
| **Firefox** | ✅ Full | ❌ No (pickers not implemented) |

### Key Methods

```javascript
// Open file picker (read)
const [fileHandle] = await window.showOpenFilePicker({
  types: [
    {
      description: 'Text Files',
      accept: { 'text/plain': ['.txt', '.md'] }
    }
  ]
});

// Open directory picker
const dirHandle = await window.showDirectoryPicker();

// Save file picker (write)
const handle = await window.showSaveFilePicker({
  suggestedName: 'document.txt',
  types: [
    {
      description: 'Text Files',
      accept: { 'text/plain': ['.txt'] }
    }
  ]
});
```

### Reading Files

```javascript
async function openFile() {
  const [fileHandle] = await window.showOpenFilePicker();

  // Get file object
  const file = await fileHandle.getFile();

  // Read as text
  const contents = await file.text();

  // Or read as ArrayBuffer
  const buffer = await file.arrayBuffer();

  return { fileHandle, contents };
}
```

### Writing Files (Swap Strategy)

Writing uses a "swap file" strategy to prevent corruption:

1. Create writable stream
2. Write data
3. Close stream (commits changes to disk)

```javascript
async function saveFile(fileHandle, content) {
  // Create writable stream
  const writable = await fileHandle.createWritable();

  // Write data
  await writable.write(content);

  // Close/commit (REQUIRED)
  await writable.close();
}
```

### Complete Editor Example

```javascript
let currentFileHandle;

async function openTextFile() {
  try {
    [currentFileHandle] = await window.showOpenFilePicker({
      types: [{ accept: { 'text/plain': ['.txt', '.md'] } }]
    });

    const file = await currentFileHandle.getFile();
    const contents = await file.text();

    document.getElementById('editor').value = contents;
  } catch (err) {
    console.error('Open failed:', err);
  }
}

async function saveTextFile() {
  try {
    if (!currentFileHandle) {
      // First save - show save picker
      currentFileHandle = await window.showSaveFilePicker({
        suggestedName: 'document.txt'
      });
    }

    const content = document.getElementById('editor').value;
    const writable = await currentFileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    console.log('File saved successfully');
  } catch (err) {
    console.error('Save failed:', err);
  }
}

async function saveAs() {
  currentFileHandle = null; // Force new save picker
  await saveTextFile();
}
```

### Working with Directories

```javascript
async function processDirectory() {
  const dirHandle = await window.showDirectoryPicker();

  // Iterate through directory
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      console.log('File:', entry.name, file.size);
    } else if (entry.kind === 'directory') {
      console.log('Directory:', entry.name);
    }
  }

  // Create new file in directory
  const newFileHandle = await dirHandle.getFileHandle('new.txt', {
    create: true
  });

  // Create subdirectory
  const subDirHandle = await dirHandle.getDirectoryHandle('subdir', {
    create: true
  });
}
```

## Origin Private File System (OPFS)

Hidden, sandboxed, high-performance file system for web apps.

### Main Thread (Async API)

```javascript
async function useOPFS() {
  // Get root directory
  const root = await navigator.storage.getDirectory();

  // Create/get file
  const fileHandle = await root.getFileHandle('data.json', {
    create: true
  });

  // Write data
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify({ key: 'value' }));
  await writable.close();

  // Read data
  const file = await fileHandle.getFile();
  const contents = await file.text();
  console.log(JSON.parse(contents));

  // Delete file
  await root.removeEntry('data.json');
}
```

### Web Worker (Sync API for Performance)

The killer feature: synchronous read/write in workers for near-native performance.

```javascript
// worker.js
self.addEventListener('message', async (event) => {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle('database.db', {
    create: true
  });

  // Get SYNC access handle (only available in workers!)
  const accessHandle = await fileHandle.createSyncAccessHandle();

  // Synchronous operations
  const buffer = new Uint8Array([1, 2, 3, 4, 5]);

  // Write
  accessHandle.write(buffer, { at: 0 });

  // Read
  const readBuffer = new Uint8Array(5);
  accessHandle.read(readBuffer, { at: 0 });

  // Get size
  const size = accessHandle.getSize();

  // Truncate
  accessHandle.truncate(3);

  // Flush to disk
  accessHandle.flush();

  // Close handle
  accessHandle.close();

  self.postMessage({ success: true, size });
});
```

**Why Synchronous Matters**: Allows SQLite (via WebAssembly) to run at near-native speeds.

### OPFS Use Cases

#### SQLite in Browser

```javascript
// Using sql.js-httpvfs or wa-sqlite
import { SQLiteFS } from 'wa-sqlite';

const fs = new SQLiteFS(await navigator.storage.getDirectory());
const db = await openDatabase('myapp.db', fs);

// Now SQLite operations run at native speed
await db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
```

#### Large Asset Caching (Games)

```javascript
async function cacheGameAssets() {
  const root = await navigator.storage.getDirectory();
  const assetsDir = await root.getDirectoryHandle('assets', {
    create: true
  });

  // Download and cache 500MB of textures
  const response = await fetch('/assets/textures.bundle');
  const blob = await response.blob();

  const fileHandle = await assetsDir.getFileHandle('textures.bundle', {
    create: true
  });

  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();

  console.log('Assets cached persistently in OPFS');
}
```

## Security Model

### Secure Context Required

Only works on `https://` or `localhost`.

```javascript
if (window.isSecureContext) {
  // Safe to use file system APIs
}
```

### Transient Activation

File picker methods require user gesture (click, keyboard event).

```javascript
// BAD: Won't work on page load
window.onload = () => {
  window.showOpenFilePicker(); // Will throw error
};

// GOOD: Triggered by user action
button.onclick = async () => {
  await window.showOpenFilePicker(); // Works
};
```

### Permission Lifecycle

**Read Access**: Granted when picker is closed
**Write Access**: Requires secondary browser prompt

```javascript
// Check permission status
const permission = await fileHandle.queryPermission({
  mode: 'readwrite'
});

if (permission === 'granted') {
  // Can read and write
} else if (permission === 'prompt') {
  // Will prompt on next write attempt
  const newPermission = await fileHandle.requestPermission({
    mode: 'readwrite'
  });
}
```

### System Folder Blocklist

Browsers block access to sensitive folders:
- Windows: `C:\Windows`, `C:\Program Files`
- macOS: `/System`, `/Library`
- Linux: `/etc`, `/usr`, `/bin`

## Feature Detection & Fallback

```javascript
const FileSystemFeatures = {
  hasDeviceAccess() {
    return 'showOpenFilePicker' in window;
  },

  hasOPFS() {
    return 'storage' in navigator && 'getDirectory' in navigator.storage;
  },

  async saveWithFallback(content, filename = 'file.txt') {
    if (this.hasDeviceAccess()) {
      // Chromium: Direct file access
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('User cancelled');
        } else {
          throw err;
        }
      }
    } else {
      // Fallback: Blob download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
```

## Use Case Decision Matrix

| Use Case | Recommended API | Why |
|----------|-----------------|-----|
| **Text Editor** | File System Access | User picks file from disk |
| **Video Editor** | File System Access | Export to user's Movies folder |
| **Photo Compressor** | File System Access | No server upload, local processing |
| **Email Client** | OPFS | Searchable index of thousands of emails |
| **Game Assets** | OPFS | Hidden storage, prevents accidental deletion |
| **SQLite Database** | OPFS (Worker) | Synchronous API for native-speed queries |
| **Log Viewer** | File System Access | User picks specific .log file |

## Storage Quota

### OPFS Quota

Request persistent storage to prevent automatic eviction:

```javascript
async function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persisted storage: ${isPersisted}`);
  }
}

async function checkQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage;
    const quota = estimate.quota;
    const percentUsed = (usage / quota) * 100;

    console.log(`Using ${usage} of ${quota} bytes (${percentUsed.toFixed(2)}%)`);
  }
}
```

## Related

- [Progressive Web Apps](./pwa.md)
- [Web Storage](./web-storage.md)
- [File Handling API](./file-handling.md)
