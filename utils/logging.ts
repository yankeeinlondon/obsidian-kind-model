import { LogLevel } from "settings/Settings";



const msg = <T extends unknown[]>(list: T) => list.find(i => typeof i === "string") as string | undefined;

const trunc = (s: string | undefined) => typeof s === "string"
  ? s.length > 12 
    ? `${s.slice(0,12).trim()}...`
    : `${s}`
  : "";

const debug = (level: LogLevel) =>(...args: unknown[]) => {
  if (level !== "debug") {
    return;
  }

  console.groupCollapsed(`obsidian-kind-model (dbg: ${trunc(msg(args))})`);
  args.forEach(a => {
    console.log(a);
  })
  console.groupEnd();
}

const info = (level: LogLevel) => 
(...args: unknown[]) => {
  if (!["error","warn","info"].includes(level)) {
    return;
  }
  console.groupCollapsed(`obsidian-kind-model (info: ${trunc(msg(args))})`);
  args.forEach(a => {
    console.info(a);
  })
  console.groupEnd();
}

/**
 * Send warning message to console.
 * 
 * Note: _the message will be expanded by default_.
 */
const warn = (level: LogLevel) => (...args: unknown[]) => {
  if (["error"].includes(level)) {
    return;
  }
  console.group("obsidian-kind-model");
  console.warn(...args);
  console.groupEnd();
}
const error = (level: LogLevel) => (...args: unknown[]) => {
  const trunc = (s: string | undefined) => typeof s === "string"
  console.group("obsidian-kind-model (error)");
  console.error(...args);
  console.groupEnd();
  new Notification(`obsidian-kind-model (Error): ${msg(args) || ""}`, {body: "see developer console for more details"});
}
  
export const logger = (level: LogLevel) => ({
  /** **debug** logger */
  debug: debug(level),
  /** **info** logger */
  info: info(level),
  /** **warn** logger */
  warn: warn(level),
  /** **error** logger */
  error: error(level)
})
