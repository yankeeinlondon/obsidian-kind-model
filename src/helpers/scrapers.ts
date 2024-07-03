import {  
	createDocument, 
	query, 
	queryAll,  
	peers, 
	traverseUpward, 
	hasSelector, 
	findWhere } from "@yankeeinlondon/happy-wrapper";
import {  requestUrl } from "obsidian";
import { 
	NUMERIC_CHAR, 
	stripAfter, 
	stripBefore,
	retainWhile,
	stripUntil,
	stripTrailing
} from "inferred-types";
import KindModelPlugin from "../main";
import { BookMeta } from "../dv_queries/book";
import { DateTime } from "luxon";

/**
 * scrapes the API version from the site and then 
 * caches this to the 
 */
const _getWorldCatApiVersion = async (p: KindModelPlugin) => {
	let html: string = "";
	const res = await requestUrl("https://search.worldcat.org/search");
	html = res?.text || "";

	if (html !== "") {
		const page = createDocument(html);
		const scriptIdentifier = page.getElementsByTagName("script").find(el => el.getAttribute("src")?.includes("next/static/v"));
		if(!scriptIdentifier) {
			const scriptsWithSource = page.getElementsByTagName("script").map(i => i.getAttribute("src")).filter(i =>  i !== undefined);

			p.error(`Failed to find a script which indicates the API version for WorldCat's book search! The scripts which did have a src tag were as follows: `, {scriptsWithSource});
			return;
		}
		let searchWorldCat = stripAfter(
			stripBefore(
				scriptIdentifier.getAttribute("src"), "static/"
			), 
			"/"
		);

		p.saveData({searchWorldCat});
		p.info(`Saved the WorldCat API version to settings for caching purposes`);
		
		return searchWorldCat;
	}
}

export const WORLD_CAT_URL = `https://search.worldcat.org/search` as const;

/**
 * Based on a book's title, ISBN, and Author ... creates URL for the 
 * WorldCat page for this book.
 */
export const worldCatBookPage =  (p: KindModelPlugin, book: BookMeta) => {
	const qp: string[] = [];
	if (book.isbn13) {
		qp.push(`bn:${book.isbn13}`);
	} else if (book.isbn10) {
		qp.push(`bn:${book.isbn10}`);
	} else if ("isbn" in book && [10,13].includes(String(book.isbn).length)) {
		qp.push(`bn:${book.isbn}`);
	}
	if (book.title) {
		qp.push(`ti:${book.title}`);
	}
	if (book.authors.length > 0) {
		qp.push(`au:${book.authors[0]}`);
	}

	const encode = (s: string[]) => s.map(i => i.replaceAll(" ", "+")).join("+AND+");

	p.debug(`${WORLD_CAT_URL}?q=${encode(qp)}`);

	return `${WORLD_CAT_URL}?q=${encode(qp)}`;
}


export const worldCatOtherBooks = async (p: KindModelPlugin, book: BookMeta) => {
	p.info("starting")
	if(book.authors.length === 0) {
		return;
	}

	const url = `${WORLD_CAT_URL}?q=au=${encodeURIComponent(book.authors[0])}`;
	let html = await requestUrl({
		url,
		headers: {
			Accept: "*/*",
			"Accept-Encoding": "gzip, deflate, br",
			"Cache-Control": "no-cache",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
			Connection: "keep-alive"
		}
	}).then(r => {
			p.debug("status", r.status);
			if (r.text) {
				return r.text
			} else {
				return ""
			}
		});
	p.info({url, html})

	const page = createDocument(html);
	/**
	 * gives us a list of books by the author but to get to other interesting content
	 * we'll need to move around some
	 */
	const books = queryAll(page, "span[aria-labelledby^='author']")?.filter(i => i.querySelector("span>a")?.textContent.toLowerCase() === book.authors[0].toLowerCase());
 
	const info = books.map(b => ({
		source: "WorldCat",
		title: peers(traverseUpward(b, ".MuiBox-root"), "h2")?.textContent,
		titleLink: peers(traverseUpward(b, ".MuiBox-root"), "h2")?.getAttribute("href"),
		summary: traverseUpward(b, ".MuiBox-root").nextElementSibling.querySelector("span[aria-labelledby^='summary']")?.textContent,
		imageLink: traverseUpward(b, "a")?.getAttribute("href"),
	}));


	return info;
}

