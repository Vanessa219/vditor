const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("selection symbol wrapping", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    for (const mode of ["wysiwyg", "ir", "sv"]) {
        it.each([['"', '"'], ["'", "'"], ["`", "`"], ["(", ")"], ["[", "]"], ["{", "}"]])(
            `${mode}: wraps with %s and supports undo/redo`, async (opening, closing) => {
                await newEditor(page, {mode, value: "hello"});
                await page.evaluate(mode => {
                    const editor = window.testEditor.vditor[mode].element;
                    editor.focus();
                    if (mode === "sv") { editor.setSelectionRange(0, 5); }
                    else {
                        const range = document.createRange(); range.selectNodeContents(editor.firstElementChild);
                        getSelection().removeAllRanges(); getSelection().addRange(range);
                    }
                }, mode);
                await page.keyboard.type(opening);
                const result = await page.evaluate(() => {
                    const instance = window.testEditor;
                    const after = instance.getValue();
                    instance.vditor.undo.undo(instance.vditor);
                    const undo = instance.getValue();
                    instance.vditor.undo.redo(instance.vditor);
                    return {after, undo, redo: instance.getValue()};
                });
                expect(result.after.trim()).toBe(opening + "hello" + closing);
                expect(result.undo.trim()).toBe("hello");
                expect(result.redo).toBe(result.after);
            });

        it(`${mode}: leaves composition and collapsed insertion alone`, async () => {
            await newEditor(page, {mode, value: "hello"});
            const result = await page.evaluate(mode => {
                const element = window.testEditor.vditor[mode].element;
                element.focus();
                if (mode === "sv") { element.setSelectionRange(0, 5); }
                else {
                    const range = document.createRange(); range.selectNodeContents(element.firstElementChild);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                }
                const event = new InputEvent("beforeinput", {data: '"', inputType: "insertText",
                    isComposing: true, cancelable: true, bubbles: true});
                element.dispatchEvent(event);
                if (mode === "sv") { element.setSelectionRange(0, 0); }
                else { getSelection().collapseToStart(); }
                const collapsed = new InputEvent("beforeinput", {data: '"', inputType: "insertText",
                    cancelable: true, bubbles: true});
                element.dispatchEvent(collapsed);
                return {prevented: event.defaultPrevented, collapsed: collapsed.defaultPrevented, value: window.testEditor.getValue()};
            }, mode);
            expect(result).toEqual({prevented: false, collapsed: false, value: "hello\n"});
        });

        it(`${mode}: inserts one quote at a caret after the first undo bookmark`, async () => {
            await newEditor(page, {mode, value: "hello"});
            await page.evaluate(mode => {
                const element = window.testEditor.vditor[mode].element;
                element.focus();
                if (mode === "sv") { element.setSelectionRange(5, 5); }
                else {
                    const range = document.createRange(); range.selectNodeContents(element.firstElementChild); range.collapse(false);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                }
            }, mode);
            await page.keyboard.type('"');
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe('hello"\n');
        });

        if (mode !== "sv") { it(`${mode}: keeps rich formatting inside quotes`, async () => {
            await newEditor(page, {mode, value: "**bold**"});
            await page.evaluate(mode => {
                const element = window.testEditor.vditor[mode].element;
                element.focus();
                const range = document.createRange(); range.selectNodeContents(element.firstElementChild);
                getSelection().removeAllRanges(); getSelection().addRange(range);
            }, mode);
            await page.keyboard.type('"');
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe('"**bold**"\n');
        }); }
    }

    it.each(["wysiwyg", "ir", "sv"])("%s: supports committed text input on mobile", async mode => {
        await page.setViewport({width: 393, height: 800, isMobile: true, hasTouch: true});
        await newEditor(page, {mode, value: "hello"});
        const result = await page.evaluate(mode => {
            const element = window.testEditor.vditor[mode].element;
            element.focus();
            if (mode === "sv") { element.setSelectionRange(0, 5); }
            else {
                const range = document.createRange(); range.selectNodeContents(element.firstElementChild);
                getSelection().removeAllRanges(); getSelection().addRange(range);
            }
            element.dispatchEvent(new InputEvent("beforeinput", {data: "“", inputType: "insertText", bubbles: true, cancelable: true}));
            return window.testEditor.getValue();
        }, mode);
        expect(result).toBe("“hello”\n");
    });
});
