
import { 
	createDocument, 
	hasSelector, 
	HappyDoc,
	IElement,
	query, 
	queryAll, 
	findWhere,
	isElement
} from "@yankeeinlondon/happy-wrapper";

type Element = IElement;

import { readFileSync } from "fs";
import { NUMERIC_CHAR, retainWhile, stripAfter, stripUntil } from "inferred-types";
import { describe, it, beforeAll } from "vitest";
import { BookMeta } from "../src/dv_queries/book"
import { as_number } from "../src/utils/as_number"

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to 
// gain validation that no new type vulnerabilities have cropped up.

let page: HappyDoc;
let book: BookMeta;

describe("Name", () => {


	beforeAll(() => {
		page = createDocument(readFileSync("./test/data/amazon-book.html", "utf-8"));
		book = {
			title: "The Definitive Guide to SQLite (Expert's Voice in Open Source)",
			authors: [
				"Grant Allen"
			],
			totalPages: undefined,
			asin: "B004VHAZH6",
			coverImages: [
				"https://m.media-amazon.com/images/I/61U+-Ty1SPL._SY160.jpg"
			],
			"worldCatSubjects": [],
			"worldCatBookLink": "https://search.worldcat.org/search?q=ti:The+Definitive+Guide+to+SQLite+(Expert's+Voice+in+Open+Source)+AND+au:Grant+Allen+and+Mike+Owens",
			"kindleHighlightCount": 2,
			ratingsAmazon: undefined,
			isKindleBook: false,
			kindleVariantAvailable: true
		}
	})

	
	it("first test", () => {
		/** number of reviewers */
		let reviewsAmazon = hasSelector(page, "span .arcCustomerReviewText")
			? Number(stripAfter(query(page, "span .arcCustomerReviewText", "throw")?.textContent, " "))
			: undefined;
		/** DOM area where review histogram is presented [ 5-star, 4-star, 3-star, 2-star, 1-star ] */
		let histogram = queryAll(page, "#histogramTable tr").map((el: IElement) => el.lastChild.textContent);
		if (histogram) {
			//
		}

		let pages: number | undefined = undefined;
		let xrayEnabled: boolean | undefined  = undefined;
		let textToSpeech: boolean | undefined = undefined;
		let enhancedTypesetting: boolean | undefined = undefined;
		let screenReader: boolean | undefined = undefined;
		let editorialReview: string | undefined = undefined;

		let detailListing = query(page, "#detailBullets_feature_div", "undefined");
		if (detailListing) {
			let printLength = findWhere(detailListing, "span.a-text-bold", "empty", "contains", "Print length");
			if (isElement(printLength)) {
				pages = Number(stripAfter(printLength.nextElementSibling.textContent || "", " pages"))
			}

			let xray = findWhere(detailListing, "span.a-text-bold", "empty", "contains", "X-Ray");
			if (xray) {
				xrayEnabled = (xray.nextElementSibling?.textContent || "").includes("Not Enabled")
					? false
					: (xray.nextElementSibling?.textContent || "").includes("Enabled")
					? true
					: undefined;
			}

			let text2speech = findWhere(detailListing, "span.a-text-bold", "empty", "contains", "Text-to-Speech");
			if (text2speech) {
				textToSpeech = (text2speech.nextElementSibling?.textContent || "").includes("Not Enabled")
				? false
				: (text2speech.nextElementSibling?.textContent || "").includes("Enabled")
				? true
				: undefined;
			}

			let typesetting = findWhere(detailListing, "span.a-text-bold", "empty", "contains", "Enhanced typesetting");
			if (typesetting) {
				enhancedTypesetting = (typesetting.nextElementSibling?.textContent || "").includes("Not Enabled")
				? false
				: (typesetting.nextElementSibling?.textContent || "").includes("Enabled")
				? true
				: undefined;
			}

			let reader = findWhere(detailListing, "span.a-text-bold", "empty", "contains", "Screen Reader");
			if (reader) {
				screenReader = (reader.nextElementSibling?.textContent || "").includes("Not Supported")
				? false
				: (reader.nextElementSibling?.textContent || "").includes("Supported")
				? true
				: undefined;
			}
		}

		if(hasSelector(page, "h2", { contains: "Editorial Reviews" } )) {
			let review = findWhere(page, "h2", "throw", "contains", "Editorial Reviews");
			let sections = review.nextElementSibling
			? queryAll(review.nextElementSibling, "h3").map(el => {
				const heading = `<p><b>${el.textContent}</b></p>\n`;
				const body = `<p>${el.nextElementSibling.textContent}</p>`;
				return [heading,body].join("");
			})
			: undefined;
			editorialReview = sections.join("\n");
		}

		let isKindleBook = query(page, "#rpi-attribute-book_details-ebook_pages", "undefined") 
		? true
		: false;
		let description = query(page, "div[data-a-expander-name=book_description_expander] p span")?.textContent;
		let edition = query(page, "#rpi-attribute-book_details-edition .rpi-attribute-value")?.textContent?.trim();
		let publisher = query(page, "#rpi-attribute-book_details-publisher .rpi-attribute-value")?.textContent?.trim();
		let publication_date = query(page, "#rpi-attribute-book_details-publication_date .rpi-attribute-value")?.textContent?.trim();
		let language = query(page, "#rpi-attribute-language .rpi-attribute-value")?.textContent?.trim();
		let file_size = query(page, "#rpi-attribute-book_details-file_size .rpi-attribute-value")?.textContent?.trim();
		let isbn10 = query(page, "#rpi-attribute-book_details-isbn10 .rpi-attribute-value")?.textContent?.trim();
		let isbn13 = query(page, "#rpi-attribute-book_details-isbn13 .rpi-attribute-value")?.textContent?.trim();
		let dimensions = query(page, "#rpi-attribute-book_details-dimensions .rpi-attribute-value")?.textContent?.trim();
		let weight = queryAll(
			page, 
			"#detailBullets_feature_div ul li .a-text-bold"
		).find((i: Element) => i.textContent?.includes("Weight"))?.nextElementSibling?.textContent;

		let amazonOrderLink = hasSelector(page, "#booksInstantOrderUpdate")
			? query(page, "#booksInstantOrderUpdate", "throw")?.parentElement
				?.querySelector("a")?.getAttribute("href")
			: undefined;

		let kindleVariantAvailable = isKindleBook === true
			? true
			: query(page, "#tmm-grid-swatch-KINDLE", undefined) === undefined
				? false
				: true;
	
		let numOfRatings = query(page, "#acrCustomerReviewText")
			? Number(
				stripAfter(query(page, "#acrCustomerReviewText").textContent || "", " ratings")
			)
			: undefined;
		let amazonRating = Number(stripAfter(query(page, "span .a-icon-alt").textContent ||"", " "));
		let goodReadsRating = Number((query(page, ".gr-review-rating-text span")?.textContent || "").trim());

		let reviews = queryAll(page, "#cm-cr-dp-review-list [data-hook]=review").map((el: Element) => 
			el.querySelector("span[data-hook]=review-body")?.textContent
			).slice(0,3)

		/** Kindle, Hardcover, etc. */
		let format = queryAll(page, ".a-color-secondary")
			.find((i: IElement)=> i.textContent?.includes("Format"))
				?.nextElementSibling?.textContent;

		/**
		 * gives us a list of books by the author but to get to other interesting content
		 * we'll need to move around some
		 */
		const books = queryAll(page, "span[aria-labelledby^='author']")?.filter(i => i.querySelector("span>a")?.textContent.toLowerCase() === book.authors[0].toLowerCase());				
	
		if (!pages) {
			// second attempt at finding pages
			pages = isKindleBook
				? as_number(stripAfter(
					query(page, "#rpi-attribute-book_details-ebook_pages .a-declarative")?.textContent || "",
					" "
				))
				: as_number(retainWhile(
					stripUntil(
						query(page, "#rpi-attribute-book_details-fiona_pages .rpi-attribute-value")?.textContent || "", 
						...NUMERIC_CHAR
				), ...NUMERIC_CHAR));
		}

	console.log({
		amazonRating, 
		goodReadsRating,
		histogram,
		reviews,
		pages, 
		books,
		edition,
		format,
		numOfRatings, 
		isKindleBook,
		kindleVariantAvailable, 
		weight, 
		isbn10, 
		isbn13, 
		description, 
		reviewsAmazon, 
		publisher,
		publication_date,
		language,
		file_size,
		dimensions,
		amazonOrderLink,
		xrayEnabled,
		textToSpeech,
		enhancedTypesetting,
		screenReader,
		editorialReview
	});
	
	

  });

});
