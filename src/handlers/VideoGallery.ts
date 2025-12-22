import type { YouTubeVideoUrl } from "inferred-types";
import type { PageContent } from "../helpers/pageContent";
import type { PagePath } from "../types/general";
import { type } from "arktype";
import { pageContent } from "../helpers/pageContent";
import { getYouTubeThumbnail, getYouTubeThumbnailHD, youtubeEmbedWithApi } from "../helpers/youtube";
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
    const embedUrl = youtubeEmbedWithApi(videoUrl as YouTubeVideoUrl);
    iframe.src = `${embedUrl}&autoplay=1`;
    iframe.allow = "autoplay; encrypted-media; fullscreen";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.style.cssText = "width:100%; height:100%; border:none; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease; z-index:2;";

    clone.appendChild(iframe);

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
