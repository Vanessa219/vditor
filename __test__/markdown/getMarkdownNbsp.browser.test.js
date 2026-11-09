const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("getMarkdown NBSP browser input", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    it.each(["ir", "wysiwyg"])("writes a regular space typed before bold in a %s table cell", async (mode) => {
        await page.evaluate((currentMode) => {
            const vditor = window.vditorTest;
            if (vditor.getCurrentMode() !== currentMode) {
                const isMac = navigator.platform.toUpperCase().includes("MAC");
                const digit = currentMode === "wysiwyg" ? "7" : "8";
                vditor.vditor[vditor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: `Digit${digit}`,
                    ctrlKey: !isMac,
                    key: digit,
                    metaKey: isMac,
                }));
            }
        }, mode);
        await page.waitForFunction((currentMode) => window.vditorTest.getCurrentMode() === currentMode, {}, mode);

        await page.evaluate(() => {
            window.vditorTest.setValue("| q |\n| - |\n| identifiable**feeder patterns** |");
        });
        await page.waitForFunction((currentMode) => {
            const editor = window.vditorTest.vditor[currentMode].element;
            const selector = currentMode === "wysiwyg" ? "tbody td strong" : "tbody td span[data-type='strong']";
            return Boolean(editor.querySelector(selector));
        }, {}, mode);

        await page.evaluate((currentMode) => {
            const vditor = window.vditorTest;
            const editor = vditor.vditor[currentMode].element;
            const boldElement = currentMode === "wysiwyg" ?
                editor.querySelector("tbody td strong") : editor.querySelector("tbody td span[data-type='strong']");
            const range = document.createRange();
            range.setStartBefore(boldElement);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();
        }, mode);

        await page.keyboard.press("Space");
        await page.waitForFunction(() => window.vditorTest.getValue().includes("identifiable **feeder patterns**"));

        const result = await page.evaluate(() => ({
            mode: window.vditorTest.getCurrentMode(),
            value: window.vditorTest.getValue(),
        }));
        expect(result.mode).toBe(mode);
        expect(result.value).not.toContain("\u00a0");
        expect(result.value).toContain("identifiable **feeder patterns**");
    });

    afterAll(async () => {
        await browser.close();
    });
});
