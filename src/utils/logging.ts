import type { LogLevel } from "~/types/settings_types";

function msg<T extends unknown[]>(list: T) {
  return list.find(i => typeof i === "string") || ("" as string | "");
}

function trunc(s: string | undefined) {
  return typeof s === "string"
    ? s.length > 12
      ? `${s.slice(0, 12).trim()}...`
      : `${s}`
    : "";
}

function debug<TLevel extends LogLevel>(level: TLevel) {
  return (...args: unknown[]) => {
    if (level !== "debug") {
      return;
    }

    console.groupCollapsed(`KM(dbg): ${trunc(msg(args))}`);
    args.forEach((a) => {
      if (typeof a === "function") {
        console.log(`fn → `, a());
      }
      else if (typeof a === "object" && a !== null) {
        Object.keys(a).map(k =>
          console.info({ [k]: a[k as keyof typeof a] }),
        );
      }
      else {
        console.log(a);
      }
    });
    console.groupEnd();
  };
}

function info<TLevel extends LogLevel>(level: TLevel) {
  return (...args: unknown[]) => {
    if (["debug"].includes(level)) {
      return;
    }
    console.groupCollapsed(`KM(i): ${trunc(msg(args))}`);
    args.forEach((a) => {
      if (typeof a === "function") {
        console.log(`fn → `, String(a));
      }
      else if (typeof a === "object" && a !== null) {
        Object.keys(a).map(k => console.log({ [k]: a[k as keyof typeof a] }));
      }
      else {
        console.log(a);
      }
    });
    console.groupEnd();
  };
}

/**
 * Send warning message to console.
 *
 * Note: _the message will be expanded by default_.
 */
function warn<TLevel extends LogLevel>(level: TLevel) {
  return (...args: unknown[]) => {
    if (["error"].includes(level)) {
      return;
    }
    console.group("KM(warn)");
    args.forEach((a) => {
      console.warn(a);
    });
    console.groupEnd();
  };
}
function error<TLevel extends LogLevel>(_level: TLevel) {
  return (...args: unknown[]) => {
    console.groupEnd();
    new Notification(`KM(err): ${msg(args) || ""}`, {
      body: "see developer console for more details",
    });

    class KindModelError extends Error {
      kind: "KindModel Error";

      constructor(msg: string) {
        super(msg);
      }
    }

    throw new KindModelError(
      args.map(i => String(i)).join(", ") || "Kind Model error",
    );
  };
}

export interface Logger<TLevel extends LogLevel = LogLevel> {
  level: TLevel;
  /** **debug** logger */
  debug: ReturnType<typeof debug>;
  /** **info** logger */
  info: ReturnType<typeof debug>;
  /** **warn** logger */
  warn: ReturnType<typeof debug>;
  /** **error** logger */
  error: ReturnType<typeof error>;
}

export function logger<
  TLevel extends LogLevel,
  TReturn extends Omit<Logger<TLevel>, "level"> | undefined,
>(level: LogLevel, context?: TReturn): Logger<LogLevel> {
  const api: Logger<LogLevel> = {
    level,
    debug: debug(level),
    info: info(level),
    warn: warn(level),
    error: error(level),
  };

  if (context) {
    for (const k of Object.keys(api)) {
      if (k !== "level" && Object.keys(context).includes(k)) {
        (context as any)[k as keyof Omit<Logger<TLevel>, "level">]
          = api[k as keyof typeof api];
      }
    }
  }

  return api;
}
