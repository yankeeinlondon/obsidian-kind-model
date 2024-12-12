import type { DvPage } from "~/types";

import {
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  retainUntil,
  WHITESPACE_CHARS,
} from "inferred-types";
import {
  badge,
  bold,
  describeDate,
  getDate,
  getMonth,
  getWhenDate,
  getYear,
  htmlLink,
  italic,
  journalFile,
  light,
  nextDay,
  priorDay,
} from "~/api";
import { blockquote } from "~/api/formatting/blockquote";
import { CALENDAR_DATE } from "~/constants";
import { moment } from "~/globals";
import { createHandler } from "./createHandler";

export const Journal = createHandler("Journal")
  .scalar()
  .options({
    thisYearFormat: "string",
    otherYearFormat: "string",
    fileFormat: "string",
  })
  .handler(async (evt) => {
    const p = evt.plugin;
    const page = evt.page;

    if (page) {
      const when = getWhenDate(p)(page);

      if (when) {
        const format = evt.options.fileFormat || "journal/YYYY/YYYY-MM-DD";
        /** previous day link */
        const prev = htmlLink(p)(journalFile(format, priorDay(when)), {
          createPageWhereMissing: true,
          display: describeDate(when, -1),
        });
        /** next day link */
        const next = htmlLink(p)(journalFile(format, nextDay(when)), {
          createPageWhereMissing: true,
          display: describeDate(when, +1),
        });
        const holidays = p.dv
          .pages(
            `#holiday/${getMonth(when)}-${getDate(when)} OR #day/${getMonth(when)}-${getDate(when)}`,
          )
          .where(p => p.file.tags.includes("#holiday"));

        const holiday = holidays.values.map(h => h.file.name).join(" / ");

        p.info("journal", holidays.length, holidays);
        p.info("journal", holidays.length, holidays, holiday);

        const events = Array.from(
          p.dv
            .pages(
              [
                `#event/${getMonth(when)}-${getDate(when)} `,
                `#event/${getYear(when)}-${getMonth(when)}-${getDate(when)}`,
                `#day/${getYear(when)}-${getMonth(when)}-${getDate(when)}`,
                `#day/${getMonth(when)}-${getDate(when)}`,
              ].join(" OR "),
            )
            .where(p => p.file.tags.includes("#event"))
            .map((e: DvPage) => {
              return `<li>${htmlLink(p)(e.file.path)}</li>`;
            }),
        ).join("\n");

        const meetings = Array.from(
          p.dv
            .pages(
              [
                `#meeting/${getMonth(when)}-${getDate(when)} `,
                `#meeting/${getYear(when)}-${getMonth(when)}-${getDate(when)}`,
                `#day/${getYear(when)}-${getMonth(when)}-${getDate(when)}`,
                `#day/${getMonth(when)}-${getDate(when)}`,
              ].join(" OR "),
            )
            .where(p => p.file.tags.includes("#meeting"))
            .map((e: DvPage) => {
              return `<li>${htmlLink(p)(e.file.path)}</li>`;
            }),
        ).join("\n");

        const heading = [
          `<div id="journal-heading" style="width:100%">`,

          `<h1 id="day-and-date" style="margin-bottom: 4px">`,
          CALENDAR_DATE,
          isThisYear(when)
            ? moment(when).format("ddd, MMMM Do")
            : moment(when).format("ddd, MMM Do, YYYY"),
          `</h1>`,

          `<div class="secondary-bar" style="display: flex; width: 100%; padding-bottom: 1rem;">`,
          `<span class="relative-date" style="flex-grow: 1">${holiday ? `${holiday},` : ""}`,
          isToday(when) || isYesterday(when) || isTomorrow(when)
            ? badge(
                retainUntil(moment(when).calendar(), ...WHITESPACE_CHARS),
                isToday(when) ? "green" : isYesterday(when) ? "gray" : "blue",
              )
            : light(italic(moment(when).fromNow())),
          `</span>`,
          `<span id="date-nav" style="display: flex; ">`,
          `<span class="spacer" style="display: flex; flex-grow: 1"> </span>`,
          `<span class="nav-buttons" style="display:flex; flex-grow: 0">`,
          prev,
          "&nbsp;▫️&nbsp;",
          next,
          `</span>`,
          `</span>`,
          `</div>`,
          events.length > 0
            ? [
                `<h3 id="journal-events">Events</h3>`,
                `<ul>`,
                events,
                `</ul>`,
              ].join("\n")
            : `<!-- no events -->`,
          meetings.length > 0
            ? [
                `<h3 id="journal-meetings">Meetings</h3>`,
                `<ul>`,
                meetings,
                `</ul>`,
              ].join("\n")
            : `<!-- no events -->`,
        ].join("\n");

        page.render(heading);
      }
      else {
        page.render(
          blockquote("error", "Invalid Date", {
            content: `The ${bold("Journal")} kind query expects the "when" or "date" frontmatter property to be set with a valid ISO 8601 date string; or as a fallback that the title/name of the page lead with an ISO 8601 date.`,
          }),
        );
      }
    }
  });
