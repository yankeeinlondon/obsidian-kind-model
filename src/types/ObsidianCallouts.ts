import { Mutable, TupleToUnion } from "inferred-types";
import { OBSIDIAN_CALLOUT_COLORS, OBSIDIAN_CALLOUT_FOLD_OPTIONS } from "../constants/obsidian-constants";

/**
 * When a block quote sets the `data-callout` to one of these
 * properties then the icon and background colors will be effected.
 * 
 * The color variables are things like `--callout-info`, `--callout-quote`, and
 * they get set to the `--callout-color` for that block of the DOM.
 */
export type ObsidianCalloutColors = TupleToUnion<
	Mutable<typeof OBSIDIAN_CALLOUT_COLORS>
>;

export type ObsidianFoldOptions = TupleToUnion<
	Mutable<typeof OBSIDIAN_CALLOUT_FOLD_OPTIONS>
>;
