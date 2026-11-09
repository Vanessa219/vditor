const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe.each(["desktop", "mobile"])("multiline paragraph heading conversion on %s", platform => {
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
        await page.evaluate(() => {
            const editor = window.vditorTest;
            editor.vditor.options.preview.url = "";
            editor.vditor.options.undoDelay = 0;
            editor.vditor[editor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true, bubbles: true, code: "Digit7", ctrlKey: true,
            }));
        });
    });
    afterAll(async () => { await browser?.close(); });

    it.each(["first\nsecond\nthird", "first  \nsecond  \nthird"])("normalizes %s before saving", async markdown => {
        const result = await page.evaluate(markdown => {
            const editor = window.vditorTest;
            editor.setValue(markdown, true);
            const original = editor.getHTML();
            const surface = editor.vditor.wysiwyg.element;
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(surface.firstElementChild);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            surface.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true, bubbles: true, code: "Digit1", ctrlKey: true,
            }));
            const value = editor.getValue();
            const before = surface.innerHTML;
            const heading = surface.querySelector("h1").textContent;
            const text = surface.textContent;
            const caretInside = surface.contains(getSelection().anchorNode);
            editor.vditor.undo.undo(editor.vditor);
            const undone = editor.getHTML();
            editor.vditor.undo.redo(editor.vditor);
            const redone = surface.innerHTML;
            editor.setValue(value, true);
            return {value, before, after: surface.innerHTML, heading, text, caretInside, undone, redone, original};
        }, markdown);
        expect(result.heading).toBe("first");
        expect(result.text).toContain("second");
        expect(result.text).toContain("third");
        expect(result.before).toBe(result.after);
        expect(result.caretInside).toBe(true);
        expect(result.undone).toBe(result.original);
        expect(result.redone).toBe(result.before);
    });
});
