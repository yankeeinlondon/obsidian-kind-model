# VideoGallery Handler

## Overview

The `VideoGallery` handler displays a grid of YouTube video thumbnails collected from pages that link back to the current page. Videos can be clicked to expand into a full-screen player with smooth animations and full playback controls.

**Key Features:**

- Automatic video discovery from backlinks
- Responsive grid layout with configurable sizes
- Smooth expand/collapse animations
- iOS/mobile compatible (uses Obsidian's YouTube proxy)
- Full YouTube IFrame API integration for programmatic control
- Real-time playhead tracking and metadata access

## Usage

```km
VideoGallery()
VideoGallery({size: "S"})  // Small: 4 columns
VideoGallery({size: "M"})  // Medium: 3 columns (default)
VideoGallery({size: "L"})  // Large: 2 columns
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | `"S" \| "M" \| "L"` | `"M"` | Grid size (columns: S=4, M=3, L=2) |

## How It Works

### 1. Video Discovery

The handler scans all pages that link to the current page (backlinks) and extracts YouTube URLs from their external links. Videos are collected with:

- **URL**: The YouTube video URL
- **Title**: The link text, or the page filename if the link text is just "video"
- **Filepath**: The source page path for navigation

### 2. Thumbnail Grid

Videos are displayed as a responsive CSS grid with:

- Medium-quality thumbnails (`mqdefault.jpg`, 320x180)
- Play button overlay on hover
- Clickable title that navigates to the source page
- Grid columns based on `size` option

### 3. Video Expansion

When a video thumbnail is clicked:

1. **Animation Start** (0ms):
   - Clone the card at its current position
   - Hide the source card
   - Show semi-transparent overlay
   - Display HD thumbnail (`maxresdefault.jpg`)
   - Show play button

2. **Expansion** (0-500ms):
   - Animate clone to center of screen
   - Scale to 90% viewport width (max 1400px)
   - Maintain 16:9 aspect ratio
   - Fade out play button after 400ms

3. **Video Load** (500ms):
   - Create iframe with Obsidian's YouTube proxy
   - Enable autoplay and YouTube IFrame API
   - Set up postMessage listener for metadata
   - Crossfade from thumbnail to iframe (100ms delay)

4. **Playback**:
   - Video autoplays
   - Full YouTube player controls available
   - ESC key or overlay click closes video

5. **Close Animation** (500ms):
   - Remove iframe
   - Animate clone back to original position
   - Fade play button back in
   - Show source card
   - Clean up listeners and state

## iOS/Mobile Compatibility

The handler uses **Obsidian's YouTube proxy** (`https://releases.obsidian.md/youtube`) instead of direct YouTube embeds. This solves the iOS Error 153 issue caused by missing HTTP Referer headers in iOS WKWebView.

**Iframe Configuration:**

```javascript
iframe.src = `https://releases.obsidian.md/youtube?v=${videoId}&autoplay=1&enablejsapi=1&origin=${origin}`;
iframe.allow = "autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture; clipboard-write";
iframe.sandbox = "allow-forms allow-presentation allow-same-origin allow-popups-to-escape-sandbox allow-scripts allow-modals allow-popups";
iframe.referrerpolicy = "strict-origin-when-cross-origin";
```

This configuration works identically on desktop and mobile devices.

## YouTube IFrame API Integration

The handler enables the YouTube IFrame API (`enablejsapi=1`) and uses `postMessage` for bidirectional communication with the player.

### State Tracking

The handler automatically caches player state via a `postMessage` listener:

```typescript
interface YouTubePlayerState {
  currentTime?: number;      // Playhead position in seconds
  duration?: number;          // Total video duration in seconds
  playerState?: number;       // Player state code (see below)
  videoId?: string;          // YouTube video ID
}
```

**Player State Codes:**

- `-1` - Unstarted
- `0` - Ended
- `1` - Playing
- `2` - Paused
- `3` - Buffering
- `5` - Cued

### Exported Functions

#### `getCurrentPlayheadPosition(): number | null`

Returns the last known playhead position in seconds, or `null` if no video is active.

```javascript
const position = app.plugins.plugins['obsidian-kind-model'].getCurrentPlayheadPosition();
console.log(`Current position: ${position} seconds`);
```

#### `getPlayerState(): YouTubePlayerState`

Returns the cached player state object with `currentTime`, `duration`, `playerState`, and `videoId`.

```javascript
const state = app.plugins.plugins['obsidian-kind-model'].getPlayerState();
console.log('Player state:', state);
// Example: { currentTime: 42.5, duration: 180, playerState: 1, videoId: "dQw4w9WgXcQ" }
```

#### `requestPlayerUpdate(): void`

Requests fresh player info from YouTube. Updates the cache asynchronously via postMessage.

```javascript
app.plugins.plugins['obsidian-kind-model'].requestPlayerUpdate();
// Wait ~100ms for postMessage response, then call getPlayerState()
```

## Programmatic Video Control

You can control the active video player by sending commands via `postMessage` to the iframe.

### Basic Pattern

```javascript
const plugin = app.plugins.plugins['obsidian-kind-model'];
const iframe = document.querySelector('.km-video-clone iframe');

if (iframe?.contentWindow) {
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func: "functionName", args: [arg1, arg2] }),
    "*"
  );
}
```

### Available Commands

#### Playback Controls

**Play/Pause/Stop:**

```javascript
// Play
iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");

