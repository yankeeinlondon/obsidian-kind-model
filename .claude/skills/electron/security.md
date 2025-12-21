# Security

Electron combines a web browser (Chromium) with system-level access (Node.js), creating a high-risk target for XSS-to-RCE (Cross-Site Scripting to Remote Code Execution) attacks. Proper security hardening is **mandatory** for production applications.

## Core Security Principles

### 1. Enable Context Isolation

**ALWAYS** enable context isolation to prevent renderer processes from accessing Node.js internals.

**Bad (NEVER do this):**

```javascript
// DON'T - Direct Node.js access in renderer
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,        // DANGEROUS
    contextIsolation: false       // DANGEROUS
  }
});
```

**Good (DO this):**

```javascript
// DO - Isolated renderer with controlled bridge
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,       // REQUIRED
    nodeIntegration: false,       // REQUIRED
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### 2. Use Preload Scripts with Context Bridge

Expose **only** the specific APIs your renderer needs via `contextBridge`.

**Preload Script Pattern:**

```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose controlled API to renderer
contextBridge.exposeInMainWorld('api', {
  // Safe: specific, validated functions
  readFile: (filepath) => ipcRenderer.invoke('read-file', filepath),
  writeFile: (filepath, content) => ipcRenderer.invoke('write-file', filepath, content),

  // Safe: one-way events from main to renderer
  onUpdate: (callback) => {
    ipcRenderer.on('update', (event, data) => callback(data));
  },

  // NEVER expose these:
  // require: require,              // DON'T
  // process: process,              // DON'T
  // ipcRenderer: ipcRenderer       // DON'T
});
```

**Renderer Usage:**

```javascript
// Renderer can only use the exposed API
const content = await window.api.readFile('/path/to/file.txt');
await window.api.writeFile('/path/to/file.txt', 'new content');

window.api.onUpdate((data) => {
  console.log('Update received:', data);
});
```

### 3. Validate All IPC Input

**NEVER** trust data from renderer processes. Always validate before performing system operations.

**Bad (Vulnerable to path traversal):**

```javascript
// DON'T - Direct file access without validation
ipcMain.handle('read-file', async (event, filepath) => {
  return await fs.promises.readFile(filepath, 'utf8');  // DANGEROUS
});
```

**Good (Validated and sandboxed):**

```javascript
const path = require('path');
const fs = require('fs').promises;

const ALLOWED_DIR = app.getPath('userData');

ipcMain.handle('read-file', async (event, filepath) => {
  // 1. Resolve to absolute path
  const absolutePath = path.resolve(ALLOWED_DIR, filepath);

  // 2. Ensure path is within allowed directory (prevent path traversal)
  if (!absolutePath.startsWith(ALLOWED_DIR)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  // 3. Check file exists and is a file (not directory)
  const stats = await fs.stat(absolutePath);
  if (!stats.isFile()) {
    throw new Error('Not a file');
  }

  // 4. Limit file size (prevent memory exhaustion)
  if (stats.size > 10 * 1024 * 1024) {  // 10MB limit
    throw new Error('File too large');
  }

  // 5. Read file
  return await fs.readFile(absolutePath, 'utf8');
});
```

**Validation Checklist:**

- [ ] Resolve relative paths to absolute paths
- [ ] Check path is within allowed directory (prevent path traversal)
- [ ] Verify file type (file vs directory)
- [ ] Limit file sizes (prevent memory exhaustion)
- [ ] Whitelist allowed extensions if applicable
- [ ] Sanitize input (remove null bytes, special characters)

### 4. Implement Content Security Policy

Use CSP headers to restrict where your renderer can load resources from.

**HTML Meta Tag:**

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self' data:;
               connect-src 'self' https://api.example.com">
```

**Via Electron Session:**

```javascript
const { session } = require('electron');

app.on('ready', () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        ]
      }
    });
  });
});
```

**Strict CSP Example:**

```
default-src 'none';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' https://api.example.com;
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

### 5. Disable or Sandbox Remote Content

If you must load remote content, enable sandbox mode.

**Loading Remote URLs:**

```javascript
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,              // Enable sandbox for remote content
    preload: path.join(__dirname, 'preload.js')
  }
});

// Load remote content
win.loadURL('https://example.com');
```

**Partition Sessions (isolate storage):**

```javascript
const win = new BrowserWindow({
  webPreferences: {
    partition: 'persist:myapp'  // Separate cookies/localStorage
  }
});
```

### 6. Handle Navigation Securely

Prevent navigation to untrusted URLs.

**Whitelist Navigation:**

```javascript
const { shell } = require('electron');

