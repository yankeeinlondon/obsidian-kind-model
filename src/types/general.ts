import type { Node, RenderableTreeNode } from "@markdoc/markdoc";
import type { EscapeFunction, Scalar } from "inferred-types";

export type Tag = `#${string}`;

/**
 * the _path_ to a page in the vault represented
 * as just a bare string
 */
export type PagePath = string;

export type ExternalLinkDomain =
    | "youtube-video"
    | "youtube-creator"
    | "github-repo";

/**
 * An external link found in frontmatter
 */
export interface PropertyLink {
  property: string;
  /**
   * some property names will resolve to a name
   */
  name?: string;
  url: string;
}

export interface ExternalLink {
  /** the title of the link on the page */
  title: string;
  /** the URL to the resource */
  url: string;

  /**
   * the name of the tag (e.g., "link", "img", etc.); if
   * this was found only in frontmatter than "fm" is value
   * but if in both then page's name is used
   */
  tagName: string;

  hover?: string;

  /**
   * identifies things such as:
   * - youtube-video
   * - youtube-creator
   * - etc.
   */
  domain?: ExternalLinkDomain;
  /**
   * The link is found in the the page's content section
   */
  in_content: boolean;
  /**
   * The link is found in the frontmatter
   */
  in_frontmatter: boolean;
}

export interface UlApi {
  /** indent the unordered list a level */
  indent: (...items: string[]) => string;
  done: EscapeFunction;
}

export type UlCallback = <T extends UlApi>(api: T) => unknown;

export type Traversable<
  T extends RenderableTreeNode | Node = RenderableTreeNode | Node,

> = (T & { [key: string]: any; children?: T[]; parent?: Traversable }) | Scalar;

type WrapperCallback = (items: string) => string;

export interface ListItemsApi<_W extends WrapperCallback> {
  /** indent the list a level using same OL or UL nomenclature */
  indent: (...items: string[]) => string;
  done: EscapeFunction;
}

export type ListItemsCallback = <T extends ListItemsApi<WrapperCallback>>(
  api: T,
) => unknown;
