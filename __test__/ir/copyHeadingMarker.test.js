const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("IR heading markers on copy", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const url = request.url();
            const distMarker = "/dist/";
            if (url.includes("cdn.jsdelivr.net/npm/vditor") && url.includes(distMarker)) {
                const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
                request.continue({url: `http://localhost:9000/${localPath}`});
            } else {
                request.continue();
            }
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            const vditor = window.vditorTest.vditor;
            if (vditor.currentMode !== "ir") {
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit8",
                    ctrlKey: true,
                    key: "8",
                }));
            }
        });
    });

    it("restores an ATX marker when the selection starts inside a heading", async () => {
        const results = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            const copy = (startNode, startOffset, endNode, endOffset) => {
                const range = document.createRange();
                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                const clipboardData = new DataTransfer();
                editor.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData}));
                return clipboardData.getData("text/plain");
            };

            return Array.from({length: 6}, (_, index) => {
                const level = index + 1;
                vditorTest.setValue(`${"#".repeat(level)} 标题 002\n\n测试文本测试`);
                const heading = editor.querySelector(`h${level}`);
                const paragraph = editor.querySelector("p");
                return copy(heading.lastChild, 1, paragraph.firstChild, 5);
            });
        });

        expect(results).toEqual(Array.from({length: 6}, (_, index) =>
            `${"#".repeat(index + 1)} 题 002\n\n测试文本测`));
    });

    it("restores a Setext marker when the selection ends inside a heading", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            vditorTest.setValue("测试文本测试\n\n标题 002\n---");
            const paragraph = editor.querySelector("p");
            const heading = editor.querySelector("h2");
            const range = document.createRange();
            range.setStart(paragraph.firstChild, 0);
            range.setEnd(heading.firstChild, 1);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            editor.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData}));
            return clipboardData.getData("text/plain");
        });

        expect(result).toBe("测试文本测试\n\n标\n--");
    });

    it("does not duplicate an included heading marker", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            vditorTest.setValue("### 标题 002\n\n测试文本测试");
            const heading = editor.querySelector("h3");
            const paragraph = editor.querySelector("p");
            const range = document.createRange();
            range.setStart(heading.firstChild.firstChild, 0);
            range.setEnd(paragraph.firstChild, 5);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            editor.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData}));
            return clipboardData.getData("text/plain");
        });

        expect(result).toBe("### 标题 002\n\n测试文本测");
    });

    it("restores a heading marker on cut", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            vditorTest.setValue("### 标题 002\n\n测试文本测试");
            const heading = editor.querySelector("h3");
            const paragraph = editor.querySelector("p");
            const range = document.createRange();
            range.setStart(heading.lastChild, 1);
            range.setEnd(paragraph.firstChild, 5);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            editor.dispatchEvent(new ClipboardEvent("cut", {bubbles: true, clipboardData}));
            return clipboardData.getData("text/plain");
        });

        expect(result).toBe("### 题 002\n\n测试文本测");
    });

    it("does not create headings for empty boundary fragments", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            const copy = (startNode, startOffset, endNode, endOffset) => {
                const range = document.createRange();
                range.setStart(startNode, startOffset);
                range.setEnd(endNode, endOffset);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                const clipboardData = new DataTransfer();
                editor.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData}));
                return clipboardData.getData("text/plain");
            };

            vditorTest.setValue("### 标题 002\n\n测试文本测试");
            const atxHeading = editor.querySelector("h3");
            const atxParagraph = editor.querySelector("p");
            const atx = copy(atxHeading.lastChild, atxHeading.lastChild.textContent.length,
                atxParagraph.firstChild, 5);

            vditorTest.setValue("测试文本测试\n\n标题 002\n---");
            const setextParagraph = editor.querySelector("p");
            const setextHeading = editor.querySelector("h2");
            const setext = copy(setextParagraph.firstChild, 0, setextHeading.firstChild, 0);
            return {atx, setext};
        });

        expect(result).toEqual({
            atx: "测试文本测",
            setext: "测试文本测试",
        });
    });

    it("keeps a selection within one heading as plain text", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.ir.element;
            vditorTest.setValue("### 标题 002");
            const textNode = editor.querySelector("h3").lastChild;
            const range = document.createRange();
            range.setStart(textNode, 1);
            range.setEnd(textNode, 4);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            editor.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData}));
            return clipboardData.getData("text/plain");
        });

        expect(result).toBe("题 0");
    });

    afterAll(async () => {
        await browser.close();
    });
});