/**
 * scrapes metadata on a Amazon page which is focused on a book
 */
export const AmazonBook = async (p: KindModelPlugin, b: BookMeta): Promise<BookMeta> => {
	const url = `https://www.amazon.com/dp/${b.asin}`;
	p.info(`Scraping ${url}`, b)

	if(b!.asin) {
		return b;
	}
	try {
		let req = await requestUrl({
			url,
			headers: {
				Accept: "*/*",
				"Accept-Encoding": "gzip, deflate, br",
				"Content-Type": "text/html",
				"Cache-Control": "no-cache",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
				Connection: "keep-alive"
			}
		}).catch(reason => p.error("problem loading Amazon page", reason));
		let html = req.text;
		p.info("Returned from call", html);
		if(html === "") {
			p.error(`Problems load book information from amazon: ${url}`);
			return b;
		}
		let page = createDocument(html);

		let rating = Number(stripAfter(query(page, "span .a-icon-alt").textContent ||"", " "));
		/** number of reviewers */
		let reviewsAmazon = hasSelector(page, "span .arcCustomerReviewText")
			? Number(stripAfter(query(page, "span .arcCustomerReviewText", "throw").textContent, " "))
			: undefined;
		/** DOM area where review histogram is presented */
		let histogram = query(page, "#histogramTable", "undefined");
		if (histogram) {
			//
		}

		let isKindleBook = query(page, "#rpi-attribute-book_details-ebook_pages", "undefined") 
			? true
			: false;

		let description = query(page, "div[data-a-expander-name=book_description_expander] p span").textContent;

		let isbn10 = findWhere(page, "span.a-text-bold", "undefined", "contains", "ISBN-10")?.nextElementSibling?.textContent;
		let isbn13 = findWhere(page, "span.a-text-bold", "undefined", "contains", "ISBN-13")?.nextElementSibling?.textContent;

		let [publisher, publicationDate] = findWhere(
			page, 
			"span.a-text-bold", "undefined", "contains", "Item Weight"
		)?.nextElementSibling?.textContent.split("(") || [undefined, undefined];

		let weight = findWhere(
			page, 
			"span.a-text-bold", "undefined", "contains", "Item Weight"
		)?.nextElementSibling?.textContent;

		let kindleVariantAvailable = isKindleBook === true
			? true
			: query(page, "#tmm-grid-swatch-KINDLE", undefined) === undefined
				? false
				: true;

		let pages = isKindleBook
			? stripAfter(
				query(page, "#rpi-attribute-book_details-ebook_pages .a-declarative").textContent || "",
				" "
			)
			: retainWhile(
				stripUntil(
					query(page, "#rpi-attribute-book_details-fiona_pages")?.textContent || "", 
					...NUMERIC_CHAR
			), ...NUMERIC_CHAR);
		p.info({pages,weight, publisher, publicationDate, isbn10, isbn13, description})

		return {
			...b,
			ratingsAmazon: rating,
			totalPages: b.totalPages ? b.totalPages : pages,
			description: b.description ? b.description : description,
			isKindleBook,
			kindleVariantAvailable,
			reviewsAmazon,
			isbn10: b.isbn10 ? b.isbn10 : isbn10,
			isbn13: b.isbn13 ? b.isbn13 : isbn13,
			weight: b.weight ? b.weight : weight,
			publisher: b.publisher ? b.publisher : publisher?.trim(),
			publishDate: b.publishDate 
				? b.publishDate 
				: publicationDate 
					? DateTime
						.fromFormat(stripTrailing(publicationDate, ")"),"DATE_MED")
						.toFormat("yyyy-mm-dd")
					: undefined
		} as BookMeta

	} catch (e) {
		p.error(`Problems loading book information from Amazon (${url})`, e);
		return b;
	}
}
