# VideoGallery YouTube Embed Issues

## Problem Description

The `VideoGallery()` handler in `km` codeblocks is displaying "An error occurred" messages for all embedded YouTube videos. The videos used to work correctly, but now fail to load despite no changes to the plugin code.

## Root Cause Analysis

### Primary Issue: Missing `allow-scripts` in Sandbox Attribute

The current iframe implementation in `src/handlers/VideoGallery.ts:80` uses this sandbox configuration:

```typescript
sandbox="allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
```

**The critical problem**: The `sandbox` attribute is **missing `allow-scripts`**, which is absolutely required for YouTube embeds to function.

### Why This Breaks YouTube Embeds

YouTube's video player is entirely JavaScript-based. When an iframe has the `sandbox` attribute but doesn't include `allow-scripts`, the browser blocks all JavaScript execution within that iframe. This prevents the YouTube player from:
- Initializing the player interface
- Loading video data
- Handling user interactions
- Rendering video content

Without JavaScript, the YouTube embed can only display the error message "An error occurred."

### Why It May Have Worked Before

Possible explanations for why this worked previously:
1. **Browser changes**: Browser vendors may have tightened sandbox enforcement in recent updates
2. **YouTube player updates**: YouTube may have updated their player to be stricter about security requirements
3. **Obsidian updates**: The Electron/Chromium version in Obsidian may have changed, affecting iframe behavior

## Required Changes

### 1. Fix the Sandbox Attribute (CRITICAL)

**Current code** (`src/handlers/VideoGallery.ts:80`):
```typescript
sandbox="allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
```

**Required fix**:
```typescript
sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
```

Adding `allow-scripts` enables JavaScript execution, which is mandatory for YouTube's player to function.

**Security note**: Using both `allow-scripts` and `allow-same-origin` together is generally discouraged for same-origin content (as it allows the embedded content to escape the sandbox). However, this is **safe for YouTube embeds** because they are cross-origin content from `youtube.com`, not same-origin content.

### 2. Update the `allow` Attribute (RECOMMENDED)

**Current code** (`src/handlers/VideoGallery.ts:80`):
```typescript
allow="fullscreen"
```

**Recommended update**:
```typescript
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
```

This matches YouTube's current recommended permissions and enables:
- `accelerometer` - Device orientation features
- `autoplay` - Auto-playing videos (if desired)
- `clipboard-write` - Copy functionality in player
- `encrypted-media` - DRM-protected content playback
- `gyroscope` - Device motion features
- `picture-in-picture` - PiP mode
- `web-share` - Native share functionality
- `fullscreen` - Fullscreen mode (already present)

### 3. Add Missing Attributes (OPTIONAL BUT RECOMMENDED)

Add these attributes for better compatibility and accessibility:

```typescript
allowfullscreen  // Boolean attribute for fullscreen support
title="YouTube video player"  // Accessibility: describes iframe purpose
```

## Complete Fixed Implementation

Here's the complete corrected iframe element:

```typescript
`<iframe
  class="video-ref"
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
  frameborder="0"
  sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
  allowfullscreen
  src="${src}">
</iframe>`
```

**Remove these attributes** (not needed or invalid):
- `content-editable="false"` - Not a valid iframe attribute
- `aria-multiline="true"` - Not relevant for iframe elements

## Implementation Plan

### Minimal Fix (Immediate)
Change only the `sandbox` attribute in `src/handlers/VideoGallery.ts:80`:
```typescript
sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
```

### Complete Fix (Recommended)
Replace the entire iframe element at `src/handlers/VideoGallery.ts:80` with:
```typescript
`<iframe class="video-ref" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" frameborder="0" sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-forms" allowfullscreen src="${src}"></iframe>`
```

## Testing Verification

After implementing the fix, verify:
1. YouTube videos load and play correctly in the VideoGallery
2. Fullscreen mode works
3. Video controls are responsive
4. Links to source pages still function
5. Grid layout remains correct for all size options (S, M, L)

## References

- [YouTube IFrame Player API - Google Developers](https://developers.google.com/youtube/player_parameters)
- [MDN Web Docs - iframe sandbox attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox)
- [MDN Web Docs - iframe allow attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#allow)
- Recent YouTube embed discussions (2024-2025) confirm `allow-scripts` is required for sandboxed YouTube iframes
