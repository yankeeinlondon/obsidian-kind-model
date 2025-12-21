import type { YouTubeVideoUrl } from "inferred-types";
import type { PageContent } from "../helpers/pageContent";
import type { PagePath } from "../types/general";
import { type } from "arktype";
import { pageContent } from "../helpers/pageContent";
import { youtubeEmbed } from "../helpers/youtube";
import { createHandlerV2 } from "./createHandler";
import { registerHandler } from "./registry";

/**
 * ArkType schema for VideoGallery options.
 * Size enum: S (small), M (medium), L (large)
 */
const VideoGalleryOptionsSchema = type({
  "+": "reject",
  "size?": "'S' | 'M' | 'L'",
});

// Register the handler with the registry
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

/**
 * Renders a gallery of YouTube videos from backlinks
 */
export const VideoGallery = createHandlerV2("VideoGallery")
  .noScalar()
  .optionsSchema(VideoGalleryOptionsSchema)
  .handler(async (evt) => {
    const { plugin: p, page, render } = evt;

    interface Video {
      url: YouTubeVideoUrl;
      filepath: PagePath;
      title: string;
    }
    // all the videos found on pages which link to current page
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
            title:
              i.title.toLowerCase() === "video" ? pg.page.file.name : i.title,
            filepath: pg.filepath,
          })) as Video[]),
      ];
    });

    const size = evt?.options?.size || "M";

    const grid_cols
      = size === "L" ? 2 : size === "M" ? 3 : size === "S" ? 4 : 5;
    const dom = [
      `<div class="video-gallery" style="display: grid; grid-template-columns: repeat(${grid_cols}, minmax(0, 1fr)); gap: 8px;">`,
      ...videos.map((v) => {
        const src = youtubeEmbed(v.url);
        const node = [
          `<div class="video-stack" style="display: flex; flex-direction: column; aspect-ratio: 1.75 auto">`,
          `<iframe class="video-ref" content-editable="false" aria-multiline="true" allow="fullscreen" frameborder="0" sandbox="allow-same-origin allow-modals allow-popups allow-presentation allow-forms" src="${src}"></iframe>`,
          `<a data-tooltip-position="top" aria-label="${v.filepath}" data-href="${v.filepath}" class="internal-link data-link-icon data-link-text" _target="_blank" rel="noopener" data-link-path="${v.filepath}" style="">${v.title}</a>`,
          `</div>`,
        ].join("\n");
        return node;
      }),

      "</div>",
    ].join("\n");

    render.render(dom);

    return true;
  });
