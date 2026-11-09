const {openEditorPage, newEditor} = require("../util/editorHarness");

describe("WYSIWYG keyboard tags", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    it.each([false, true])("renders, edits and round-trips keyboard tags on mobile=%s", async mobile => {
        await page.setViewport({width: mobile ? 393 : 1024, height: 800, isMobile: mobile, hasTouch: mobile});
        const value = "before <kbd>Ctrl</kbd> + <kbd>C</kbd> after\n";
        await newEditor(page, {value});
        const before = await page.evaluate(() => {
            const root = window.testEditor.vditor.wysiwyg.element;
            return {keys: [...root.querySelectorAll("kbd")].map(element => element.textContent),
                markers: [...root.querySelectorAll(".vditor-wysiwyg__kbd-marker")].map(element => getComputedStyle(element).display),
                value: window.testEditor.getValue()};
        });
        expect(before).toEqual({keys: ["Ctrl", "C"], markers: ["none", "none", "none", "none"], value});
        await page.click(".vditor-wysiwyg kbd");
        await page.waitForFunction(() => window.testEditor.vditor.wysiwyg.element.querySelectorAll(
            ".vditor-wysiwyg__kbd-marker--expand").length === 2);
        await page.evaluate(() => {
            const root = window.testEditor.vditor.wysiwyg.element;
            const range = document.createRange(); range.selectNodeContents(root.querySelector("kbd")); range.collapse(false);
            getSelection().removeAllRanges(); getSelection().addRange(range);
        });
        await page.keyboard.type("X");
        expect(await page.evaluate(() => window.testEditor.getValue())).toBe(value.replace("Ctrl", "CtrlX"));
        const undo = await page.evaluate(() => {
            const editor = window.testEditor;
            editor.vditor.undo.undo(editor.vditor); const undo = editor.getValue();
            editor.vditor.undo.redo(editor.vditor);
            return {undo, redo: editor.getValue(), html: editor.getHTML()};
        });
        expect(undo.undo).toBe(value);
        expect(undo.redo).toBe(value.replace("Ctrl", "CtrlX"));
        expect(undo.html).toContain("<kbd>CtrlX</kbd>");
        expect(undo.html).not.toContain("vditor-wysiwyg__kbd-marker");
        const copied = await page.evaluate(() => {
            const root = window.testEditor.vditor.wysiwyg.element;
            const range = document.createRange(); range.selectNodeContents(root);
            getSelection().removeAllRanges(); getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            root.dispatchEvent(new ClipboardEvent("copy", {clipboardData, bubbles: true, cancelable: true}));
            return clipboardData.getData("text/plain");
        });
        expect(copied).toBe(value.replace("Ctrl", "CtrlX").trim());
        for (const mode of ["ir", "sv", "wysiwyg"]) {
            const markdown = await page.evaluate(mode => {
                const editor = window.testEditor;
                editor.vditor.toolbar.elements["edit-mode"].querySelector(`[data-mode="${mode}"]`).click();
                return editor.getValue();
            }, mode);
            expect(markdown).toBe(value.replace("Ctrl", "CtrlX"));
        }
    });
});
