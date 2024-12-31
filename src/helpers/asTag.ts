import { ensureLeading } from "inferred-types";

export const asTag = (tag: string) => ensureLeading(tag, "#");

export const asDisplayTag = (tag: string) => `\`${asTag(tag)}\``;
