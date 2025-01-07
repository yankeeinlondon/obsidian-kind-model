import { isDataviewFile } from "./isDataviewFile";
import { isDataviewPage } from "./isDataviewPage";
import { isStringPageRef } from "./isStringPageRef";
import { isTFile } from "./isTFile";

function is_valid(v: unknown) {
  return !!(isStringPageRef(v)
      || isTFile(v)
      || isDataviewFile(v)
      || isDataviewPage(v));
}

/**
 * - returns `true` when the value passed in is either a _singular_ valid reference
 * or an array of valid references to pages
 * - if the value is an array and _some_ of the values are valid references this
 * will still return a `false` value but you can use the `hasValidReferences()` to
 * test whether iterating through the list is worth doing.
 */
export function isValidReference(val: unknown) {
  return Array.isArray(val)
    ? val.every(i => is_valid(i))
    : is_valid(val);
}

/**
 * - returns `true` when the value passed in is either a _singular_ valid reference
 * or an array with _some_ valid references to pages
 * - if you want to ensure that an array has **all** valid references use
 * `isValidReference()` instead.
 */
export function hasValidReferences(val: unknown) {
  return Array.isArray(val)
    ? val.some(i => is_valid(i))
    : is_valid(val);
}
