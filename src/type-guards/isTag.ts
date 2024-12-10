import type { Tag } from "~/types";

export function isTag(val: unknown): val is Tag {
  return typeof val === "string" && /#[\w\\]+/.test(val);
}
