import { JSDOM } from "jsdom";

function removeTrailingSlash(str: string): string {
	if (str.endsWith("/")) return str.substring(0, str.length - 1);
	return str;
}

function normalizeUrl(urlStr: string): string {
	const url = new URL(urlStr);
	return url.hostname + removeTrailingSlash(url.pathname);
}

function getUrlFromHtml(htmlBody: string, baseUrl: string): string[] {
	baseUrl = normalizeUrl(baseUrl);
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

// https://www.wagslane.dev/
async function crawlPage(url: string) {
	try {
		const res = await fetch(url, {
			method: "get",
		});

		if (res.status >= 400) {
			console.error("[Error] Error code " + res.status + " during fetch");
			return;
		}

		// Using ! bc lazy :3
		if (!res.headers.get("content-type")!.includes("text/html")) {
			console.error(
				"[Error] Incorrect content-type from fetch, instead got " +
					res.headers.get("content-type"),
			);
			return;
		}

		console.log(await res.text());
	} catch (err) {
		console.error(err);
	}
}

export { normalizeUrl, getUrlFromHtml, crawlPage };
