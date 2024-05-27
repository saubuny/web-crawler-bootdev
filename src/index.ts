import { crawlPage } from "./crawl";

function main() {
	if (Bun.argv.length < 3) {
		console.error("[Error] No given base URL");
		return;
	}
	if (Bun.argv.length > 3) {
		console.error("[Error] Too many arguments");
		return;
	}

	const baseUrl = Bun.argv[2];
	crawlPage(baseUrl);
}

main();