win.webContents.on('will-navigate', (event, url) => {
  const allowedHosts = ['example.com', 'api.example.com'];
  const urlObj = new URL(url);

  if (!allowedHosts.includes(urlObj.hostname)) {
    event.preventDefault();
    console.warn('Blocked navigation to:', url);
  }
});

// Open external links in browser (not in app)
win.webContents.setWindowOpenHandler(({ url }) => {
  shell.openExternal(url);
  return { action: 'deny' };  // Don't open new window
});
```

### 7. Disable Insecure Features

Turn off features that could be exploited.

**Secure WebPreferences:**

```javascript
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,           // REQUIRED
    nodeIntegration: false,           // REQUIRED
    nodeIntegrationInWorker: false,   // REQUIRED
    nodeIntegrationInSubFrames: false,// REQUIRED
    sandbox: true,                    // Recommended for remote content
    webSecurity: true,                // Enforce same-origin policy
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
    enableBlinkFeatures: '',          // Don't enable risky features
    disableBlinkFeatures: 'Auxclick', // Disable unnecessary features
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### 8. Use Protocol Handlers Safely

Don't pass untrusted URLs to dangerous protocols.

**Validate Custom Protocols:**

```javascript
app.on('open-url', (event, url) => {
  event.preventDefault();

  const urlObj = new URL(url);

  // Validate protocol
  if (urlObj.protocol !== 'myapp:') {
    console.warn('Invalid protocol:', url);
    return;
  }

  // Validate host/pathname
  const allowedActions = ['open', 'view', 'edit'];
  if (!allowedActions.includes(urlObj.host)) {
    console.warn('Invalid action:', url);
    return;
  }

  // Process safely
  handleProtocolAction(urlObj);
});
```

### 9. Sanitize User Input in Dialogs

Prevent XSS in dialog messages that display user-controlled content.

**Bad (XSS vulnerable):**

```javascript
// DON'T - User input directly in dialog
dialog.showMessageBox({
  message: userInput  // DANGEROUS if contains HTML/scripts
});
```

**Good (Sanitized):**

```javascript
// DO - Strip HTML and limit length
function sanitizeForDialog(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 500);
}

dialog.showMessageBox({
  message: sanitizeForDialog(userInput)
});
```

### 10. Keep Electron Updated

Security vulnerabilities are discovered regularly. Keep Electron updated to get patches.

```bash
# Check current version
npm list electron

# Update Electron
npm install electron@latest --save-dev
```

**Subscribe to security announcements:**
- [Electron Releases](https://github.com/electron/electron/releases)
- [Security Advisories](https://github.com/electron/electron/security/advisories)

## Security Checklist

Before deploying to production:

- [ ] `contextIsolation: true` enabled
- [ ] `nodeIntegration: false` set
- [ ] `nodeIntegrationInWorker: false` set
- [ ] `nodeIntegrationInSubFrames: false` set
- [ ] Preload script uses `contextBridge` to expose minimal API
- [ ] All IPC handlers validate input (path traversal, type checking, limits)
- [ ] Content Security Policy implemented
- [ ] Navigation is restricted (`will-navigate` handler)
- [ ] External links open in browser, not new windows
- [ ] `webSecurity: true` enforced
- [ ] `allowRunningInsecureContent: false` set
- [ ] Remote content uses `sandbox: true`
- [ ] Electron version is up to date
- [ ] Application is code-signed (macOS/Windows)
- [ ] Dependencies are audited (`npm audit`)

## Common Attack Vectors

### XSS to RCE

If renderer has Node.js access and loads untrusted content:

```javascript
// Attacker injects script:
<script>
  require('child_process').exec('rm -rf ~/*');
</script>
```

**Prevention:** Context isolation + no node integration

### Path Traversal

If IPC handler doesn't validate paths:

```javascript
// Attacker sends:
window.api.readFile('../../../etc/passwd');
```

**Prevention:** Validate and sandbox all file paths

### Prototype Pollution

If IPC handler doesn't validate object structure:

```javascript
// Attacker sends:
window.api.updateConfig({ __proto__: { isAdmin: true } });
```

**Prevention:** Validate input types and structure; avoid directly merging objects

### Command Injection

If IPC handler passes user input to shell commands:

```javascript
// Attacker sends:
window.api.runCommand('test; rm -rf ~/*');
```

**Prevention:** Never use `exec` with user input; use `spawn` with argument array

## Resources

- [Electron Security Tutorial](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security#checklist-security-recommendations)
- [OWASP Electron Security](https://owasp.org/www-community/vulnerabilities/Electron_Security)

## Related

- [Main Process APIs](./main-process-apis.md) - Secure IPC patterns
- [Native Integration](./native-integration.md) - Permission handling
