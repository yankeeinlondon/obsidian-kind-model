import type { YouTubeEmbedUrl, YouTubeVideoUrl } from "inferred-types";
import {
  isYouTubeVideoUrl as inferredIsYouTubeVideoUrl,
  youtubeEmbed as inferredYoutubeEmbed,
} from "inferred-types";

/**
 * **isYouTubeVideoUrl**`(val)`
 *
 * Enhanced type guard which checks whether the passed in value is a valid
 * YouTube URL which plays video, including support for YouTube Shorts.
 *
 * Supported formats:
 * - `https://www.youtube.com/watch?v={videoId}`
 * - `https://youtube.com/watch?v={videoId}`
 * - `https://youtu.be/{videoId}`
 * - `https://www.youtube.com/shorts/{videoId}`
 * - `https://youtube.com/shorts/{videoId}`
 */
export function isYouTubeVideoUrl(val: unknown): val is YouTubeVideoUrl {
  if (typeof val !== "string") {
    return false;
  }

  // Check if it's a Shorts URL
  if (
    val.startsWith("https://www.youtube.com/shorts/")
    || val.startsWith("https://youtube.com/shorts/")
  ) {
    return true;
  }

  // Fall back to the inferred-types implementation for standard URLs
  return inferredIsYouTubeVideoUrl(val);
}

/**
 * **youtubeEmbed**`(url)`
 *
 * Takes a Video URL from YouTube and converts it to an "embed" URL
 * that can be put into an iframe. Supports standard YouTube URLs,
 * share URLs, and Shorts URLs.
 *
 * @param url - A YouTube video URL
 * @returns An embed URL in the format `https://www.youtube.com/embed/{videoId}`
 */
export function youtubeEmbed(url: YouTubeVideoUrl): YouTubeEmbedUrl {
  // Handle YouTube Shorts URLs
  if (
    url.startsWith("https://www.youtube.com/shorts/")
    || url.startsWith("https://youtube.com/shorts/")
  ) {
    // Extract video ID from shorts URL
    // Format: https://www.youtube.com/shorts/{videoId}
    const parts = url.split("/");
    const videoId = parts[parts.length - 1]?.split("?")[0]; // Remove any query params

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}` as YouTubeEmbedUrl;
    }
    else {
      throw new Error(
        `Unable to extract video ID from YouTube Shorts URL: ${url}`,
      );
    }
  }

  // Fall back to the inferred-types implementation for standard URLs
  return inferredYoutubeEmbed(url);
}

/**
 * **youtubeEmbedWithApi**`(url)`
 *
 * Takes a Video URL from YouTube and converts it to an "embed" URL
 * with the YouTube IFrame API enabled. Adds the `enablejsapi=1` parameter
 * and the origin parameter for security.
 *
 * @param url - A YouTube video URL
 * @returns An embed URL with API enabled
 */
export function youtubeEmbedWithApi(url: YouTubeVideoUrl): YouTubeEmbedUrl {
  const baseUrl = youtubeEmbed(url);
  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` as YouTubeEmbedUrl;
}

/**
 * **extractVideoId**`(url)`
 *
 * Extracts the video ID from various YouTube URL formats.
 * Supports standard watch URLs, short URLs (youtu.be), embed URLs, and Shorts URLs.
 *
 * @param url - A YouTube video URL
 * @returns The video ID, or null if extraction fails
 */
export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Handle youtu.be short URLs
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1).split("?")[0];
    }

    // Handle Shorts URLs
    if (urlObj.pathname.startsWith("/shorts/")) {
      return urlObj.pathname.split("/shorts/")[1]?.split("?")[0] || null;
    }

    // Handle embed URLs
    if (urlObj.pathname.startsWith("/embed/")) {
      return urlObj.pathname.split("/embed/")[1]?.split("?")[0] || null;
    }

    // Handle standard watch URLs
    if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
      return urlObj.searchParams.get("v");
    }

    return null;
  }
  catch {
    return null;
  }
}

/**
 * **getYouTubeThumbnail**`(url)`
 *
 * Gets the medium-quality thumbnail URL for a YouTube video.
 * Uses mqdefault (medium quality, 320x180) for grid display.
 *
 * @param url - A YouTube video URL
 * @returns The thumbnail URL, or null if video ID cannot be extracted
 */
export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractVideoId(url);
  if (!videoId)
    return null;
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * **getYouTubeThumbnailHD**`(url)`
 *
 * Gets the high-quality thumbnail URL for a YouTube video.
 * Uses maxresdefault (max quality) for expanded view.
 *
 * @param url - A YouTube video URL
 * @returns The HD thumbnail URL, or null if video ID cannot be extracted
 */
export function getYouTubeThumbnailHD(url: string): string | null {
  const videoId = extractVideoId(url);
  if (!videoId)
    return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
