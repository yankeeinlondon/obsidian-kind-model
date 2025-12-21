# Main Process APIs

The **Main Process** is the entry point of your Electron application. It runs Node.js with full system access and controls the application lifecycle.

## Core APIs

### `app` - Application Lifecycle

Controls the overall application behavior and responds to system events.

**Key Events:**

```javascript
const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  // App is initialized, create windows
  createWindow();
});

app.on('window-all-closed', () => {
  // Quit when all windows are closed (except macOS)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Re-create window on macOS when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  // Clean up before app quits
  cleanupResources();
});
```

**Key Methods:**

```javascript
app.quit();                    // Exit the application
app.relaunch();               // Restart the application
app.getPath('userData');      // Get user data directory
app.setPath('logs', '/path'); // Override default paths
```

### `BrowserWindow` - Window Management

Creates and controls native application windows.

**Creation:**

```javascript
const { BrowserWindow } = require('electron');

const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,

  // Security settings (REQUIRED)
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  },

  // Optional settings
  title: 'My App',
  icon: path.join(__dirname, 'icon.png'),
  backgroundColor: '#ffffff',
  show: false  // Wait to show until 'ready-to-show' event
});

// Load content
win.loadFile('index.html');
// OR
win.loadURL('https://example.com');

// Show when ready (prevents flash of unstyled content)
win.once('ready-to-show', () => {
  win.show();
});
```

**Window Events:**

```javascript
win.on('closed', () => {
  // Dereference window object
  win = null;
});

win.on('resize', () => {
  const [width, height] = win.getSize();
  console.log(`Resized to ${width}x${height}`);
});

win.on('focus', () => {
  // Window gained focus
});

win.on('blur', () => {
  // Window lost focus
});
```

**Window Methods:**

```javascript
win.maximize();
win.minimize();
win.restore();
win.setFullScreen(true);
win.center();
win.setSize(width, height);
win.setPosition(x, y);
win.close();

// Dev tools
win.webContents.openDevTools();
win.webContents.closeDevTools();
```

### `ipcMain` - Inter-Process Communication

Handles asynchronous and synchronous messages from renderer processes.

**Async Two-Way (handle/invoke - PREFERRED):**

```javascript
const { ipcMain } = require('electron');

// Main Process - handle request
ipcMain.handle('my-async-action', async (event, arg1, arg2) => {
  // event.sender is the webContents that sent the message
  const result = await performAsyncOperation(arg1, arg2);
  return result;  // Automatically returned to renderer
});

// Renderer Process (via preload)
const result = await window.api.myAsyncAction(arg1, arg2);
```

**One-Way Messages (on/send):**

```javascript
// Main Process - listen
ipcMain.on('one-way-message', (event, data) => {
  console.log('Received:', data);
  // No return value expected
});

// Renderer Process (via preload)
window.api.sendOneWay(data);
```

**Broadcasting to All Windows:**

```javascript
const { BrowserWindow } = require('electron');

function broadcastMessage(channel, data) {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send(channel, data);
  });
}

broadcastMessage('update-data', { newValue: 42 });
```

### `dialog` - Native Dialogs

Opens native system dialogs for file operations and alerts.

**File/Folder Selection:**

```javascript
const { dialog } = require('electron');

// Open file(s)
const result = await dialog.showOpenDialog({
  title: 'Select a file',
  defaultPath: app.getPath('documents'),
  properties: ['openFile', 'multiSelections'],
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Videos', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'All Files', extensions: ['*'] }
  ]
});

if (!result.canceled) {
  console.log(result.filePaths);  // Array of selected file paths
}

// Save file
const saveResult = await dialog.showSaveDialog({
  title: 'Save file',
  defaultPath: 'document.txt',
  filters: [
    { name: 'Text Files', extensions: ['txt'] }
  ]
});

if (!saveResult.canceled) {
  console.log(saveResult.filePath);  // Selected save path
}
```

**Message Boxes:**

```javascript
const result = await dialog.showMessageBox({
  type: 'question',  // 'none', 'info', 'error', 'question', 'warning'
  buttons: ['Yes', 'No', 'Cancel'],
  defaultId: 0,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  detail: 'This action cannot be undone.'
});

console.log(result.response);  // Index of clicked button (0, 1, 2)
```

### `Menu` / `MenuItem` - Application Menus

Creates native application menus and context menus.

**Application Menu:**

```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => createNewFile() },
      { label: 'Open...', accelerator: 'CmdOrCtrl+O', click: () => openFile() },
      { type: 'separator' },
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
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

**Context Menu:**

```javascript
const contextMenu = Menu.buildFromTemplate([
  { label: 'Cut', role: 'cut' },
  { label: 'Copy', role: 'copy' },
  { label: 'Paste', role: 'paste' }
]);

// Show on right-click (trigger from renderer via IPC)
ipcMain.on('show-context-menu', (event) => {
  contextMenu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
});
```

### `shell` - Desktop Integration

Manages files and URLs using desktop default applications.

```javascript
const { shell } = require('electron');

// Open URL in default browser
await shell.openExternal('https://example.com');

// Open file in default application
await shell.openPath('/path/to/file.pdf');

// Show file in folder
shell.showItemInFolder('/path/to/file.txt');

// Move to trash (cross-platform)
await shell.trashItem('/path/to/file.txt');
```

### `globalShortcut` - System-Wide Shortcuts

Registers keyboard shortcuts that work even when app is not focused.

```javascript
const { app, globalShortcut } = require('electron');

app.on('ready', () => {
  // Register a 'Ctrl+X' shortcut
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    console.log('Shortcut triggered!');
  });

  if (!ret) {
    console.log('Registration failed');
  }

  // Check if registered
  console.log(globalShortcut.isRegistered('CommandOrControl+X'));
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});
```

## Best Practices

- **Validate all IPC input** - Never trust data from renderer processes
- **Use `handle/invoke` over `on/send`** - Async/await is clearer and handles errors better
- **Dereference closed windows** - Set window variables to `null` in `closed` event to prevent memory leaks
- **Handle platform differences** - macOS apps stay open when all windows close; check `process.platform`
- **Use `ready-to-show` event** - Prevents visual flash when loading content

## Related

- [Native Integration](./native-integration.md) - OS-level features
- [Security](./security.md) - Secure IPC patterns
