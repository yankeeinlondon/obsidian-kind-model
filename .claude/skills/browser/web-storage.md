# Web Storage API

The Web Storage API provides key-value storage in the browser. While more powerful than cookies, it has specific architectural trade-offs and security considerations.

## localStorage vs. sessionStorage

| Feature | localStorage | sessionStorage |
|---------|-------------|----------------|
| **Persistence** | Survives browser restart | Cleared when tab closes |
| **Scope** | Shared across all tabs (same origin) | Tab-specific (not shared) |
| **Capacity** | ~5-10MB per origin | ~5-10MB per origin |
| **Exception** | N/A | Duplicating tab clones session storage |

### API Methods

Both share identical methods:

```javascript
// Set item
localStorage.setItem('key', 'value');

// Get item
const value = localStorage.getItem('key');

// Remove item
localStorage.removeItem('key');

// Clear all
localStorage.clear();

// Get number of items
const count = localStorage.length;

// Get key by index
const key = localStorage.key(0);
```

## Major Gotchas

### String-Only Constraint

Web Storage only stores strings. Objects are converted via `.toString()`, resulting in `"[object Object]"`.

**Solution**: Manual serialization

```javascript
// Store object
const user = { name: 'Alice', age: 30 };
localStorage.setItem('user', JSON.stringify(user));

// Retrieve object
const retrieved = JSON.parse(localStorage.getItem('user'));
```

**Best Practice**: Wrap in helper functions

```javascript
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage failed:', e);
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Parse failed:', e);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};
```

### Synchronous Bottleneck

The API is **synchronous and blocking**. Main thread stops during disk I/O.

**Gotcha**: Writing large data (4MB JSON) frequently causes UI freezing.

**Best Practice**:
- Use Web Storage for small metadata (theme, UI state)
- Use **IndexedDB** for large datasets
- Throttle writes for frequently changing data

### Private/Incognito Mode

Behavior varies by browser:

- **Safari (older)**: Zero quota, every `setItem` throws immediately
- **Chrome/Firefox**: Usually provides quota but clears on session end

**Best Practice**: Always wrap in try-catch

```javascript
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded');
      // Implement cleanup strategy
    }
    return false;
  }
}
```

### Quota Exceeded Error

Most browsers cap at **~5MB to 10MB** per origin.

**Solutions**:
1. Implement LRU (Least Recently Used) cache
2. Compress data before storing
3. Use IndexedDB for large data

```javascript
// Simple LRU cleanup
function cleanupOldest() {
  const keys = Object.keys(localStorage);
  const withTimestamps = keys.map(key => ({
    key,
    timestamp: JSON.parse(localStorage.getItem(key)).timestamp || 0
  }));

  withTimestamps.sort((a, b) => a.timestamp - b.timestamp);

  // Remove oldest 10%
  const toRemove = Math.ceil(withTimestamps.length * 0.1);
  withTimestamps.slice(0, toRemove).forEach(item => {
    localStorage.removeItem(item.key);
  });
}
```

## Security Considerations

**Web Storage is NOT a vault.**

### XSS Vulnerability

Any JavaScript on the page (including third-party scripts) has full access.

**Gotcha**: No `HttpOnly` equivalent like cookies.

**Golden Rule**: Never store:
- JWT access tokens
- API keys
- Personally Identifiable Information (PII)
- Passwords or credentials

**Solution**: Use `HttpOnly; Secure; SameSite=Strict` cookies for authentication.

### Safe Storage Example

```javascript
// BAD: Don't do this
localStorage.setItem('authToken', jwtToken);

// GOOD: Store in HttpOnly cookie (server-side)
// Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// Web Storage for UI preferences only
localStorage.setItem('theme', 'dark');
localStorage.setItem('sidebarCollapsed', 'true');
```

## Advanced Best Practices

### Storage Events (Cross-Tab Sync)

```javascript
window.addEventListener('storage', (event) => {
  // Fires in ALL tabs except the one that made the change
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('URL:', event.url);

  // Sync theme across tabs
  if (event.key === 'theme') {
    applyTheme(event.newValue);
  }
});
```

**Use Cases**:
- Sync theme changes
- Logout from all tabs
- Real-time preference updates

### Data Versioning

Prevents crashes when app updates change data structure.

```javascript
const APP_VERSION = '2.0';

function loadData() {
  const stored = storage.get('appData');

  if (!stored || stored.version !== APP_VERSION) {
    // Migrate or reset
    return getDefaultData();
  }

  return stored.data;
}

function saveData(data) {
  storage.set('appData', {
    version: APP_VERSION,
    data,
    timestamp: Date.now()
  });
}
```

### Namespacing Strategy

Prevents key collisions with third-party scripts.

```javascript
const PREFIX = 'myapp_';

const namespacedStorage = {
  set(key, value) {
    storage.set(PREFIX + key, value);
  },

  get(key, defaultValue) {
    return storage.get(PREFIX + key, defaultValue);
  },

  remove(key) {
    storage.remove(PREFIX + key);
  }
};

// Usage
namespacedStorage.set('user_settings', settings);
```

## Comparison Table

| Feature | Web Storage | IndexedDB | Cookies |
|---------|-------------|-----------|---------|
| **Capacity** | 5-10MB | Virtually unlimited | ~4KB |
| **Data Types** | Strings only | Objects, Blobs, Files | Strings only |
| **Access** | Synchronous | Asynchronous | Sync/Async |
| **Security** | High XSS risk | High XSS risk | Can be `HttpOnly` |
| **Primary Use** | UI state, preferences | Large app data, offline | Authentication tokens |
| **Performance** | Fast (blocking) | Fast (non-blocking) | Sent with every request |

## When to Use What

### Use localStorage for:
- User theme/preferences
- UI state (sidebar collapsed, selected tab)
- Small cache of non-sensitive data
- Feature flags
- Tutorial completion status

### Use sessionStorage for:
- Form data during multi-step flow
- Temporary state during session
- One-time messages
- Shopping cart (single session)

### Use IndexedDB for:
- Large datasets (>1MB)
- Structured data with queries
- Offline app data
- Binary data (Blobs, Files)

### Use Cookies for:
- Authentication tokens
- Session IDs
- Server-side rendering data
- Cross-domain state

## Example: Persistent Theme with Fallback

```javascript
const Theme = {
  get() {
    if (!this.isSupported()) {
      return this.getFromClass();
    }

    const stored = localStorage.getItem('theme');
    return stored || this.getSystemPreference();
  },

  set(theme) {
    if (!this.isSupported()) {
      this.setClass(theme);
      return;
    }

    try {
      localStorage.setItem('theme', theme);
      this.apply(theme);
    } catch (e) {
      console.warn('Could not save theme preference');
      this.setClass(theme);
    }
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },

  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  },

  isSupported() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  setClass(theme) {
    document.documentElement.className = theme;
  },

  getFromClass() {
    return document.documentElement.className || 'light';
  }
};

// Usage
Theme.set('dark');
const current = Theme.get();
```

## Related

- [IndexedDB](./indexeddb.md)
- [File System Access](./file-system.md)
- [Progressive Web Apps](./pwa.md)
