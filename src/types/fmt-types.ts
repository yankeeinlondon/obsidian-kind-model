import type { EscapeFunction } from "inferred-types";

export interface UlApi {
  /** indent the unordered list a level */
  indent: (...items: string[]) => string;
  done: EscapeFunction;
}

export type UlCallback = <T extends UlApi>(api: T) => unknown;
