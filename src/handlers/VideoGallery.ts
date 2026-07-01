import type { YouTubeVideoUrl } from "inferred-types";
import type { PageContent } from "../helpers/pageContent";
import type { PagePath } from "../types/general";
import { type } from "arktype";
import { pageContent } from "../helpers/pageContent";
import { extractVideoId, getYouTubeThumbnail, getYouTubeThumbnailHD } from "../helpers/youtube";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

/**
 * Module-level state for video expansion (simple approach)
 * Only one video can be expanded at a time across all galleries
 */
let activeClone: HTMLElement | null = null;
let sourceCard: HTMLElement | null = null;
let initialRect: DOMRect | null = null;
let overlayElement: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;
let activeIframe: HTMLIFrameElement | null = null;
let messageListener: ((e: MessageEvent) => void) | null = null;
let cachedPlayerState: YouTubePlayerState = {};

/**
 * YouTube player state tracking via postMessage API
 */
interface YouTubePlayerState {
  currentTime?: number;
  duration?: number;
  playerState?: number; // -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
  videoId?: string;
}

/**
 * Get or create the global overlay element
 */
function getOverlay(): HTMLElement {
  if (!overlayElement) {
    overlayElement = document.createElement("div");
    overlayElement.className = "km-video-overlay";
    overlayElement.onclick = closeVideo;
    document.body.appendChild(overlayElement);
  }
  return overlayElement;
}

/**
 * Set up YouTube IFrame API message listener for tracking player state
 */
function setupYouTubeMessageListener(iframe: HTMLIFrameElement): void {
  // Clean up any existing listener
  if (messageListener) {
    window.removeEventListener("message", messageListener);
  }

  messageListener = (event: MessageEvent) => {
    // Verify message is from YouTube
    if (event.origin !== "https://www.youtube.com" && event.origin !== "https://releases.obsidian.md") {
      return;
    }

    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

      // Cache player state changes
      if (data.event === "onStateChange") {
        cachedPlayerState.playerState = data.info;
        console.log("[VideoGallery] Player state:", data.info);
      }

      // Cache time updates (happens frequently during playback)
      if (data.event === "infoDelivery" && data.info) {
        if (data.info.currentTime !== undefined) {
          cachedPlayerState.currentTime = data.info.currentTime;
        }
        if (data.info.duration !== undefined) {
          cachedPlayerState.duration = data.info.duration;
        }
        if (data.info.videoData?.video_id) {
          cachedPlayerState.videoId = data.info.videoData.video_id;
        }
        console.log("[VideoGallery] Current time:", cachedPlayerState.currentTime, "Duration:", cachedPlayerState.duration);
      }
    }
    catch {
      // Ignore parse errors from non-YouTube messages
    }
  };

  window.addEventListener("message", messageListener);

  // Request initial info from the player
  iframe.onload = () => {
    const existingOnload = iframe.onload;
    if (iframe.contentWindow) {
      // Tell YouTube we're listening
      iframe.contentWindow.postMessage('{"event":"listening"}', "*");
    }
    // Call the existing onload if it was set
    if (existingOnload && existingOnload !== iframe.onload) {
      (existingOnload as any)();
    }
  };
}

/**
 * Get current playhead position from active video (last known position from cache)
 * @returns Current time in seconds, or null if no video is active or no data available
 */
export function getCurrentPlayheadPosition(): number | null {
  return cachedPlayerState.currentTime ?? null;
}

/**
 * Get the last known player state from message listener cache
 * @returns YouTubePlayerState object with currentTime, duration, playerState, and videoId
 */
export function getPlayerState(): YouTubePlayerState {
  return { ...cachedPlayerState };
}

/**
 * Request fresh player info from YouTube (updates cache asynchronously)
 * Use this before calling getPlayerState() if you need the most current data
 */
export function requestPlayerUpdate(): void {
  if (!activeIframe?.contentWindow) {
    return;
  }
  // Request current player info - results come back via postMessage and update cache
  activeIframe.contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":""}', "*");
  activeIframe.contentWindow.postMessage('{"event":"command","func":"getPlayerState","args":""}', "*");
  activeIframe.contentWindow.postMessage('{"event":"command","func":"getDuration","args":""}', "*");
}

/**
 * Open a video in expanded view
 */
