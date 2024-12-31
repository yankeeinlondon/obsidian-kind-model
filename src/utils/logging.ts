import { isString } from "inferred-types";
import type { LogLevel } from "~/types/settings_types";

function msg<T extends unknown[]>(list: T) {
  return list.find(i => typeof i === "string") || ("" as string | "");
}



function debug<TLevel extends LogLevel>(level: TLevel) {
  return (...args: unknown[]) => {
    if (level !== "debug") {
      return;
    }
	if (args.length === 1 && isString(args[0])) {
		console.log(`KM: ${args[0]}`)
	} else {

		console.groupCollapsed(`KM(dbg): ${msg(args)}`);
		args.forEach((a) => {
		  if (typeof a === "function") {
			console.log(`fn → `, a());
		  }
		  else if (typeof a === "object" && a !== null) {
			Object.keys(a).map(k =>
			  console.log({ [k]: a[k as keyof typeof a] }),
			);
		  }
		  else {
			console.log(a);
		  }
		});
		console.groupEnd();
	}

  };
}

function info<TLevel extends LogLevel>(level: TLevel) {
  return (...args: unknown[]) => {
    if (["debug"].includes(level)) {
      return;
    }
	if (args.length === 1 && isString(args[0])) {
		console.info(`KM: ${args[0]}`)
	} else {
		console.groupCollapsed(`KM: ${msg(args)}`);
		args.forEach((a) => {
		  if (typeof a === "function") {
			console.info(`fn → `, String(a));
		  }
		  else if (typeof a === "object" && a !== null) {
			Object.keys(a).map(k => console.info({ [k]: a[k as keyof typeof a] }));
		  }
		  else {
			console.info(a);
		  }
		});
		console.groupEnd();
	}
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
	if (args.length === 1 && isString(args[0])) {
		console.warn(`KM: ${args[0]}`);
	} else {
		console.group("KM(warn)");
		args.forEach((a) => {
		  console.warn(a);
		});
		console.groupEnd();
	}
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
  info: ReturnType<typeof info>;
  /** **warn** logger */
  warn: ReturnType<typeof warn>;
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