// Pause
iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");

// Stop (returns to start)
iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*");
```

**Seek to Timestamp:**

```javascript
// Seek to 60 seconds
iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[60, true]}', "*");
// args: [seconds, allowSeekAhead]
```

**Playback Rate:**

```javascript
// Set playback speed (0.25, 0.5, 1, 1.25, 1.5, 2)
iframe.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[1.5]}', "*");

// Get current rate
iframe.contentWindow.postMessage('{"event":"command","func":"getPlaybackRate","args":""}', "*");

// Get available rates
iframe.contentWindow.postMessage('{"event":"command","func":"getAvailablePlaybackRates","args":""}', "*");
```

#### Volume Controls

```javascript
// Mute
iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', "*");

// Unmute
iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', "*");

// Check mute status
iframe.contentWindow.postMessage('{"event":"command","func":"isMuted","args":""}', "*");

// Set volume (0-100)
iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[50]}', "*");

// Get volume
iframe.contentWindow.postMessage('{"event":"command","func":"getVolume","args":""}', "*");
```

#### Quality Controls

```javascript
// Set quality (small, medium, large, hd720, hd1080, highres, default)
iframe.contentWindow.postMessage('{"event":"command","func":"setPlaybackQuality","args":["hd720"]}', "*");

// Get current quality
iframe.contentWindow.postMessage('{"event":"command","func":"getPlaybackQuality","args":""}', "*");

// Get available qualities
iframe.contentWindow.postMessage('{"event":"command","func":"getAvailableQualityLevels","args":""}', "*");
```

#### Video Information

```javascript
// Get current time
iframe.contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":""}', "*");

// Get duration
iframe.contentWindow.postMessage('{"event":"command","func":"getDuration","args":""}', "*");

// Get player state
iframe.contentWindow.postMessage('{"event":"command","func":"getPlayerState","args":""}', "*");

// Get video URL
iframe.contentWindow.postMessage('{"event":"command","func":"getVideoUrl","args":""}', "*");

// Get video loaded fraction (buffering progress, 0-1)
iframe.contentWindow.postMessage('{"event":"command","func":"getVideoLoadedFraction","args":""}', "*");
```

#### Playlist Controls (if applicable)

```javascript
// Next video
iframe.contentWindow.postMessage('{"event":"command","func":"nextVideo","args":""}', "*");

