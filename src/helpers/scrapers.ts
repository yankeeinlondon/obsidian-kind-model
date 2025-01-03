import type { BookMeta } from "../handlers/Book";
import type KindModelPlugin from "../main";
import {
  createDocument,
  findWhere,
  hasSelector,
  peers,
  query,
  queryAll,
  traverseUpward,
} from "@yankeeinlondon/happy-wrapper";
import {
  NUMERIC_CHAR,
  retainWhile,
  stripAfter,
  stripTrailing,
  stripUntil,
} from "inferred-types";
import { DateTime } from "luxon";
import { requestUrl } from "./obsidian";

export const WORLD_CAT_URL = `https://search.worldcat.org/search` as const;

/**
 * Based on a book's title, ISBN, and Author ... creates URL for the
 * WorldCat page for this book.
 */
export async function worldCatBookPage(p: KindModelPlugin, book: BookMeta) {
  const qp: string[] = [];
  if (book.isbn13) {
    qp.push(`bn:${book.isbn13}`);
  }
  else if (book.isbn10) {
    qp.push(`bn:${book.isbn10}`);
  }
  else if ("isbn" in book && [10, 13].includes(String(book.isbn).length)) {
    qp.push(`bn:${book.isbn}`);
  }
  if (book.title) {
    qp.push(`ti:${book.title}`);
  }
  if (book.authors.length > 0) {
    qp.push(`au:${book.authors[0]}`);
  }

  const encode = (s: string[]) =>
    s.map(i => i.replaceAll(" ", "+")).join("+AND+");
  const url = `${WORLD_CAT_URL}?q=${encode(qp)}`;

  p.debug(`World Catalog: ${url}`);

  const resp = await requestUrl({
    url,
    method: "GET",
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Connection": "keep-alive",
    },
  });
  if (resp.status === 200) {
    const html = resp.text;
    p.debug({ resp, html });
  }

  return url;
}

export async function worldCatOtherBooks(p: KindModelPlugin, book: BookMeta) {
  p.info("starting");
  if (book.authors.length === 0) {
    return;
  }

  const url = `${WORLD_CAT_URL}?q=au=${encodeURIComponent(book.authors[0])}`;
  const html = await requestUrl({
    url,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Connection": "keep-alive",
    },
  }).then((r) => {
    p.debug("status", r.status);
    if (r.text) {
      return r.text;
    }
    else {
      return "";
    }
  });
  p.info({ url, html });
  const page = createDocument(html);

  /**
   * gives us a list of books by the author but to get to other interesting content
   * we'll need to move around some
   */
  const books = queryAll(page, "span[aria-labelledby^='author']")?.filter(
    i =>
      i.querySelector("span>a")?.textContent.toLowerCase()
      === book.authors[0].toLowerCase(),
  );

  const info = books.map(b => ({
    source: "WorldCat",
    title: peers(traverseUpward(b, ".MuiBox-root"), "h2")?.textContent,
    titleLink: peers(traverseUpward(b, ".MuiBox-root"), "h2")?.getAttribute(
      "href",
    ),
    summary: traverseUpward(
      b,
      ".MuiBox-root",
    ).nextElementSibling.querySelector("span[aria-labelledby^='summary']")?.textContent,
    imageLink: traverseUpward(b, "a")?.getAttribute("href"),
  }));

  return info;
}

/**
 * scrapes metadata on a Amazon page which is focused on a book
 */
export async function AmazonBook(
  p: KindModelPlugin,
  book: BookMeta,
): Promise<BookMeta> {
  const url = `https://www.amazon.com/dp/${book.asin}`;
  p.debug(`Scraping ${url}`, book);
  let html: string;

  try {
    const req = await requestUrl({
      url,
      method: "GET",
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Connection": "keep-alive",
      },
    });
    html = req.text;
    p.debug("Returned from Amazon API call", html);
  }
  catch (e) {
    p.error(
      `Problems loading book information from Amazon (${url})`,
      e?.msg,
    );
    return book;
  }
  const page = createDocument(html);
  p.debug("page created");

  const amazonRating = page && query(page, "span .a-icon-alt")?.textContent
    ? Number(
        stripAfter(
          query(page, "span .a-icon-alt")?.textContent || "",
          " ",
        ),
      )
    : undefined;

  /** number of reviewers */
  const reviewsAmazon = hasSelector(page, "span .arcCustomerReviewText")
    ? Number(
        stripAfter(
          query(page, "span .arcCustomerReviewText", "throw")
            ?.textContent,
          " ",
        ),
      )
    : undefined;
  /** DOM area where review histogram is presented */
  const histogram = query(page, "#histogramTable", "undefined");
  if (histogram) {
    //
  }

  const isKindleBook = !!query(
    page,
    "#rpi-attribute-book_details-ebook_pages",
    "undefined",
  );

  const description = query(
    page,
    "div[data-a-expander-name=book_description_expander] p span",
  )?.textContent;

  const isbn10 = findWhere(
    page,
    "span.a-text-bold",
    "undefined",
    "contains",
    "ISBN-10",
  )?.nextElementSibling?.textContent;
  const isbn13 = findWhere(
    page,
    "span.a-text-bold",
    "undefined",
    "contains",
    "ISBN-13",
  )?.nextElementSibling?.textContent;

  const [publisher, publicationDate] = findWhere(
    page,
    "span.a-text-bold",
    "undefined",
    "contains",
    "Item Weight",
  )?.nextElementSibling?.textContent.split("(") || [undefined, undefined];

  const weight = findWhere(
    page,
    "span.a-text-bold",
    "undefined",
    "contains",
    "Item Weight",
  )?.nextElementSibling?.textContent;

  const kindleVariantAvailable = isKindleBook === true
    ? true
    : query(page, "#tmm-grid-swatch-KINDLE", undefined) !== undefined;

  const numOfRatings = stripAfter(
    query(page, "#acrCustomerReviewText")?.textContent || "",
    " ratings",
  );

  const pages = isKindleBook
    ? stripAfter(
        query(
          page,
          "#rpi-attribute-book_details-ebook_pages .a-declarative",
        )?.textContent || "",
        " ",
      )
    : retainWhile(
        stripUntil(
          query(page, "#rpi-attribute-book_details-fiona_pages")
            ?.textContent || "",
          ...NUMERIC_CHAR,
        ),
        ...NUMERIC_CHAR,
      );

  p.debug("Amazon", {
    url,
    isKindleBook,
    kindleVariantAvailable,
    pages,
    numOfRatings,
    weight,
    publisher,
    publicationDate,
    isbn10,
    isbn13,
    description,
    rating: amazonRating,
    reviewsAmazon,
  });

  return {
    ...book,
    ratingsAmazon: amazonRating,
    totalPages: book.totalPages ? book.totalPages : pages,
    description: book.description ? book.description : description,
    isKindleBook,
    kindleVariantAvailable,
    reviewsAmazon,
    isbn10: book.isbn10 ? book.isbn10 : isbn10,
    isbn13: book.isbn13 ? book.isbn13 : isbn13,
    weight: book.weight ? book.weight : weight,
    publisher: book.publisher ? book.publisher : publisher?.trim(),
    publishDate: book.publishDate
      ? book.publishDate
      : publicationDate
        ? DateTime.fromFormat(
            stripTrailing(publicationDate, ")"),
            "DATE_MED",
          ).toFormat("yyyy-mm-dd")
        : undefined,
  } as BookMeta;
}
