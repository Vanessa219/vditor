const path = require("path");
const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe.each(["desktop", "mobile"])("mixed bold and italic editing on %s", platform => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        if (platform === "mobile") {
            await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
            await page.setUserAgent("Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36");
        }
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/lute/lute.min.js")});
        await page.evaluate(() => {
            window.vditorTest.vditor.options.preview.url = "";
            window.vditorTest.vditor.options.undoDelay = 0;
        });
    });
    afterAll(async () => { await browser?.close(); });

    it("keeps mixed formatting through normalization and mode switches", async () => {
        const result = await page.evaluate(() => {
            const lute = Lute.New();
            const input = '<p data-block="0">1<strong>1<em>2</em></strong><em>\u200b1<wbr></em></p>';
            const spun = lute.SpinVditorDOM(input);
            const markdown = lute.VditorDOM2Md(spun);
            window.vditorTest.setValue(markdown, true);
            return {spun, markdown, html: lute.Md2HTML(markdown)};
        });
        const expected = "<p>1<strong>1<em>2</em></strong><em>1</em></p>\n";
        expect(result.spun).toContain("<strong>");
        expect(result.spun).toContain("<wbr>");
        expect(result.html).toBe(expected);
        for (const mode of ["wysiwyg", "sv", "ir", "wysiwyg"]) {
            const html = await page.evaluate(mode => {
                const editor = window.vditorTest;
                if (editor.getCurrentMode() !== mode) {
                    const digit = {wysiwyg: "7", ir: "8", sv: "9"}[mode];
                    const isMac = navigator.platform.toUpperCase().includes("MAC");
                    editor.vditor[editor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true, bubbles: true, code: `Digit${digit}`, ctrlKey: !isMac, key: digit, metaKey: isMac,
                    }));
                }
                return editor.getHTML();
            }, mode);
            expect(html).toBe(expected);
        }
        const copied = await page.evaluate(() => {
            const surface = window.vditorTest.vditor.wysiwyg.element;
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(surface);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            surface.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, cancelable: true, clipboardData}));
            range.selectNodeContents(surface.lastElementChild);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            return Lute.New().Md2HTML(clipboardData.getData("text/plain"));
        });
        expect(copied).toBe(expected);
        await page.keyboard.type("x");
        const history = await page.evaluate(() => {
            const editor = window.vditorTest;
            const edited = editor.getHTML();
            editor.vditor.undo.undo(editor.vditor);
            const undone = editor.getHTML();
            editor.vditor.undo.redo(editor.vditor);
            return {edited, undone, redone: editor.getHTML()};
        });
        expect(history.edited).toContain("x");
        expect(history.undone).toBe(expected);
        expect(history.redone).toBe(history.edited);
    });
});
