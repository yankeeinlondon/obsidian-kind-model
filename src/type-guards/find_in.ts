type TypeGuard<T> = (value: unknown) => value is T;

/**
 * **find_in**`(tg<T>) → (...values) → T | undefined`
 *
 * A higher order function which receives a TypeGuard which
 * then provides a utility to test a number of values for that
 * type; returning the _first_ value which meets the criteria
 * (or _undefined_ if not found)
 */
export function find_in<
  TG extends TypeGuard<any>,
>(tg: TG) {
  return (...values: unknown[]) => {
    const found: unknown = values.find(v => tg(v));

    return found as TG extends TypeGuard<infer T> ? T | undefined : unknown | undefined;
  };
}
