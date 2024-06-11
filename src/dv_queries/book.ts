
// ```dataviewjs
// let c = dv.current();
// let blank = `[!blank-container]`
// let h1 = `# ${c.title}`;
// let subtitle = c.subtitle ? `> [!quote] ${c.subtitle}` : "";

import { Date } from "inferred-types";
import { DateTime } from "luxon";
import KindModelPlugin from "../main";
import { DvPage } from "../types/dataview_types";
import { fmt as Fmt } from "../dv_queries/fmt";
import { Component, MarkdownPostProcessorContext } from "obsidian";

// dv.paragraph([
// 	h1,
// 	subtitle
// ].join("\n"));

// const cover = c.coverSmallUrl || c.coverUrl
// 	? [ `>> ![Book Cover](${c.coverSmallUrl || c.coverUrl})` ]
// 	: [];

// const published_by = c.publisher 
// ? [
// 	`>> Published by:`,
// 	`>>  &nbsp;&nbsp;**${c.publisher}**<br/>`,
// ]
// : [];

// const pages = c.totalPage
// ? [ `>> Length: **${c.totalPage}** _pages_<br/>` ]
// : [];

// const kindle = c["kindle-sync"];

// const asin = kindle && kindle.asin
// 	? [ `>> ASIN: ${kindle.asin}` ]
// 	: [];

// dv.paragraph([
// 	`> [!multi-column]`,
// 	`> `,
// 	`>> [!summary|min-0]+`,
// 	...cover,
// 	`>> `,
// 	`>> Written by:`,
// 	`>>  &nbsp;&nbsp;**${c.author || "unknown"}**<br/>`,
// 	...pages,
// 	...published_by,
// 	`>> ISBN: `,
// 	`>> <ul><li>${c.isbn10 || "no isbn10"}</li><li>${c.isbn13  || "no isbn13"}</li></ul><br/>`,
// 	...asin,
// 	`> `,
// 	`>> [!note|wide-2]+ Book Description`,
// 	`>> ${c.description || "no description for this book"}`,
// 	`>`
// ].join("\n"))

// ```


type BookSearchMeta = {
	title?: string;
	subtitle?: string;
	author?: string;
	authors?: string;
	category?: string;
	publisher?: string;
	totalPages?: number;
	coverUrl?: string;
	coverSmallUrl?: string;
	publishDate?: DateTime;
	description?: string;
	link?: string;
	previewLink?: string;
	isbn13?: number;
	isbn10?: number;
}

type KindleSyncMeta = {
	bookId?: `${number}`;
	title?: string;
	author?: string;
	asin?: string;
	lastAnnotatedDate?: Date;
	/** produces a JPG via a remote URL */
	bookImageUrl?: string;
	highlightsCount?: number;
}

type PageMeta = BookSearchMeta & { "kindle-sync": KindleSyncMeta }

export type BookMeta = {
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
	/** Cover Images */
	coverImages: string[];

	googleBookLink?: string;
	authorLink?: string;

	kindleHighlightCount?: number;
};

/**
 * **Book**
 * 
 * A formatter to product a nice looking summary of book.
 * 
 * Based on metadata that is provided by [kindle-sync]() and [book-search]().
 */
export const book = (p: KindModelPlugin) => (
	source: string,
	container: HTMLElement,
	component: Component | MarkdownPostProcessorContext,
	filePath: string
) => (current: DvPage & PageMeta) =>  {
	// const dv = p.dv;
	const fmt = Fmt(p)(container,filePath);
	

	return {
		book: async() => {
			let book: BookMeta = {
				title: current.title || current["kindle-sync"]?.title || "unknown",
				subtitle: current.subtitle,
				authors: current.authors
					? current.authors.split(",").map(i => i.trim())
					: current.author
					? current.author.split(",").map(i => i.trim())
					: current["kindle-sync"].author
					? current["kindle-sync"].author.split(",").map(i => i.trim())
					: [],
				bookCategory: current.category,
				publisher: current.publisher,
				publishDate: current.publishDate,
				totalPages: current.totalPages,
				description: current.description,
				isbn13: current.isbn13,
				isbn10: current.isbn10,
				asin: current["kindle-sync"]?.asin || current?.asin ? String(current?.asin) : undefined,
				coverImages: [
					...(current.coverUrl ? [current.coverUrl] : []),
					...(current["kindle-sync"]?.bookImageUrl ? [current["kindle-sync"]?.bookImageUrl
					] : [])
				],

				googleBookLink: current.link,

				/**
				 * the _number_ of highlights found from a kindle device
				 */
				kindleHighlightCount: current['kindle-sync']?.highlightsCount
			};
			p.info(book);

			if(!book.title && (!book.isbn10 || !book.isbn13 || !book.asin)) {
				p.error(`Book() query requested on a page without necessary metadata! Page must have at least a title and some book identifier (e.g., ISBN10, ISBN13, or ASIN).`);
				
				fmt.callout("warning","No Book metadata found!", {content: `A kind-model query for a book summary was made but we rely on at least a "title" and some book identifier (isbn10, isbn13, or asin are all ok)`});
			} else {
				const author = book.authors.length > 0
				? [
					`<div class="meta-section" style="">Written By:<br/>`,
					fmt.html_ul(...book.authors),
					`<br/>`
				]
				: [];

				const summary = [
					...author,
				].join("\n");

				const html: string[] = [
					`<div class="book-summary" style="display: flex; flex-direction: rows; width: 100%;">`,
					...(
						book.subtitle
							? [
									fmt.blockquote("quote", book.subtitle)
							]
							: []
					),
					// column container
					`<div class="book-cols" style="display:flex; flex-direction: cols; width: 100%;">`,
					// LEFT / SUMMARY
					`<div class="summary-col" style="display:flex; flex-grow:0;">${summary}</div>`,
					// RIGHT / DETAILS
					`<div class="details-col" style="display:flex; flex-grow:1;">details</div>`,
					`</div`
				];

				await fmt.render(html);
			}
		}
	}

};

// https://www.amazon.com/stores/Nora-Roberts/author/B000APK6EU
// https://www.amazon.com/stores/Yuval-Noad-Harari/author/B00ICN066A
// https://www.amazon.com/stores/Yuval-Noah-Harari/author/B00J21BCIW?ref=dbs_m_mng_rwt_byln&qid=1718067895&sr=8-2&isDramIntegrated=true&shoppingPortalEnabled=true
