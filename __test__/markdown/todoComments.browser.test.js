const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe("PHPStorm TODO comments", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            window.vditorTest.vditor.options.preview.url = "";
            window.vditorTest.vditor.options.undoDelay = 0;
        });
    });
    afterAll(async () => { await browser?.close(); });

    it("preserves parenthesized TODO definitions across modes and undo", async () => {
        const definition = "[//]: # (TODO: remember to report this issue)";
        await page.evaluate(definition => window.vditorTest.setValue(`before\n\n${definition}\n\nafter`, true), definition);
        for (const mode of ["sv", "wysiwyg", "ir", "sv", "ir", "wysiwyg"]) {
            const value = await page.evaluate(mode => {
                const editor = window.vditorTest;
                if (editor.getCurrentMode() !== mode) {
                    const digit = {wysiwyg: "7", ir: "8", sv: "9"}[mode];
                    const isMac = navigator.platform.toUpperCase().includes("MAC");
                    editor.vditor[editor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true, bubbles: true, code: `Digit${digit}`, ctrlKey: !isMac, key: digit, metaKey: isMac,
                    }));
                }
                return editor.getValue();
            }, mode);
            expect(value).toContain(definition);
            expect(value).toContain("before");
            expect(value).toContain("after");
        }
        await page.evaluate(() => {
            const surface = window.vditorTest.vditor.wysiwyg.element;
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(surface.lastElementChild);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        });
        await page.keyboard.type(" edited");
        const values = await page.evaluate(() => {
            const editor = window.vditorTest;
            const edited = editor.getValue();
            editor.vditor.undo.undo(editor.vditor);
            const undone = editor.getValue();
            editor.vditor.undo.redo(editor.vditor);
            return [edited, undone, editor.getValue()];
        });
        values.forEach(value => expect(value).toContain(definition));
        expect(values[0]).toContain("edited");
        expect(values[2]).toBe(values[0]);
    });
});
