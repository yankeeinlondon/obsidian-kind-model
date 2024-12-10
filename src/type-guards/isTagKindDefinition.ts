import type { KindDefinition } from "~/types";
import { isObject } from "inferred-types";

/**
 * type guard which validates that `val` is a KindDefinition with a `tag` specified
 */
export function isTagKindDefinition(val: unknown): val is KindDefinition<["tag"]> {
  return isObject(val) && "tag" in val && typeof val.tag === "string";
}

/**
 * type guard which validates that `val` is a KindDefinition with a `tag` specified
 */
export function isKindDefinition(val: unknown): val is KindDefinition<["tag"]> {
  return isObject(val) && "path" in val && typeof val.tag === "string" && "hash" in val && typeof val.hash === "number";
}
