/**
 * tests to see if the value passed in is:
 *
 * - a string
 * - starts and ends with `[[` and `]]` respectively
 */
export function isStringPageRef(v: unknown): v is `[[${string}]]` {
  return !!(typeof v === "string" && v.startsWith("[[") && v.endsWith("]]"));
}
