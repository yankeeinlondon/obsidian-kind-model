# Web Share API

The Web Share API triggers the native share dialog, delegating sharing to the user's operating system instead of building custom share buttons for each platform.

## Requirements

1. **Secure Context**: Must be HTTPS (or localhost)
2. **Transient Activation**: Must be triggered by user action (click, keyboard event)

## Browser Support (Late 2025)

- **Mobile**: Excellent (Chrome Android, Safari iOS)
- **Desktop**:
  - Safari (macOS): Full support
  - Chrome/Edge (Windows/ChromeOS): Full support
  - Firefox: Enabled in recent versions

## Basic Usage

```javascript
const shareData = {
  title: 'Check this out!',
  text: 'Amazing article about Web APIs',
  url: 'https://example.com/article'
};

button.addEventListener('click', async () => {
  try {
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log('Successfully shared');
    } else {
      throw new Error('Share data not supported');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Fallback to copy to clipboard
    navigator.clipboard.writeText(shareData.url);
  }
});
```

## Share Data Properties

```javascript
{
  title: 'Page Title',     // Optional
  text: 'Description',     // Optional
  url: 'https://...',      // Optional
  files: [file1, file2]    // Optional (File objects)
}
```

**Note**: At least one property must be provided.

## File Sharing

Share images, PDFs, or other files.

```javascript
async function shareImage() {
  const canvas = document.getElementById('canvas');

  // Convert canvas to blob
  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'image.png', { type: 'image/png' });

    const shareData = {
      files: [file],
      title: 'My Canvas Drawing',
      text: 'Check out what I created!'
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert('File sharing not supported');
    }
  });
}
```

## Feature Detection

### Check API Availability

```javascript
if ('share' in navigator) {
  // Web Share API is available
  showShareButton();
} else {
  // Fallback to copy or custom share buttons
  showCopyButton();
}
```

### Check Specific Share Capability

```javascript
const shareData = {
  files: [new File(['test'], 'test.txt', { type: 'text/plain' })]
};

if (navigator.canShare && navigator.canShare(shareData)) {
  console.log('Can share files');
} else {
  console.log('File sharing not supported');
}
```

## Complete Example with Fallback

```javascript
async function smartShare(data) {
  // Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      });
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, reason: 'User cancelled' };
      }
      console.error('Share failed, falling back to clipboard');
    }
  }

  // Fallback: Clipboard API
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data.url);
      showToast('Link copied to clipboard!');
      return { success: true, method: 'clipboard' };
    } catch (err) {
      console.error('Clipboard failed');
    }
  }

  // Final fallback: Manual copy with textarea
  const textarea = document.createElement('textarea');
  textarea.value = data.url;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Link copied!');
    return { success: true, method: 'legacy' };
  } catch (err) {
    document.body.removeChild(textarea);
    return { success: false, reason: 'All methods failed' };
  }
}

// Usage
document.getElementById('share-btn').addEventListener('click', async () => {
  const result = await smartShare({
    title: 'Great Article',
    text: 'You should read this',
    url: window.location.href
  });

  console.log('Share result:', result);
});
```

## Capability Levels

| Feature | Description | Supported Data |
|---------|-------------|----------------|
| **Basic Sharing** | Text and URLs | `title`, `text`, `url` |
| **File Sharing** | Images, PDFs, audio, etc. | `files` (array of File objects) |
| **Cross-Origin** | Sharing from iframes | Requires `allow="web-share"` |

## iframe Support

```html
<iframe src="https://example.com" allow="web-share"></iframe>
```

Inside the iframe, the Web Share API will work if the parent allows it.

## Share Targets

Some platforms allow PWAs to register as **Share Targets** (receive shares from other apps).

### Web Share Target API (manifest.json)

```json
{
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "media",
          "accept": ["image/*", "video/*"]
        }
      ]
    }
  }
}
```

When another app shares content, your PWA opens at `/share` with the data.

## Benefits

1. **Reduced Payload**: No need for social media SDKs
2. **User Privacy**: Browser doesn't track where user shared
3. **Consistency**: Users see familiar interface
4. **Native Integration**: Works with installed apps (WhatsApp, Slack, etc.)

## Limitations

### No Success Tracking

For privacy, the API won't tell you which app the user chose.

```javascript
// You can't do this
await navigator.share(data);
// Can't know if user chose Twitter, WhatsApp, or Email
```

### Local File Schemes

Cannot share `file://` URLs for security.

```javascript
// Won't work
await navigator.share({ url: 'file:///path/to/file.txt' });
```

### Must Be User-Initiated

```javascript
// BAD: Won't work (not triggered by user)
window.onload = () => {
  navigator.share(data); // Error
};

// GOOD: Triggered by click
button.onclick = () => {
  navigator.share(data); // Works
};
```

## Common Patterns

### Share Current Page

```javascript
async function shareCurrentPage() {
  const shareData = {
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.content || '',
    url: window.location.href
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error('Share failed:', err);
  }
}
```

### Share Screenshot

```javascript
async function shareScreenshot() {
  // Capture element as canvas
  const element = document.getElementById('content');
  const canvas = await html2canvas(element);

  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'screenshot.png', { type: 'image/png' });

    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Screenshot',
        text: 'Check out this content'
      });
    }
  });
}
```

### Share with Analytics

```javascript
async function shareWithTracking(data) {
  try {
    await navigator.share(data);

    // Log successful share (but not where)
    analytics.track('content_shared', {
      title: data.title,
      url: data.url
    });
  } catch (err) {
    if (err.name !== 'AbortError') {
      analytics.track('share_failed', { error: err.message });
    }
  }
}
```

## Progressive Enhancement Pattern

```javascript
class ShareManager {
  constructor(data) {
    this.data = data;
  }

  async share() {
    // Try Web Share API
    if (this.canUseWebShare()) {
      return this.webShare();
    }

    // Try Clipboard API
    if (this.canUseClipboard()) {
      return this.clipboardShare();
    }

    // Fallback to legacy
    return this.legacyShare();
  }

  canUseWebShare() {
    return 'share' in navigator && navigator.canShare(this.data);
  }

  async webShare() {
    await navigator.share(this.data);
    return 'web-share';
  }

  canUseClipboard() {
    return 'clipboard' in navigator && 'writeText' in navigator.clipboard;
  }

  async clipboardShare() {
    await navigator.clipboard.writeText(this.data.url);
    this.showToast('Link copied!');
    return 'clipboard';
  }

  legacyShare() {
    const textarea = document.createElement('textarea');
    textarea.value = this.data.url;
    textarea.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.showToast('Link copied!');
    return 'legacy';
  }

  showToast(message) {
    // Implementation
  }
}

// Usage
const shareManager = new ShareManager({
  title: 'Article',
  url: 'https://example.com'
});

button.onclick = () => shareManager.share();
```

## Related

- [Clipboard API](./clipboard.md)
- [Web Share Target](./web-share-target.md)
- [Progressive Web Apps](./pwa.md)
