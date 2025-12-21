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
