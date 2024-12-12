import type { Date } from "inferred-types";
import type { DateTime } from "luxon";
import type { DvPage } from "~/types";
import {
  AMAZON,
  BOOK_CATALOG,
  BOOK_ICON,
  KINDLE_ICON,
  SEARCH_BOOK,
  TIP_ICON,
} from "~/constants";
import { AmazonBook, worldCatBookPage } from "~/helpers/scrapers";
import { isDateTime } from "~/type-guards";
import { createHandler } from "./createHandler";

interface BookSearchMeta {
  title?: string;
  subtitle?: string;
  author?: string;
  authors?: string;
  category?: string;
  publisher?: string;
  totalPage?: number;
  coverUrl?: string;
  coverSmallUrl?: string;
  publishDate?: DateTime;
  description?: string;
  link?: string;
  previewLink?: string;
  isbn13?: number;
  isbn10?: number;
}

interface KindleSyncMeta {
  bookId?: `${number}`;
  title?: string;
  author?: string;
  asin?: string;
  lastAnnotatedDate?: Date;
  /** produces a JPG via a remote URL */
  bookImageUrl?: string;
  highlightsCount?: number;
}

type PageMeta = BookSearchMeta & { "kindle-sync": KindleSyncMeta };

export interface OtherBook {
  source: string;
  title: string;
  titleLink: string;
  summary: string;
  imageLink: string;
}

export interface Author {
  name: string;
  amazonLink?: string;
  googleLink?: string;
  goodReadsLink?: string;
  worldCatLink?: string;
}

/**
 * This plugins internal representation of metadata for Books
 */
export interface BookMeta {
  title: string;
  subtitle?: string;
  authors: string[];
  bookCategory?: string;
  publisher?: string;
  totalPages?: number;
  publishDate?: DateTime;
  description?: string;
  // identifiers
  /** ISBN13 identifier */
  isbn13?: number;
  /** ISBN10 identifier */
  isbn10?: number;
  /** ASIN identifier from Amazon */
  asin?: string;

  /** the book's weight */
  weight?: string;
  /**
   * WorldCat identifier
   *
   * note: appears to be a number but to be safe I just categorized as a string
   * for now.
   */
  oclc?: string;

  worldCatSubjects: string[];

  /** Cover Images */
  coverImages: string[];

  /**
   * the average number of stars (out of 5) on Amazon
   */
  ratingAmazonStars?: number;
  ratingAmazonDistribution?: [number, number, number, number, number];

  /**
   * the average number of stars (out of 5) from Good Reads
   */
  ratingGoodReads?: number;

  /**
   * boolean flag indicating if the particular book referenced _is_ a Kindle book
   */
  isKindleBook?: boolean;
  /**
   * boolean flag indicating if there appears to be a Kindle version of this book
   */
  kindleVariantAvailable?: boolean;

  /**
   * how many ratings the book has
   */
  ratingsAmazon?: number;

  reviewsAmazon?: string[];

  googleBookLink?: string;
  worldCatBookLink?: string;
  amazonBookLink?: string;

  authorLink?: string;

  /** a list of other books by the same author */
  otherBooks?: OtherBook[];

  kindleHighlightCount?: number;
}

/**
 * **Book**
 *
 * A formatter to product a nice looking summary of book.
 *
 * Based on metadata that is provided by [kindle-sync]() and [book-search]().
 */
