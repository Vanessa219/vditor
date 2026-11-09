import {launchBrowser, useLocalVditorAssets} from "./launchBrowser";

declare let vditorTest: any;

describe("use puppeteer to test getTextareaPosition", () => {
    let browser: any;
    let page: any;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => typeof vditorTest !== "undefined" && vditorTest.vditor?.lute);
    });

    it("getTextareaPosition", async () => {
        await page.evaluate(() => {
            vditorTest.setValue("vditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditorvditor for jest puppeteer ");
            vditorTest.focus();
        });

        await page.keyboard.type(":");
        await page.waitForFunction(() => {
            const style = vditorTest.vditor.hint.element.style;
            return style.top !== "" && style.left !== "";
        });

        const result = await page.evaluate(() => {
            const style = vditorTest.vditor.hint.element.style;
            return {
                left: style.left,
                top: style.top,
            };
        });
        expect(result.top).toMatch(/^-?\d+(\.\d+)?px$/);
        expect(result.left).toMatch(/^-?\d+(\.\d+)?px$/);
    });

    afterAll(async () => {
        await browser.close();
    });
});
