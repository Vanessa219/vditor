const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("Deleting the contents of a heading", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    const focusHeading = mode => page.evaluate(mode => {
        const surface = window.testEditor.vditor[mode].element;
        const heading = surface.querySelector("h3");
        surface.focus();
        const range = document.createRange();
        range.selectNodeContents(heading);
        range.collapse(false);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
    }, mode);

    const snapshot = mode => page.evaluate(mode => {
        const editor = window.testEditor;
        const surface = editor.vditor[mode].element;
        const selection = getSelection();
        const blocks = Array.from(surface.children);
        return {
            tags: blocks.map(block => block.tagName),
            caret: blocks.findIndex(block => block.contains(selection.anchorNode)),
            collapsed: selection.isCollapsed,
            value: editor.getValue(),
        };
    }, mode);

    it.each([
        ["wysiwyg", false, ""],
        ["wysiwyg", true, "before\n\n"],
        ["ir", false, ""],
        ["ir", true, "before\n\n"],
    ])("converts a heading in %s with touch=%s", async (mode, touch, prefix) => {
        await page.setViewport({width: touch ? 393 : 1200, height: 800, isMobile: touch, hasTouch: touch});
        await newEditor(page, {mode, value: prefix + "###\n\n### Next"});
        const index = prefix ? 1 : 0;
        await focusHeading(mode);
        const before = await snapshot(mode);
        expect(before.tags[index]).toBe("H3");

        await page.keyboard.press("Backspace");
        const after = await snapshot(mode);
        const expected = [...before.tags];
        expected[index] = "P";
        expect(after.tags).toEqual(expected);
        expect(after.caret).toBe(index);
        expect(after.collapsed).toBe(true);
        expect(after.value).toBe((prefix ? prefix + "\n\n" : "") + "### Next\n");

        await page.evaluate(() => {
            const {vditor} = window.testEditor;
            vditor.undo.undo(vditor);
        });
        const undone = await snapshot(mode);
        expect(undone.tags).toEqual(before.tags);
        expect(undone.value).toBe(before.value);
        await page.evaluate(() => {
            const {vditor} = window.testEditor;
            vditor.undo.redo(vditor);
        });
        expect(await snapshot(mode)).toEqual(after);

        await page.keyboard.type("body");
        expect((await snapshot(mode)).value).toBe(prefix + "body\n\n### Next\n");
    });

    it.each(["wysiwyg", "ir"])("keeps the only block editable in %s", async mode => {
        await newEditor(page, {mode, value: "###"});
        await focusHeading(mode);
        await page.keyboard.press("Backspace");
        expect(await snapshot(mode)).toMatchObject({tags: ["P"], caret: 0, collapsed: true});
        await page.keyboard.type("body");
        expect((await snapshot(mode)).value).toBe("body\n");
    });

    it.each([["wysiwyg", "Backspace"], ["ir", "Backspace"], ["wysiwyg", "Delete"], ["ir", "Delete"]])(
        "leaves an editable paragraph when %s removes the last selected character with %s", async (mode, key) => {
            await newEditor(page, {mode, value: "[above](https://example.com)\n\n### 2\n\nbelow"});
            await page.evaluate(mode => {
                const surface = window.testEditor.vditor[mode].element;
                surface.focus();
                const heading = surface.querySelector("h3");
                const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
                while (walker.nextNode()) {
                    const text = walker.currentNode;
                    const offset = text.textContent.indexOf("2");
                    if (offset !== -1) {
                        const range = document.createRange();
                        range.setStart(text, offset);
                        range.setEnd(text, offset + 1);
                        getSelection().removeAllRanges();
                        getSelection().addRange(range);
                        return;
                    }
                }
                throw new Error("Heading text is missing");
            }, mode);
            const before = await snapshot(mode);
            await page.keyboard.press(key);
            expect(await snapshot(mode)).toMatchObject({tags: ["P", "P", "P"], caret: 1, collapsed: true});
            await page.evaluate(() => {
                const {vditor} = window.testEditor;
                vditor.undo.undo(vditor);
            });
            expect((await snapshot(mode)).value).toBe(before.value);
            await page.evaluate(() => {
                const {vditor} = window.testEditor;
                vditor.undo.redo(vditor);
            });
            await page.keyboard.type("body");
            expect((await snapshot(mode)).value).toBe("[above](https://example.com)\n\nbody\n\nbelow\n");
        });
});
