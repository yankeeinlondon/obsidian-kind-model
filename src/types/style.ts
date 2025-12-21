import type {
  CssCursor,
  CssDisplay,
  CssPosition,
  CssSizing,
  EmptyObject,
} from "inferred-types";
import type { ObsidianFoldOptions } from "./ObsidianCallouts";

export interface UserStyleOptions {
  /** padding for top,bottom,left, and right */
  p?: string;
  /** padding top */
  pt?: string;
  /** padding bottom */
  pb?: string;
  /** pad left */
  pl?: string;
  /** pad right */
  pr?: string;
  /** padding top and bottom */
  py?: string;
  /** padding left and right */
  px?: string;

  /** margin applied to all sides */
  m?: string;
  /** margin to left and right */
  mx?: string;
  /** margin to top and bottom */
  my?: string;
  /** margin top */
  mt?: string;
  /** margin bottom */
  mb?: string;
  /** margin left */
  ml?: string;
  /** margin right */
  mr?: string;

  /**
   * text size
   */
  ts?:
      | "xs"
      | "sm"
      | "base"
      | "lg"
      | "xl"
      | "2xl"
      | `${number}rem`
      | `${number}rem`;

  /** width */
  w?: string;
  /**
   * font weight
   */
  fw?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  /** font style */
  fs?:
      | "italic"
      | "none"
      | "oblique"
      | `oblique ${number}deg`
      | "unset"
      | "inherit"
      | "revert"
      | "revert-layer";

  flex?: boolean;
  display?: CssDisplay;
  direction?: "row" | "column";
  grow?: number;

  /**
   * [alignItems](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-items)
   *
   * This defines the default behavior for how flex items are laid out along
   * the cross axis on the current line. Think of it as the justify-content
   * version for the cross-axis (perpendicular to the main-axis).
   */
  alignItems?: "center" | "baseline" | "start" | "end" | "revert" | "stretch";

  /**
   * [alignContent](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-content)
   *
   * aligns a flex container’s lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.
   */
  alignContent?:
      | "normal"
      | "start"
      | "end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly"
      | "stretch";
  /**
   * [justify-content](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-justify-content)
   *
   * defines the alignment along the main axis. It helps distribute extra free
   * space leftover when either all the flex items on a line are inflexible, or
   * are flexible but have reached their maximum size. It also exerts some
   * control over the alignment of items when they overflow the line.
   */
  justifyContent?:
      | "start"
      | "end"
      | "left"
      | "right"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
  justifyItems?: "space-around";

  gap?:
      | CssSizing
      | `${CssSizing} ${CssSizing}`
      | "inherit"
      | "initial"
      | "revert"
      | "unset"
      | "revert-layer";
  cursor?: CssCursor;

  /** add in some other bespoke CSS key/values */
  bespoke?: string[];

  /**
   * the position property in CSS (e.g., relative, absolute, sticky, etc.)
   */
  position?: CssPosition;

  opacity?: string | number;
}

export type StyleOptions<_TOverride extends UserStyleOptions = EmptyObject>
  = UserStyleOptions;

export interface BlockQuoteOptions {
  /**
   * The content area directly below the title line.
   */
  content?: string | string[];

  /**
   * Add content on title row but pushed to the right
   */
  toRight?: string;

  contentStyle?: StyleOptions;

  /**
   * The style for the overall callout block
   */
  style?: StyleOptions;
  fold?: ObsidianFoldOptions;
  /**
   * if you want to override the "kind" of callout's
   * default icon you can by passing in inline SVG.
   */
  icon?: string;
  /**
   * content below callout area but still within the
   * folding region that is registered.
   */
  belowTheFold?: string;

  /**
   * style attributes which effect the `belowTheFold`
   * section when used.
   *
   * @default padding: var(--callout-content-padding)
   */
  belowTheFoldStyle?: StyleOptions;

  /**
   * Adds a DIV below the content section and makes it a `flex` _with_
   * **grow** on. The intent is to _grow_ this blockquote into the available
   * vertical space of the parent container.
   *
   * @default false
   */
  growHeight?: boolean;
}

// LI
// padding-top: var(--list-spacing)
// padding-bottom: var(--list-spacing)

// UL
// padding-inline-start: var(--list-indent)
// margin-block-start: var(--p-spacing)
// margin-block-end: var(--p-spacing)

export interface ListStyle {
  /**
   * Set the indentation level on the `UL` or `OL` element
   */
  indentation?: "default" | "12px" | "16px" | "20px" | "24px" | "none";
  /**
   * set the top margin for the list block (using `margin-block-start`)
   */
  mt?: "default" | "none" | "tight" | "spaced" | `${number}px` | `${number}rem`;
  /**
   * set the top margin for the list block (using `margin-block-end`)
   */
  mb?: "default" | "none" | "tight" | "spaced" | `${number}px` | `${number}rem`;
  /**
   * set _both_ top and bottom margins for the list block
   */
  my?: "default" | "none" | "tight" | "spaced" | `${number}px` | `${number}rem`;
  /** styling for list items */
  li?: StyleOptions | ((text: string) => StyleOptions);
}
