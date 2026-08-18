const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("WYSIWYG table cell paste", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            const vditor = window.vditorTest.vditor;
            if (vditor.currentMode !== "wysiwyg") {
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit7",
                    ctrlKey: !navigator.platform.toUpperCase().includes("MAC"),
                    key: "7",
                    metaKey: navigator.platform.toUpperCase().includes("MAC"),
                }));
            }
        });
    });

    it("keeps multiline plain text in the current cell", async () => {
        const result = await page.evaluate(async () => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.wysiwyg.element;
            vditorTest.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |");
            const cell = editor.querySelector("tbody td");
            const range = document.createRange();
            range.selectNodeContents(cell);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();

            const clipboardData = new DataTransfer();
            clipboardData.setData("text/plain", "first\nsecond");
            cell.dispatchEvent(new ClipboardEvent("paste", {
                bubbles: true,
                clipboardData,
            }));
            await new Promise((resolve) => setTimeout(resolve, 100));

            const table = editor.querySelector("table");
            return {
                cellHTML: table.querySelector("tbody td").innerHTML,
                rowCount: table.rows.length,
                value: vditorTest.getValue(),
            };
        });

        expect(result.rowCount).toBe(2);
        expect(result.cellHTML).toContain("first");
        expect(result.cellHTML).toContain("second");
        expect(result.value).toContain("afirst<br />second");
    });

    afterAll(async () => {
        await browser.close();
    });
});
