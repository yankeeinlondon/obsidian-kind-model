# Native Integration

Electron provides APIs for deep integration with the operating system, including notifications, system tray, power monitoring, and automatic updates.

## Notifications

Display native desktop notifications using the OS notification system.

**Basic Notification:**

```javascript
const { Notification } = require('electron');

function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, 'icon.png')  // Optional
  }).show();
}

showNotification('Update Available', 'A new version is ready to install.');
```

**With Actions (macOS):**

```javascript
const notification = new Notification({
  title: 'Meeting Reminder',
  body: 'Your meeting starts in 5 minutes',
  actions: [
    { type: 'button', text: 'Dismiss' },
    { type: 'button', text: 'Snooze' }
  ]
});

notification.on('action', (event, index) => {
  if (index === 0) {
    // Dismiss clicked
  } else if (index === 1) {
    // Snooze clicked
  }
});

notification.on('click', () => {
  // Notification body clicked
  mainWindow.show();
});

notification.show();
```

**Check Permission:**

```javascript
if (Notification.isSupported()) {
  console.log('Notifications are supported');
}
```

## System Tray

Add icons and menus to the system notification area (Windows/Linux) or menu bar (macOS).

**Basic Tray:**

```javascript
const { app, Tray, Menu } = require('electron');

let tray = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Settings', click: () => openSettings() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('My Application');
  tray.setContextMenu(contextMenu);

  // Click behavior (Windows/Linux)
  tray.on('click', () => {
    mainWindow.show();
  });
});
```

**Dynamic Tray Updates:**

```javascript
// Update icon (e.g., show unread count)
tray.setImage(path.join(__dirname, 'tray-icon-alert.png'));

// Update tooltip
tray.setToolTip('5 unread messages');

// Update menu
const newMenu = Menu.buildFromTemplate([
  { label: 'New Item', click: () => {} }
]);
tray.setContextMenu(newMenu);
```

**macOS Menu Bar:**

```javascript
// Use template images for proper dark mode support on macOS
const icon = path.join(__dirname, 'tray-iconTemplate.png');
const tray = new Tray(icon);
```

## Power Monitor

Monitor system power events (battery, sleep, shutdown).

**Power State Events:**

```javascript
const { powerMonitor } = require('electron');

// System is about to suspend
powerMonitor.on('suspend', () => {
  console.log('System is going to sleep');
  saveCurrentState();
});

// System has resumed
powerMonitor.on('resume', () => {
  console.log('System woke up');
  refreshData();
});

// On battery power
powerMonitor.on('on-battery', () => {
  console.log('Switched to battery power');
  enablePowerSavingMode();
});

// On AC power
powerMonitor.on('on-ac', () => {
  console.log('Switched to AC power');
  disablePowerSavingMode();
});

// Thermal state changed (macOS)
powerMonitor.on('thermal-state-change', (state) => {
  console.log('Thermal state:', state);
  // 'unknown', 'nominal', 'fair', 'serious', 'critical'
});
```

**Query Power State:**

```javascript
// Check if on battery
const onBattery = powerMonitor.isOnBatteryPower();

// Get current thermal state (macOS)
const thermalState = powerMonitor.getCurrentThermalState();
```

**Prevent Sleep:**

```javascript
const { powerSaveBlocker } = require('electron');

// Prevent system from sleeping during important operation
const id = powerSaveBlocker.start('prevent-app-suspension');

// Later, when operation is complete
powerSaveBlocker.stop(id);

// Check if blocking
const isBlocking = powerSaveBlocker.isStarted(id);
```

## Auto Updater

Enable automatic application updates. Uses different backends depending on platform.

**Setup (with electron-builder):**

```javascript
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Check for updates on startup
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  showNotification('Update Available', `Version ${info.version} is downloading...`);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('No updates available');
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});

autoUpdater.on('download-progress', (progress) => {
  const percent = Math.round(progress.percent);
  console.log(`Downloaded ${percent}%`);
  mainWindow.setProgressBar(percent / 100);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');

  // Prompt user to install
  const { dialog } = require('electron');
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version is ready to install.',
    buttons: ['Restart', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
```

**Manual Check:**

```javascript
// Add menu item to check for updates
{
  label: 'Check for Updates',
  click: () => {
    autoUpdater.checkForUpdates();
  }
}
```

**Requirements:**

- **Code signing** - Must sign your app for auto-updates to work
- **Update server** - Need a server hosting release files (or use GitHub Releases)
- **Version management** - Follow semantic versioning in `package.json`

**Publishing Updates (with electron-builder):**

```json
{
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "your-repo"
  }
}
```

```bash
# Build and publish
npm run build -- --publish always
```

## System Preferences (macOS)

Access and request system permissions on macOS.

**Check Permissions:**

```javascript
const { systemPreferences } = require('electron');

// Media access (camera, microphone)
const cameraStatus = systemPreferences.getMediaAccessStatus('camera');
const micStatus = systemPreferences.getMediaAccessStatus('microphone');
// Returns: 'not-determined', 'granted', 'denied', 'restricted', 'unknown'

// Request access
systemPreferences.askForMediaAccess('camera').then(granted => {
  if (granted) {
    // Camera access granted
  }
});
```

**Appearance:**

```javascript
// Get system theme
const isDarkMode = systemPreferences.isDarkMode();

// Listen for theme changes
systemPreferences.on('color-changed', () => {
  const theme = systemPreferences.isDarkMode() ? 'dark' : 'light';
  mainWindow.webContents.send('theme-changed', theme);
});

// Get accent color
const accentColor = systemPreferences.getAccentColor();
```

## Protocol Handler

Register custom URL protocols (e.g., `myapp://`).

**Register Protocol:**

```javascript
const { app } = require('electron');

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('myapp', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('myapp');
}

// Handle protocol URLs
app.on('open-url', (event, url) => {
  event.preventDefault();
  console.log('Opened URL:', url);
  // Parse and handle: myapp://action/param
});

// Windows/Linux - get URL from command line
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance
    const url = commandLine.pop();
    handleProtocolUrl(url);

    // Focus existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
```

## Dock (macOS)

Control the app's dock icon on macOS.

```javascript
const { app } = require('electron');

// Set badge
app.dock.setBadge('5');

// Bounce icon
app.dock.bounce('critical');  // 'critical' or 'informational'

// Hide/show dock icon
app.dock.hide();
app.dock.show();

// Set dock menu
const dockMenu = Menu.buildFromTemplate([
  { label: 'New Window', click: () => createWindow() },
  { label: 'Settings', click: () => openSettings() }
]);
app.dock.setMenu(dockMenu);
```

## Best Practices

- **Request permissions properly** - Ask for camera/microphone access before using
- **Code sign for updates** - Auto-updater requires signed applications
- **Handle platform differences** - Many features are platform-specific (dock = macOS only)
- **Clear tray on quit** - Set `tray = null` when app quits to prevent memory leaks
- **Test notifications** - Notification APIs vary by OS; test on all platforms
- **Use power monitor wisely** - Save state before suspend, refresh after resume

## Related

- [Main Process APIs](./main-process-apis.md) - Core system APIs
- [Security](./security.md) - Secure permission handling
