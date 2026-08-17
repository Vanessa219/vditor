const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("WYSIWYG Android cursor navigation", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/127.0.0.0 Mobile Safari/537.36");
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            const vditor = window.vditorTest.vditor;
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true,
                bubbles: true,
                code: "Digit7",
                ctrlKey: !isMac,
                key: "7",
                metaKey: isMac,
            }));
        });
        await page.waitForFunction(() => window.vditorTest.vditor.currentMode === "wysiwyg");
    });

    afterAll(async () => {
        await browser.close();
    });

    const setCaret = async (markdown, paragraphIndex, offset) => {
        await page.evaluate(({caretOffset, index, value}) => {
            window.vditorTest.setValue(value);
            const editor = window.vditorTest.vditor.wysiwyg.element;
            const textNode = editor.querySelectorAll(":scope > p")[index].firstChild;
            const range = document.createRange();
            range.setStart(textNode, caretOffset);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();
            window.cursorKeyDefaultPrevented = false;
            editor.onkeydown = (event) => {
                window.cursorKeyDefaultPrevented = event.defaultPrevented;
            };
        }, {caretOffset: offset, index: paragraphIndex, value: markdown});
    };

    it("moves and extends the selection with direction keys", async () => {
        await setCaret("abcdef", 0, 3);

        await page.keyboard.press("ArrowLeft");
        expect(await page.evaluate(() => ({
            defaultPrevented: window.cursorKeyDefaultPrevented,
            offset: getSelection().anchorOffset,
        }))).toEqual({defaultPrevented: true, offset: 2});

        await page.keyboard.press("ArrowRight");
        expect(await page.evaluate(() => getSelection().anchorOffset)).toBe(3);

        await page.keyboard.down("Shift");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.up("Shift");
        expect(await page.evaluate(() => getSelection().toString())).toBe("d");
    });

    it("moves to the document end without losing editor focus", async () => {
        await setCaret("first line\n\nsecond line", 0, 3);

        await page.keyboard.press("End");
        expect(await page.evaluate(() => {
            const editor = window.vditorTest.vditor.wysiwyg.element;
            return {
                active: document.activeElement.isSameNode(editor),
                defaultPrevented: window.cursorKeyDefaultPrevented,
                insideEditor: editor.contains(getSelection().anchorNode),
                offset: getSelection().anchorOffset,
                text: getSelection().anchorNode.textContent,
            };
        })).toEqual({
            active: true,
            defaultPrevented: true,
            insideEditor: true,
            offset: 11,
            text: "second line",
        });
    });
});