export const Book = createHandler("Book")
  .scalar()
  .options()
  .handler(async (evt) => {
    const { plugin: p, page } = evt;

    const fmt = p.api.format;
    const current = page.current as DvPage & PageMeta;

    let book: BookMeta = {
      title: current.title || current["kindle-sync"]?.title || "unknown",
      subtitle: current.subtitle,
      authors: current.authors
        ? current.authors.split(",").map(i => i.trim())
        : current.author
          ? current.author.split(",").map(i => i.trim())
          : current["kindle-sync"]?.author
            ? current["kindle-sync"]?.author.split(",").map(i => i.trim())
            : [],
      bookCategory: current.category,
      publisher: current.publisher,
      publishDate: current.publishDate,
      totalPages: current.totalPage,
      description: current.description,
      isbn13: current.isbn13,
      isbn10: current.isbn10,
      asin: current["kindle-sync"]?.asin
        ? current["kindle-sync"].asin
        : typeof current?.asin === "string"
          ? String(current?.asin)
          : undefined,
      coverImages: [
        ...(current.coverUrl ? [current.coverUrl] : []),
        ...(current["kindle-sync"]?.bookImageUrl
          ? [current["kindle-sync"]?.bookImageUrl]
          : []),
      ],

      worldCatSubjects: [],

      googleBookLink: current.link,
      /**
       * provides a link to the WorldCat service with the featured
       * book highlighted.
       */
      worldCatBookLink: undefined,
      /**
       * provides a list of books by the same author
       */
      otherBooks: current.otherBooks as OtherBook[] | undefined,

      /**
       * the _number_ of highlights found from a kindle device
       */
      kindleHighlightCount: current["kindle-sync"]?.highlightsCount,
    };

    if (!book.title && (!book.isbn10 || !book.isbn13 || !book.asin)) {
      p.error(
        `Book() query requested on a page without necessary metadata! Page must have at least a title and some book identifier (e.g., ISBN10, ISBN13, or ASIN).`,
      );

      page.callout("warning", "No Book metadata found!", {
        content: `A kind-model query for a book summary was made but we rely on at least a "title" and some book identifier (isbn10, isbn13, or asin are all ok)`,
      });
    }
    else {
      book.worldCatBookLink = await worldCatBookPage(p, book);
      // get Amazon info
      book = await AmazonBook(p, book);
      p.debug("Book after Amazon Scrape", { book });

      const cover = [
        `<div class="book-cover" style="padding-bottom: 8px;">`,
        book.coverImages.length > 0
          ? `<img src="${book.coverImages[0]}" style="">`
          : ``,
        `</div>`,
      ];

      const publisher = book.publisher
        ? [
            fmt.medium("Publisher:"),
            fmt.ul([book.publisher], {
              indentation: "default",
              my: "tight",
            }),
          ]
        : [];

      const publicationDate = book.publishDate
        ? [
            fmt.medium("Publication Date:"),
            isDateTime(book.publishDate)
              ? fmt.ul([book?.publishDate?.toFormat("LLL yyyy")], {
                  indentation: "default",
                  my: "tight",
                })
              : "unknown format",
          ]
        : [];

      const pages = book.totalPages
        ? [
            fmt.medium("Length:&nbsp;"),
            fmt.ul(
              [
                `${fmt.normal(book.totalPages)} ${fmt.light("pages", { ts: "sm" })}`,
              ],
              { indentation: "default", my: "tight" },
            ),
          ]
        : [];

      const author
        = book.authors.length > 0
          ? [
              fmt.medium("Written By:"),
              fmt.ul(book.authors, {
                indentation: "default",
                my: "tight",
              }),
            ]
          : [];

      const book_ids = [
        `<div class="book-ids">`,
        fmt.medium("Book Identifiers:"),
        fmt.ul(
          [
            book.isbn10
              ? `${fmt.light(book.isbn10, { ts: "sm" })}&nbsp;${fmt.medium("&nbsp;isbn10", { ts: "xs" })}`
              : undefined,
            book.isbn13
              ? `${fmt.light(book.isbn13, { ts: "sm" })}&nbsp;${fmt.medium("&nbsp;isbn13", { ts: "xs" })}`
              : undefined,
            book.asin
              ? `${fmt.light(book.asin, { ts: "sm" })}&nbsp;${fmt.medium("&nbsp;asin", { ts: "xs" })}`
              : undefined,
          ],
          { indentation: "default", my: "tight" },
        ),
        `</div>`,
      ];

      const summary = fmt.blockquote("example", "Summary", {
        content: fmt.wrap(
          [
            ...cover,
            ...author,
            ...publisher,
            ...publicationDate,
            ...pages,
            ...book_ids,
          ],
          { my: "4px", px: "8px" },
        ),
        style: {
          mr: "8px",
          ml: "8px",
        },
      });

      const description = fmt.blockquote("info", "Book Description", {
        fold: "+",
        content: book.description || "no description found",
      });

      const otherBooks = book.otherBooks
        ? [
            fmt.blockquote("info", `Books by ${book.authors[0]}`, {
              content:
                book.otherBooks
                  .map((b) => {
                    return fmt.link(b.title, b.titleLink, {
                      iconUrl: b.imageLink,
                    });
                  })
                  .join("\n") || "&nbsp;",
              icon: BOOK_ICON,
              fold: "-",
            }),
          ]
        : [];

      const actions = fmt.blockquote("info", "Actions / Links", {
        content: fmt.wrap(
          [
            book.asin
              ? fmt.link(
                  "Open in Kindle",
                  `kindle://book?action=open&asin=${book.asin}`,
                  { svgInline: KINDLE_ICON },
                )
              : undefined,
            book.asin
              ? fmt.link("Amazon", `https://www.amazon.com/dp/${book.asin}`, {
                  svgInline: AMAZON,
                })
              : undefined,
            book.googleBookLink
              ? fmt.link("Google", book.googleBookLink, {
                  svgInline: BOOK_ICON,
                })
              : undefined,
            book.worldCatBookLink
              ? fmt.link("WorldCat", book.worldCatBookLink, {
                  svgInline: BOOK_CATALOG,
                })
              : undefined,
            fmt.link(
              "Search",
              `https://google.com/search?q=${book.title} by ${book.authors.join(", ")}`,
              { svgInline: SEARCH_BOOK },
            ),
            // fmt.link(
            // 	"Update Metadata",
            // 	`https://google.com/?q=${book.title} by ${book.authors.join(", ")}`,
            // 	{ svgInline: META_DATA}
            // ),
          ],
          { flex: true, direction: "row", ts: "sm", gap: "12px" },
        ),
        fold: "+",
      });

      const reviews = fmt.blockquote("info", "Reviews", {
        content: "not available currently",
        fold: "-",
        icon: TIP_ICON,
      });

      const details = fmt.wrap(
        [
          description,
          reviews,
          ...otherBooks,
          actions,
          fmt.emptyCallout({ flex: true, grow: 1 }),
        ],
        { flex: true, direction: "column" },
      );

      const html: string[] = [
        `<div class="book-summary">`,
        ...(book.subtitle
          ? [
              `<div class="book-subtitle" style="display:block; width: 100%">`,
              fmt.blockquote("quote", book.subtitle, {
                style: { mb: "8px" },
              }),
              `</div>`,
            ]
          : []),
        // column container
        `<div class="book-cols" style="display:flex; flex-direction: cols; width: 100%;">`,
        // LEFT / SUMMARY
        `<div class="summary-col" style="display:flex; flex-grow:0; max-width: 30%;">${summary}</div>`,
        // RIGHT / DETAILS
        details,
        `</div`,
      ];

      await page.render(html.join("\n"));
    }
  });
