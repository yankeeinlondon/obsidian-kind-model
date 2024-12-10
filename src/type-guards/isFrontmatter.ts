import type { Frontmatter } from "~/types";
import { isFunction, isObject } from "inferred-types";

export function isFrontmatter(v: unknown): v is Frontmatter {
  return isObject(v) && !isFunction(v);
}
