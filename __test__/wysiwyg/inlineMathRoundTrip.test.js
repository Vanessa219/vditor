const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("inline math round trip", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
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
