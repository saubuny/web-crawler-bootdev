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

export { normalizeUrl, getUrlFromHtml };