// Previous video
iframe.contentWindow.postMessage('{"event":"command","func":"previousVideo","args":""}', "*");

// Get playlist
iframe.contentWindow.postMessage('{"event":"command","func":"getPlaylist","args":""}', "*");

// Get playlist index
iframe.contentWindow.postMessage('{"event":"command","func":"getPlaylistIndex","args":""}', "*");
```

### Helper Function

For easier control, you can create a helper function:

```javascript
function controlVideo(command, args = "") {
  const iframe = document.querySelector('.km-video-clone iframe');
  if (!iframe?.contentWindow) {
    console.error('No active video player');
    return;
  }

  const argsStr = args === "" ? '""' : JSON.stringify(args);
  const message = `{"event":"command","func":"${command}","args":${argsStr}}`;
  iframe.contentWindow.postMessage(message, "*");
}

// Usage:
controlVideo('playVideo');
controlVideo('seekTo', [120, true]);
controlVideo('setVolume', [75]);
```

## Limitations

### Video Snapshots Not Supported

**Question:** Can we capture a video frame as an image?

**Answer:** No. Cross-origin security (CORS) prevents accessing iframe content from a different domain. The YouTube player runs in an iframe from `releases.obsidian.md`, which blocks canvas-based screenshot capture.

**Workarounds:**

- Use YouTube's thumbnail URLs (available via helper functions)
- Use browser extensions with special permissions
- Use server-side screenshot services with the video URL

### Single Video Limit

Only one video can be expanded at a time. Opening a new video automatically closes the previous one (module-level state prevents conflicts).

### postMessage Response Timing

Commands sent via `postMessage` are **asynchronous**. Responses come back via the message listener and update the cached state. Allow ~100ms for responses before reading cached values.

## Technical Implementation

### Module State

```typescript
let activeClone: HTMLElement | null = null;           // The expanded video container
let sourceCard: HTMLElement | null = null;            // Original thumbnail card
let initialRect: DOMRect | null = null;               // Card position for close animation
let overlayElement: HTMLElement | null = null;        // Semi-transparent backdrop
let escHandler: ((e: KeyboardEvent) => void) | null;  // ESC key listener
let activeIframe: HTMLIFrameElement | null = null;    // YouTube player iframe
let messageListener: ((e: MessageEvent) => void);     // postMessage listener
let cachedPlayerState: YouTubePlayerState = {};       // Cached player metadata
```

### Message Listener

The handler sets up a global `postMessage` listener that:

1. Validates messages are from YouTube or Obsidian proxy
2. Parses JSON responses
3. Caches `currentTime`, `duration`, `playerState`, and `videoId`
4. Logs state changes to console (can be removed in production)

### Cleanup

When a video is closed:

- Iframe is removed
- postMessage listener is removed
- Module state is reset
- CSS classes and overlays are cleaned up
- ESC key listener is removed

This ensures no memory leaks or zombie listeners.

## Console Debugging

While a video is playing, check the browser console for real-time logs:

```
[VideoGallery] Player state: 1
[VideoGallery] Current time: 42.5 Duration: 180
[VideoGallery] Player state: 2
```

You can also inspect the cached state:

```javascript
// Get plugin reference
const plugin = app.plugins.plugins['obsidian-kind-model'];

// Check current playhead
console.log('Playhead:', plugin.getCurrentPlayheadPosition());

// Get full state
console.log('State:', plugin.getPlayerState());

// Request fresh update
plugin.requestPlayerUpdate();
```

## Future Enhancements

Potential improvements:

- Multiple video support (picture-in-picture grid)
- Timestamp bookmarking and note-taking
- Playlist management
- Video trimming/clipping to Obsidian notes
- Speed controls UI overlay
- Video quality selector
- Loop/repeat options
- Keyboard shortcuts (J/K for seek, Space for play/pause)
- Integration with Obsidian's link timestamp syntax `[[video#t=1m30s]]`