function openVideo(card: HTMLElement, videoUrl: string): void {
  if (activeClone)
    return; // Prevent multiple expansions

  sourceCard = card;
  initialRect = card.getBoundingClientRect();

  // Create clone at card position
  const clone = document.createElement("div");
  clone.className = "km-video-clone";
  Object.assign(clone.style, {
    top: `${initialRect.top}px`,
    left: `${initialRect.left}px`,
    width: `${initialRect.width}px`,
    height: `${initialRect.height}px`,
  });

  // Add HD thumbnail and play overlay for smooth transition
  const hdThumbUrl = getYouTubeThumbnailHD(videoUrl);
  if (hdThumbUrl) {
    clone.innerHTML = `
      <img src="${hdThumbUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:1;">
      <div class="km-clone-play-overlay">
        <div class="km-play-icon km-play-icon-hovered"></div>
      </div>
    `;
  }

  document.body.appendChild(clone);
  activeClone = clone;

  // Hide source card, show overlay
  sourceCard.classList.add("km-hidden");
  document.body.classList.add("km-video-active");
  getOverlay().classList.add("km-show");

  // Attach ESC listener with capture to intercept before Obsidian handlers
  escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeVideo();
    }
  };
  document.addEventListener("keydown", escHandler, { capture: true });

  // Force reflow before transition
  void clone.offsetWidth;

  // Calculate target size (90% width, max 1400px, 16:9 aspect ratio)
  const targetW = Math.min(window.innerWidth * 0.9, 1400);
  const targetH = targetW * (9 / 16);
  const targetTop = (window.innerHeight - targetH) / 2;
  const targetLeft = (window.innerWidth - targetW) / 2;

  // Animate to center
  requestAnimationFrame(() => {
    if (!activeClone)
      return;
    Object.assign(activeClone.style, {
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
      width: `${targetW}px`,
      height: `${targetH}px`,
    });

    // Keep play icon visible for 400ms, then fade out
    setTimeout(() => {
      if (activeClone)
        activeClone.classList.add("km-expanding");
    }, 400);
  });

  // Load iframe after animation completes
  setTimeout(() => {
    if (!activeClone)
      return;

    const iframe = document.createElement("iframe");
    // Use Obsidian's YouTube proxy for iOS compatibility (same as native embeds)
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      console.error("[VideoGallery] Could not extract video ID from:", videoUrl);
      return;
    }
    // Enable YouTube IFrame API for playhead tracking and metadata access
    iframe.src = `https://releases.obsidian.md/youtube?v=${videoId}&autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
    // Allow necessary features for YouTube playback (no allowfullscreen attribute - it's deprecated)
    iframe.allow = "autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture; clipboard-write";
    iframe.setAttribute("frameborder", "0");
    // Match Obsidian's native embed attributes for iOS compatibility
    iframe.setAttribute("sandbox", "allow-forms allow-presentation allow-same-origin allow-popups-to-escape-sandbox allow-scripts allow-modals allow-popups");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.className = "external-embed mod-receives-events";
    iframe.style.cssText = "width:100%; height:100%; border:none; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease; z-index:2;";

    clone.appendChild(iframe);
    activeIframe = iframe;

    // Set up YouTube API message listener for playhead tracking
    setupYouTubeMessageListener(iframe);

    // Crossfade from thumbnail to iframe once loaded
    iframe.onload = () => {
      // Small delay before crossfade for smoother transition
      setTimeout(() => {
        iframe.style.opacity = "1";
      }, 100);
    };
  }, 500);
}

/**
 * Close the expanded video
 */
function closeVideo(): void {
  if (!activeClone || !sourceCard || !initialRect)
    return;

  // Remove iframe
  activeClone.querySelector("iframe")?.remove();

  // Animate back to original position
  Object.assign(activeClone.style, {
    top: `${initialRect.top}px`,
    left: `${initialRect.left}px`,
    width: `${initialRect.width}px`,
    height: `${initialRect.height}px`,
  });

  // Fade play icon back in after 100ms (reverse of expansion)
  setTimeout(() => {
    if (activeClone)
      activeClone.classList.remove("km-expanding");
  }, 100);

  // Hide overlay
  document.body.classList.remove("km-video-active");
  getOverlay().classList.remove("km-show");

  // Remove ESC listener
  if (escHandler) {
    document.removeEventListener("keydown", escHandler, { capture: true });
    escHandler = null;
  }

  // Clean up YouTube API message listener
  if (messageListener) {
    window.removeEventListener("message", messageListener);
    messageListener = null;
  }
  activeIframe = null;
  cachedPlayerState = {}; // Reset cached state

  // After animation, cleanup
  setTimeout(() => {
    if (activeClone) {
      activeClone.remove();
      activeClone = null;
    }
    if (sourceCard) {
      sourceCard.classList.remove("km-hidden");
      sourceCard = null;
    }
    initialRect = null;
  }, 500);
}

/**
 * ArkType schema for VideoGallery options
 */
const VideoGalleryOptionsSchema = type({
  "+": "reject",
  "size?": "'S' | 'M' | 'L'",
});

// Register handler
console.log("[VideoGallery] MODULE LOADED - Registering handler");
registerHandler({
  name: "VideoGallery",
  scalarSchema: null,
  acceptsScalars: false,
  optionsSchema: VideoGalleryOptionsSchema,
  description: "Displays a gallery of YouTube videos from pages that link to this page",
  examples: [
    "VideoGallery()",
    "VideoGallery({size: \"M\"})",
    "VideoGallery({size: \"L\"})",
  ],
});
console.log("[VideoGallery] Handler registered successfully");

/**
 * Renders a gallery of YouTube videos from backlinks
 */
export const VideoGallery = createHandlerV2("VideoGallery")
  .noScalar()
  .optionsSchema(VideoGalleryOptionsSchema)
  .handler(async (evt) => {
    try {
      console.log("[VideoGallery] Handler started");

      const { plugin: p, page, render } = evt;

      interface Video {
        url: YouTubeVideoUrl;
        filepath: PagePath;
        title: string;
      }

      // Collect videos from backlinks
      let videos: Video[] = [];

      const backLinks = page.inlinks;
      const backPages: PageContent[] = await Promise.all(
        backLinks.map(i => pageContent(p)(i)),
      ).then(pgs => pgs.filter(i => i) as PageContent[]);

      backPages.forEach((pg) => {
        const [links] = pg.externalLinks();
        videos = [
          ...videos,
          ...(links
            .filter(i => i.domain === "youtube-video")
            .map(i => ({
              ...i,
              title: i.title.toLowerCase() === "video" ? pg.page.file.name : i.title,
              filepath: pg.filepath,
            })) as Video[]),
        ];
      });

      // Calculate grid columns based on size
      const size = evt?.options?.size || "M";
      const grid_cols = size === "L" ? 2 : size === "M" ? 3 : size === "S" ? 4 : 5;

      // Generate unique gallery ID
      const galleryId = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Build DOM with thumbnails
      const dom = [
        `<div class="km-video-gallery" data-gallery-id="${galleryId}">`,
        `  <div class="km-video-grid" style="grid-template-columns: repeat(${grid_cols}, minmax(0, 1fr));">`,
        ...videos.map((v, index) => {
          const thumbUrl = getYouTubeThumbnail(v.url);
          if (!thumbUrl)
            return "";

          return [
            `    <div class="km-video-card" data-video-url="${v.url}" data-video-index="${index}">`,
            `      <div class="km-thumbnail-container">`,
            `        <img src="${thumbUrl}" alt="${v.title}" loading="lazy">`,
            `        <div class="km-play-overlay">`,
            `          <div class="km-play-icon"></div>`,
            `        </div>`,
            `      </div>`,
            `      <a aria-label="${v.filepath}" data-href="${v.filepath}" class="km-video-title" data-link-path="${v.filepath}">${v.title}</a>`,
            `    </div>`,
          ].join("\n");
        }),
        `  </div>`,
        `</div>`,
      ].join("\n");

      render.render(dom);

      console.log("[VideoGallery] Rendered, attaching click handlers...");

      // Attach click handlers
      const galleryEl = document.querySelector(`[data-gallery-id="${galleryId}"]`);
      if (!galleryEl) {
        console.error("[VideoGallery] Gallery element not found after render");
        return false;
      }

      const cards = galleryEl.querySelectorAll(".km-video-card");
      console.log("[VideoGallery] Attaching to", cards.length, "videos");

      cards.forEach((card) => {
        const videoUrl = card.getAttribute("data-video-url");
        if (!videoUrl)
          return;

        // Click handler for video expansion
        card.addEventListener("click", (e) => {
          // Don't expand if clicking the title link
          if ((e.target as HTMLElement).classList.contains("km-video-title"))
            return;

          openVideo(card as HTMLElement, videoUrl);
        });

        // Click handler for title link navigation
        const titleLink = card.querySelector(".km-video-title");
        if (titleLink) {
          titleLink.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent video expansion
            const linkPath = titleLink.getAttribute("data-link-path");
            if (linkPath) {
              // Use Obsidian's API to open the link
              p.app.workspace.openLinkText(linkPath, "", false);
            }
          });
        }
      });

      return true;
    }
    catch (error) {
      console.error("[VideoGallery] FATAL ERROR:", error);
      console.error("[VideoGallery] Stack:", error instanceof Error ? error.stack : "no stack");
      return false;
    }
  });
