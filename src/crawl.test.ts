import { expect, test } from "bun:test";
import { normalizeUrl, getUrlFromHtml } from "./crawl";

test("normalizeUrl", () => {
	expect(normalizeUrl("https://blog.boot.dev/path/")).toBe(
		"blog.boot.dev/path",
	);
	expect(normalizeUrl("https://blog.boot.dev/path")).toBe("blog.boot.dev/path");
	expect(normalizeUrl("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path");
	expect(normalizeUrl("http://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("getUrlFromHtml", () => {
	const testHtml1 = `
    <html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        </body>
    </html>
    `;
	const testHtml2 = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path"><span>Go to Boot.dev</span></a>
            <a href="https://blog.boot.dev/path"><span>Go to Boot.dev</span></a>
            <a href="https://blog.boot.dev/path/path1"><span>Go to Boot.dev</span></a>
            <a href="/path/path2"><span>Go to Boot.dev</span></a>
        </body>
    </html>
    `;

	expect(getUrlFromHtml(testHtml1, "https://blog.boot.dev")).toEqual([
		"blog.boot.dev",
	]);
	expect(getUrlFromHtml(testHtml2, "https://blog.boot.dev")).toEqual([
		"blog.boot.dev/path",
		"blog.boot.dev/path",
		"blog.boot.dev/path/path1",
		"blog.boot.dev/path/path2",
	]);
});
