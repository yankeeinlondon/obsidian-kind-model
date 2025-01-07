import { ensureLeading } from "inferred-types";

export const asTag = (tag: string) => ensureLeading(tag, "#");

export function asDisplayTag(tag: string,	asHtml: boolean = false) {
  return asHtml
    ? `<code>${asTag(tag)}</code>`
    : `<code>${asTag(tag)}</code>`;
}
