import puppeteer from "puppeteer";

declare let vditorTest: any;

describe("use puppeteer to test getTextareaPosition", () => {
    let browser: any;
    let page: any;
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage(),
        ]);
        await page.goto("http://localhost:9000/");
    });

    it("getTextareaPosition", async () => {
        await page.evaluate(() => {
            vditorTest.setValue("vditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditor for jest puppeteer :");
        });

        await page.waitFor(1000);

        const result = await page.evaluate(() => {
            return vditorTest.vditor.hint.element.getAttribute("style");
        });
        expect(result).toContain("top: -61px;");
        expect(result).toContain("left: 191px;");
    });

    afterAll(async () => {
        await browser.close();
    });
});
