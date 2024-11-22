/**
 * returns the **moment** library which Obsidian provides to the
 * global namespace.
 */
export const moment = globalThis.moment;

export type Moment = ReturnType<typeof moment>;
