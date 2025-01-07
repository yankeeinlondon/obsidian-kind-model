import { createKindError } from "@yankeeinlondon/kind-error";

/**
 * An error which occurred while handler was trying to "handle"
 * a code block event.
 */
export const HandlerError = createKindError("HandlerError", {
  handler: "unknown",
});

/**
 * An error which occurs when a `km` query matches none of the
 * known query handlers.
 */
export const UnknownHandler = createKindError("UnknownHandler");

/**
 * The parameters which a user put into a valid Query Handler
 * were unable to be parsed by JSON.
 */
export const ParsingError = createKindError("ParsingError");

/**
 * An error which occurs when a user provides a valid handler
 * but then adds parameters which don't match those which
 * were specfied by the handler.
 */
export const InvalidParameters = createKindError("InvalidParameters");
