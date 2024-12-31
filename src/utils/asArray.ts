/**
 * ensures that the value passed in is an array
 */
export function asArray<T>(val: T) {
  return (
    Array.isArray(val) ? (val as T) : [val]
  ) as
  T extends any[] ? T : [T];
}
