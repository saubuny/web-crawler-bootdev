import type { Pages } from "./types";
import { JSDOM } from "jsdom";

function removeTrailingSlash(str: string): string {
	if (str.endsWith("/")) return str.substring(0, str.length - 1);
	return str;
}

export function normalizeUrl(urlStr: string): string {
	const url = new URL(urlStr);
	return url.hostname + removeTrailingSlash(url.pathname);
}

export function getUrlFromHtml(htmlBody: string, baseUrl: string): string[] {
	const jsdom = new JSDOM(htmlBody);
	const anchors = jsdom.window.document.querySelectorAll("a");
	const urls: string[] = [];
	anchors.forEach((a) => {
		// Weird quirk where a.pathname does not include the pathname
		if (a.href.includes(baseUrl))
			urls.push(removeTrailingSlash(baseUrl + a.pathname));
		else urls.push(removeTrailingSlash(baseUrl + a.href));
	});
	return urls;
}

async function fetchHtml(url: string) {
	console.log(`Fetching ${url}...`);
	try {
		const res = await fetch(url, {
			method: "get",
		});

		// Using warnings here as this doesn't affect anything
		if (res.status >= 400) {
			// console.warn("[Warning] Error code " + res.status + " during fetch");
			return;
		}

		// Using ! bc lazy :3
		if (!res.headers.get("content-type")!.includes("text/html")) {
			// console.warn(
			// 	"[Warning] Incorrect content-type from fetch, instead got " +
			// 		res.headers.get("content-type"),
			// );
			return;
		}

		return await res.text();
	} catch (err) {
		console.error(err);
		return;
	}
}

// https://www.wagslane.dev/
export async function crawlPage(
	baseUrl: string,
	currentUrl: string = baseUrl,
	pages: Pages = {},
): Promise<Pages> {
	// Should we possibly pass in URL objects instead of strings?
	if (new URL(baseUrl).hostname !== new URL(currentUrl).hostname) return pages;
	const normalizedUrl = normalizeUrl(currentUrl);

	// Might error
	if (pages[normalizedUrl]) {
		pages[normalizedUrl] += 1;
		return pages;
	}
	pages[normalizedUrl] = 1;

	const html = await fetchHtml(currentUrl);
	if (html) {
		const urls = getUrlFromHtml(html, baseUrl);
		for (let url of urls) {
			pages = await crawlPage(baseUrl, url, pages);
		}
	}

	return pages;
}
