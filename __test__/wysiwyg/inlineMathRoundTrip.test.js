const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("inline math round trip", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const url = request.url();
            const distMarker = "/dist/";
            const isVditorCDN = url.includes("cdn.jsdelivr.net/npm/vditor") || url.includes("unpkg.com/vditor");
            if (isVditorCDN && url.includes(distMarker)) {
                const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
                request.continue({url: `http://localhost:9000/${localPath}`});
            } else {
                request.continue();
            }
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    it("preserves inline math through getHTML and html2md", async () => {
        const result = await page.evaluate(() => {
            const markdown = "$a^2 + b^2 = c^2$";
            window.vditorTest.setValue(markdown);
            const html = window.vditorTest.getHTML();
            return {
                html,
                markdown: window.vditorTest.html2md(html),
            };
        });

        expect(result.html).toContain('<span class="language-math">a^2 + b^2 = c^2</span>');
        expect(result.markdown).toBe("$a^2 + b^2 = c^2$\n");
    });

    afterAll(async () => {
        await browser.close();
    });
});
