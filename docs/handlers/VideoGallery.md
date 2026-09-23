# VideoGallery

`VideoGallery` shows YouTube videos found on pages that link to the page containing the gallery. It renders a thumbnail grid; selecting a thumbnail opens the video in an expanded player.

This handler is useful on a topic or project note when you keep video references in separate notes and link those notes back to the topic.

## Add a gallery

Put a `VideoGallery` call in a `km` code block on the note where the gallery should appear:

````markdown
```km
VideoGallery()
```
````

For example, if the gallery is on `Topics/Neural networks.md`, a source note can link back to it and include a YouTube URL in an image source:

````markdown
<!-- Notes/Backpropagation video.md -->
[[Topics/Neural networks]]

![Backpropagation explained](https://www.youtube.com/watch?v=VIDEO_ID)
````

The image's alt text becomes the card title. If the alt text is omitted or is exactly `video` (case-insensitive), the source note's filename is used instead. The title below a thumbnail opens the source note.

The handler reads backlinks from Dataview and finds YouTube URLs in parsed content nodes with a `src` attribute. Markdown image syntax such as `![Title](URL)` is one way to provide such a source. A normal Markdown link like `[watch](URL)` has an `href`, not a `src`, so it is not collected by the current implementation. Frontmatter URLs are not used for the gallery.

Each matching URL becomes a card. Repeated URLs are not deduplicated. If no matching URLs are found, the handler renders an empty grid.

## Options

The optional `size` value sets the grid's column count on wider screens. The responsive stylesheet changes the grid to two columns at viewport widths up to 768 px and one column up to 480 px, regardless of `size`.

| Call | Wider-screen columns |
| --- | ---: |
| `VideoGallery()` or `VideoGallery({ size: "M" })` | 3 (default) |
| `VideoGallery({ size: "S" })` | 4 |
| `VideoGallery({ size: "L" })` | 2 |

Example:

````markdown
```km
VideoGallery({ size: "L" })
```
````

No positional arguments are accepted. `size` must be `"S"`, `"M"`, or `"L"`.

## What happens when you select a video

- The card thumbnail uses YouTube's `mqdefault.jpg` image. The expanded clone starts with `maxresdefault.jpg`.
- The clone animates toward the center of the app window, sized to at most 90% of the window width and 1400 px wide, with a 16:9 aspect ratio.
- After about 500 ms, the handler creates an iframe using Obsidian's YouTube proxy at `https://releases.obsidian.md/youtube`. It requests autoplay and enables the YouTube IFrame API.
- The surrounding gallery is dimmed and blurred. Click the backdrop or press Escape to close the player.
- Clicking the title below a card opens the note that supplied that video instead of opening the player.

Playback and autoplay are subject to YouTube availability, network access, and the host device's browser policies. The proxy is used for compatibility with Obsidian's embedded environment, including mobile; this does not guarantee identical behavior on every device.

Only one video can be expanded across all `VideoGallery` blocks at a time. While one is active, another card cannot open a second player. The expanded player is an overlay within the app window, not a separate full-screen view.

## Playback state helpers for plugin developers

The handler module exports helpers to read cached player state and request updates:

```ts
import {
  getCurrentPlayheadPosition,
  getPlayerState,
  requestPlayerUpdate,
} from "~/handlers/VideoGallery";

requestPlayerUpdate();
// The response is asynchronous; there is no completion callback or fixed delay.
window.setTimeout(() => {
  console.log(getCurrentPlayheadPosition());
  console.log(getPlayerState());
}, 100);
```

These are source-module exports for plugin code. The current plugin does not attach them to `app.plugins.plugins["obsidian-kind-model"]`, so they are not available through that object in the Obsidian console.

`getPlayerState()` returns a copy of the last state received from the player. Its fields are optional because the player may not have sent them yet:

| Field | Meaning |
| --- | --- |
| `currentTime` | Last reported playhead position, in seconds |
| `duration` | Last reported duration, in seconds |
| `playerState` | YouTube state code: `-1` unstarted, `0` ended, `1` playing, `2` paused, `3` buffering, `5` cued |
| `videoId` | YouTube video ID reported by the player |

`getCurrentPlayheadPosition()` returns the last reported time or `null` if none is cached. `requestPlayerUpdate()` does nothing if no player is active; otherwise it sends requests for current time, player state, and duration. Replies update the cache asynchronously. Closing the player clears the cached state.

There is no supported public helper for issuing playback commands. The expanded iframe shows YouTube's player controls.
