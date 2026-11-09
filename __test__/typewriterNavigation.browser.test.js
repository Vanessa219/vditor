const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("typewriter navigation", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    for (const mode of ["wysiwyg", "ir", "sv"]) {
        it.each([false, true])(`${mode}: keyboard navigation respects typewriterMode=%s`, async enabled => {
            await newEditor(page, {mode, typewriterMode: enabled, height: 200,
                value: Array.from({length: 50}, (_, i) => `line ${i}`).join("\n\n")});
            const result = await page.evaluate(mode => {
                const instance = window.testEditor;
                const element = instance.vditor[mode].element;
                const before = instance.getValue();
                element.focus();
                if (mode === "sv") {
                    const offset = element.value.indexOf("line 20");
                    element.setSelectionRange(offset, offset);
                } else {
                    const range = document.createRange();
                    range.selectNodeContents(element.children[20]); range.collapse(true);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                }
                const positions = [];
                for (const key of ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"]) {
                    element.scrollTop = 0;
                    element.dispatchEvent(new KeyboardEvent("keyup", {key, bubbles: true}));
                    positions.push(element.scrollTop);
                }
                element.scrollTop = 0;
                element.dispatchEvent(new KeyboardEvent("keyup", {key: "ArrowDown", isComposing: true, bubbles: true}));
                return {positions, composing: element.scrollTop, before, after: instance.getValue()};
            }, mode);
            expect(result.positions.every(top => enabled ? top > 0 : top === 0)).toBe(true);
            expect(result.composing).toBe(0);
            expect(result.after).toBe(result.before);
        });
    }
});
