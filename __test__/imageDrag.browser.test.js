const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("image dragging", () => {
    let browser;
    let page;
    const image = "![alt](/images/logo.png \"title\")";

    beforeAll(async () => {
        ({browser, page} = await openEditorPage());
        await page.setViewport({width: 1024, height: 1000});
    });
    beforeEach(async () => { await page.setViewport({width: 1024, height: 1000, isMobile: false, hasTouch: false}); });
    afterAll(async () => { await browser?.close(); });

    const prepare = async (mode, markdown = image, options = {}) => {
        await newEditor(page, {mode, value: `${markdown}\n\ntarget\n`, ...options});
        return page.evaluate(mode => {
            const editor = window.testEditor;
            const root = editor.vditor[mode].element;
            editor.vditor.element.id = "image-drag-editor";
            root.querySelector("img").style.cssText = "width: 64px; height: 64px";
            root.scrollIntoView();
            window.imageDragEvents = [];
            root.addEventListener("dragstart", event => window.imageDragEvents.push(event.target.tagName));
            window.imageDragInputs = [];
            editor.vditor.options.input = value => window.imageDragInputs.push(value);
            return editor.getValue();
        }, mode);
    };

    const drag = async (mode, copy = false) => {
        const points = await page.evaluate(mode => {
            const root = window.testEditor.vditor[mode].element;
            const imageRect = root.querySelector("img").getBoundingClientRect();
            const range = document.createRange();
            const text = Array.from(root.querySelectorAll("p")).find(p => p.textContent === "target").firstChild;
            range.setStart(text, text.textContent.length); range.collapse(true);
            const rect = range.getBoundingClientRect();
            return {from: {x: imageRect.x + 32, y: imageRect.y + 32}, to: {x: rect.x, y: rect.y + rect.height / 2}};
        }, mode);
        if (copy) await page.keyboard.down("Control");
        try {
            await page.mouse.move(points.from.x, points.from.y);
            await page.mouse.down();
            await page.mouse.move(points.to.x, points.to.y, {steps: 20});
            await page.mouse.up();
        } finally {
            if (copy) await page.keyboard.up("Control");
        }
        expect(await page.evaluate(() => window.imageDragEvents)).toContain("IMG");
    };

    for (const mode of ["ir", "wysiwyg"]) {
        it(`${mode}: moves an image in a narrow layout`, async () => {
            await page.setViewport({width: 393, height: 1000});
            await prepare(mode);
            await drag(mode);
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(`target${image}\n`);
        });

        it(`${mode}: moves the image and preserves Markdown, input and undo/redo`, async () => {
            const before = await prepare(mode);
            await drag(mode);
            const expected = `target${image}\n`;
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(expected);
            await page.waitForFunction(value => window.imageDragInputs.includes(value), {}, expected);
            await page.evaluate(() => window.testEditor.vditor.undo.addToUndoStack(window.testEditor.vditor));
            await page.evaluate(() => window.testEditor.vditor.undo.undo(window.testEditor.vditor));
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before);
            await page.evaluate(() => window.testEditor.vditor.undo.redo(window.testEditor.vditor));
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(expected);
            expect(await page.evaluate(() => {
                const value = window.testEditor.getValue(); window.testEditor.setValue(value); return window.testEditor.getValue();
            })).toBe(expected);
        });
    }

    for (const mode of ["ir", "wysiwyg"]) {
        it.each([false, true])(`${mode}: preserves linked image metadata when copy=%s`, async copy => {
            const linked = `[${image}](https://example.com/link "link title")`;
            const before = await prepare(mode, linked);
            await drag(mode, copy);
            const expected = (copy ? `${linked}\n\n` : "") + `target${linked}\n`;
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(expected);
            expect(await page.evaluate(mode => window.testEditor.vditor[mode].element.querySelectorAll("img").length, mode)).toBe(copy ? 2 : 1);
            expect(await page.evaluate(() => {
                const editor = window.testEditor;
                editor.vditor.undo.addToUndoStack(editor.vditor); editor.vditor.undo.undo(editor.vditor); return editor.getValue();
            })).toBe(before);
        });

        it(`${mode}: preserves image captions and supports immediate undo with delayed history`, async () => {
            const before = await prepare(mode, image, {undoDelay: 10000, preview: {markdown: {imageCaption: true}}});
            await drag(mode);
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(`target${image}\n`);
            await page.evaluate(() => window.testEditor.vditor.undo.undo(window.testEditor.vditor));
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before);
            expect(await page.evaluate(mode => window.testEditor.vditor[mode].element.querySelector("[data-image-caption]")?.getAttribute("data-image-caption"), mode)).toBe("title");
        });

        it.each(["self", "code", "outside", "disabled"])(`${mode}: keeps the image at an invalid %s drop`, async location => {
            await prepare(mode);
            const result = await page.evaluate((mode, location) => {
                const editor = window.testEditor;
                const root = editor.vditor[mode].element;
                const img = root.querySelector("img");
                if (location === "code") root.lastElementChild.innerHTML = "<code>target</code>";
                const before = editor.getValue();
                const dataTransfer = new DataTransfer();
                img.dispatchEvent(new DragEvent("dragstart", {bubbles: true, cancelable: true, dataTransfer}));
                if (location === "disabled") editor.disabled();
                const target = location === "self" ? img : root.lastElementChild;
                const rect = target.getBoundingClientRect();
                const drop = new DragEvent("drop", {bubbles: true, cancelable: true, dataTransfer,
                    clientX: location === "outside" ? -1 : rect.x + 2, clientY: location === "outside" ? -1 : rect.y + rect.height / 2});
                root.dispatchEvent(drop);
                img.dispatchEvent(new DragEvent("dragend", {bubbles: true, dataTransfer}));
                return {before, value: editor.getValue(), cancelled: drop.defaultPrevented, count: root.querySelectorAll("img").length};
            }, mode, location);
            expect(result.value).toBe(result.before);
            expect(result.cancelled).toBe(true);
            expect(result.count).toBe(1);
        });
    }

    it("uses caretPositionFromPoint when caretRangeFromPoint is unavailable", async () => {
        await prepare("ir");
        await page.evaluate(() => {
            window.nativeCaretRangeFromPoint = document.caretRangeFromPoint;
            document.caretPositionFromPoint = (x, y) => {
                const range = window.nativeCaretRangeFromPoint.call(document, x, y);
                return range && {offsetNode: range.startContainer, offset: range.startOffset};
            };
            document.caretRangeFromPoint = undefined;
        });
        try {
            await drag("ir");
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(`target${image}\n`);
        } finally {
            await page.evaluate(() => {
                document.caretRangeFromPoint = window.nativeCaretRangeFromPoint;
                delete document.caretPositionFromPoint;
            });
        }
    });

    it("IR preserves image reference definitions through moving and reloading", async () => {
        await prepare("ir", "![alt][ref]\n\n[ref]: /images/logo.png \"title\"");
        await drag("ir");
        const result = await page.evaluate(() => {
            const editor = window.testEditor;
            const value = editor.getValue();
            const html = editor.getHTML();
            editor.setValue(value);
            return {value, html, reloaded: editor.getHTML()};
        });
        expect(result.value).toContain("target![alt][ref]");
        expect(result.value.match(/\[ref\]:/g)).toHaveLength(1);
        expect(result.html).toContain('<img src="/images/logo.png" alt="alt" title="title"');
        expect(result.reloaded).toBe(result.html);
    });

    it("IR cancels image drags in a disabled editor", async () => {
        const before = await prepare("ir");
        const result = await page.evaluate(() => {
            const editor = window.testEditor; editor.disabled();
            const root = editor.vditor.ir.element;
            const event = new DragEvent("dragstart", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()});
            root.querySelector("img").dispatchEvent(event);
            return {cancelled: event.defaultPrevented, value: editor.getValue()};
        });
        expect(result).toEqual({cancelled: true, value: before});
    });
});
