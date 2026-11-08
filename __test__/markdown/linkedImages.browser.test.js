const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe("linked images across editing modes", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => { window.vditorTest.vditor.options.preview.url = ""; });
    });
    afterAll(async () => { await browser?.close(); });

    it("preserves five images and their links through repeated switches and reloading", async () => {
        const markdown = Array.from({length: 5}, (_, i) => {
            const image = `![${i + 1}.jpg](https://example.com/load?fileId=image-${i})`;
            return i ? `[${image}](https://example.com/API?article=${i}&group=TrustID%20%20&version=322)` : image;
        }).join("\n\n");
        await page.evaluate(markdown => window.vditorTest.setValue(markdown, true), markdown);
        for (const mode of ["sv", "wysiwyg", "ir", "sv", "ir", "wysiwyg"]) {
            const result = await page.evaluate(({mode, markdown}) => {
                const editor = window.vditorTest;
                if (editor.getCurrentMode() !== mode) {
                    const digit = {wysiwyg: "7", ir: "8", sv: "9"}[mode];
                    const isMac = navigator.platform.toUpperCase().includes("MAC");
                    editor.vditor[editor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true, bubbles: true, code: `Digit${digit}`, ctrlKey: !isMac, key: digit, metaKey: isMac,
                    }));
                }
                const value = editor.getValue();
                editor.setValue(value, true);
                return {mode: editor.getCurrentMode(), html: editor.getHTML(), expected: Lute.New().Md2HTML(markdown)};
            }, {mode, markdown});
            expect(result.mode).toBe(mode);
            expect(result.html).toBe(result.expected);
            expect((result.html.match(/<img /g) || []).length).toBe(5);
        }
    });
});
