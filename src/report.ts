import type { Pages } from "./types";

function sortPages(pages: Pages): [string, number][] {
	return Object.entries(pages).sort((a, b) => a[1] - b[1]);
}

export function printReport(pages: Pages): void {
	console.log("Starting Report...");
	const sortedPages = sortPages(pages);
	for (let page in sortedPages) {
		console.log(
			`Found ${sortedPages[page][1]} internal links to ${sortedPages[page][0]}.`,
		);
	}
}
