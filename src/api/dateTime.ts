import type {
  Iso8601Date,
  Iso8601DateTime,
} from "inferred-types";
import type KindModelPlugin from "~/main";
import type { PageReference } from "~/types";
import {
  isIsoExplicitDate,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  retainUntil,
  stripAfter,
  WHITESPACE_CHARS,
} from "inferred-types";
import { moment } from "~/globals";
import { getPageInfo } from "~/page";

/**
 * **getWhenDate**
 *
 * Get's the "when" date from a page where a "when date" is:
 *
 * - the date found in the `when` property, when present
 * - the date found in the `date` property, when present
 * - the `YYYY-MM` or `YYYY-MM-DD` text prefix in the page's name
 *
 * If neither are present then an _undefined_ value is passed back.
 */
export function getWhenDate(p: KindModelPlugin) {
  return (ref: PageReference): Iso8601Date<"explicit"> | undefined => {
    const page = getPageInfo(p)(ref);

    if (page) {
      const { when, date } = page.current.file.frontmatter;
      const prop = when || date;

      if (prop && isIsoExplicitDate(prop)) {
        return prop;
      }

      if (page.name.includes("-")) {
        const pre = retainUntil(page.name, ...WHITESPACE_CHARS);
        if (isIsoExplicitDate(pre)) {
          return pre;
        }
      }
    }

    p.info("when", { page, ref });

    return undefined;
  };
}

/**
 * given an ISO compliant date or datetime, returns `YYYYMMDD`
 */
export function asRawDateString(date: Iso8601Date | Iso8601DateTime) {
  const raw = date.replaceAll("-", "");
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);

  return `${year}${month}${day}`;
}

/**
 * given an ISO compliant date or datetime, returns `YYYY-MM-DD`
 */
export function asDateString(date: Iso8601Date | Iso8601DateTime) {
  const d = moment(date);
  const year = String(d.year());
  const month = String(d.month());
  const day = String(d.date());

  return `${year}-${month}-${day}`;
}

/**
 * Return today's YEAR as a string of YYYY
 */
export const todaysYear = () => String(moment(Date.now()).year());

/**
 * Return today's MONTH as a string of MM
 */
export const todaysMonth = () => String(moment(Date.now()).month());

/**
 * Return today's DATE as a string of DD
 */
export const todaysDate = () => String(moment(Date.now()).date());

/** returns an ISO date for today (YYYY-MM-DD) */
export function getToday() {
  const dt = moment(Date.now()).toISOString(true);

  return stripAfter(dt, "T");
}

/** returns an ISO date for yesterday (YYYY-MM-DD) */
export function getYesterday() {
  const dt = moment(Date.now()).subtract("1", "day").toISOString(true);

  return stripAfter(dt, "T");
}

/** returns an ISO date for tomorrow (YYYY-MM-DD) */
export function getTomorrow() {
  const dt = moment(Date.now()).add("1", "day").toISOString(true);

  return stripAfter(dt, "T");
}

export function getYear(forDate: Iso8601Date | Iso8601DateTime) {
  const date = stripAfter(forDate, "T");
  return isIsoExplicitDate(date) ? date.split("-")[0] : date.slice(0, 4);
}

export function getMonth(forDate: Iso8601Date | Iso8601DateTime) {
  const date = stripAfter(forDate, "T");
  return isIsoExplicitDate(date) ? date.split("-")[1] : date.slice(4, 6);
}

export function getDate(forDate: Iso8601Date | Iso8601DateTime) {
  const date = stripAfter(forDate, "T");
  return isIsoExplicitDate(date) ? date.split("-")[2] : date.slice(6, 8);
}

export function priorDay(date: Iso8601Date<"explicit">): Iso8601Date<"explicit"> {
  const prior = stripAfter(
    moment(date).subtract("1", "day").toISOString(true),
    "T",
  ) as Iso8601Date<"explicit">;
  return prior;
}

export function nextDay(date: Iso8601Date<"explicit">): Iso8601Date<"explicit"> {
  const next = stripAfter(
    moment(date).add("1", "day").toISOString(true),
    "T",
  ) as Iso8601Date<"explicit">;
  return next;
}

/**
 * Creates a full file path to a journal file of a given date.
 *
 * - if no date is provided then TODAY is assumed
 * - the trailing `.md` IS included
 */
export function journalFile(format: string,	dayOf: Iso8601Date | Iso8601DateTime | undefined = undefined) {
  const [year, month, day] = dayOf
    ? [getYear(dayOf), getMonth(dayOf), getDate(dayOf)]
    : [todaysYear(), todaysMonth(), todaysDate()];

  if (
    !format.includes("YYYY")
    && !format.includes("MM")
    && !format.includes("DD")
  ) {
    throw new Error(
      `a journal file was passed in with a static format string: ${format}; must have at least one dynamic segment!`,
    );
  }

  const filepath = format
    .replaceAll("YYYY", year)
    .replaceAll("MM", month)
    .replaceAll("DD", day);

  return filepath;
}

export function asExplicitIso8601Date(date: Iso8601Date | Iso8601DateTime): Iso8601Date<"explicit"> {
  const d = stripAfter(date, "T");
  return isIsoExplicitDate(d)
    ? d
    : (`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` as Iso8601Date<"explicit">);
}

/**
 * Provides either "today", "tomorrow", "yesterday" for near
 * based dates but then falls back on one of two formats for
 * other dates:
 *
 * - dates in the same year will use `Do MMM` (aka, 12th Jun)
 * - dates in a differnt year from current will use `Do MMM, YYYY`
 *
 * Both fallback formats can be explicitly changed with the optional
 * `sameYear` and `diffYear` parameters.
 *
 * You can also offset the date -- _by days_ -- in a positive or negative
 * manner prior to determining the presentatino of the date.
 */
export function describeDate(date: Iso8601Date | Iso8601DateTime,	offset: number = 0,	sameYear: string = "MMM Do",	diffYear: string = "MMM Do, YYYY") {
  const d = moment(asExplicitIso8601Date(date)).add(offset, "days");

  return isToday(d)
    ? "today"
    : isYesterday(d)
      ? "yesterday"
      : isTomorrow(d)
        ? "tomorrow"
        : isThisYear(d)
          ? d.format(sameYear)
          : d.format(diffYear);
}
