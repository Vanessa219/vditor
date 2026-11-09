const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("empty literal pair deletion", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    const select = (mode, offset = 2) => page.evaluate((mode, offset) => {
        const element = window.testEditor.vditor[mode].element;
        element.focus();
        if (mode === "sv") { element.setSelectionRange(offset, offset); }
        else {
            const text = element.firstElementChild.firstChild;
            const range = document.createRange(); range.setStart(text, offset); range.collapse(true);
            getSelection().removeAllRanges(); getSelection().addRange(range);
        }
    }, mode, offset);
    for (const mode of ["wysiwyg", "ir", "sv"]) {
        for (const key of ["Backspace", "Delete"]) {
            it.each(["()", "[]", "{}", '""', "''", "``", "**", "~~", "$$", "（）", "****", "~~~~", "````",
                ...(mode === "sv" ? ["$$$$"] : [])])(
                `${mode}: ${key} removes %s with undo/redo`, async pair => {
                    const value = "x" + pair + "y\n";
                    await newEditor(page, {mode, value});
                    await select(mode, 1 + pair.length / 2);
                    await page.keyboard.press(key);
                    const result = await page.evaluate(() => {
                        const instance = window.testEditor;
                        const after = instance.getValue();
                        instance.vditor.undo.undo(instance.vditor); const undo = instance.getValue();
                        instance.vditor.undo.redo(instance.vditor);
                        return {after, undo, redo: instance.getValue()};
                    });
                    expect(result.after).toBe("xy\n");
                    expect(result.undo).toBe(value);
                    expect(result.redo).toBe(result.after);
                });
        }
        it(`${mode}: ignores non-empty pairs, composition and disabled editors`, async () => {
            await newEditor(page, {mode, value: "x(a)y"}); await select(mode);
            const result = await page.evaluate(mode => {
                const instance = window.testEditor;
                const element = instance.vditor[mode].element;
                const dispatch = composing => {
                    const event = new InputEvent("beforeinput", {inputType: "deleteContentBackward",
                        isComposing: composing, cancelable: true, bubbles: true});
                    element.dispatchEvent(event); return event.defaultPrevented;
                };
                const normal = dispatch(false); const composing = dispatch(true);
                instance.disabled(); const disabled = dispatch(false);
                return {normal, composing, disabled, value: instance.getValue()};
            }, mode);
            expect(result).toEqual({normal: false, composing: false, disabled: false, value: "x(a)y\n"});
        });
    }

    it.each(["wysiwyg", "ir", "sv"])("%s: deletes through mobile input events", async mode => {
        await page.setViewport({width: 393, height: 800, isMobile: true, hasTouch: true});
        await newEditor(page, {mode, value: "x()y"}); await select(mode);
        const result = await page.evaluate(mode => {
            const element = window.testEditor.vditor[mode].element;
            element.dispatchEvent(new InputEvent("beforeinput", {inputType: "deleteContentBackward", bubbles: true, cancelable: true}));
            return window.testEditor.getValue();
        }, mode);
        expect(result).toBe("xy\n");
    });
});
