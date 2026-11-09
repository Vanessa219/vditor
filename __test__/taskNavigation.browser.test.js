const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("task list cursor navigation", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    beforeEach(async () => { await page.setViewport({width: 1024, height: 800}); });
    afterAll(async () => { await browser?.close(); });

    const select = (mode, itemIndex, offset) => page.evaluate((mode, itemIndex, offset) => {
        const root = window.testEditor.vditor[mode].element; root.focus();
        const item = root.querySelectorAll("li.vditor-task")[itemIndex];
        const text = item.childNodes[1];
        const range = document.createRange(); range.setStart(text, offset); range.collapse(true);
        getSelection().removeAllRanges(); getSelection().addRange(range);
    }, mode, itemIndex, offset);
    const caret = () => page.evaluate(() => {
        const selection = getSelection();
        return {node: selection.anchorNode.nodeName, text: selection.anchorNode.textContent, offset: selection.anchorOffset};
    });
    const expectCaret = async expected => {
        await page.waitForFunction(expected => {
            const selection = getSelection();
            return selection.anchorNode.nodeName === expected.node && selection.anchorNode.textContent === expected.text &&
                selection.anchorOffset === expected.offset;
        }, {}, expected);
        expect(await caret()).toEqual(expected);
    };

    for (const mode of ["wysiwyg", "ir"]) {
        it.each([false, true])(`${mode}: crosses task markers in one step on mobile=%s`, async mobile => {
            await page.setViewport({width: mobile ? 393 : 1024, height: 800, isMobile: mobile, hasTouch: mobile});
            await newEditor(page, {mode, value: "- [ ] first\n- [x] second\n"});
            const before = await page.evaluate(() => window.testEditor.getValue());
            await select(mode, 1, 1);
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: " first", offset: 6});
            await page.keyboard.press("ArrowRight");
            await expectCaret({node: "#text", text: " second", offset: 1});
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before);
        });

        it(`${mode}: stays at the first task body when moving before the document`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n"});
            await select(mode, 0, 1);
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: " first", offset: 1});
        });

        it(`${mode}: preserves Shift selection and Backspace behavior`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n- [ ] second\n"});
            await select(mode, 1, 1);
            await page.keyboard.down("Shift");
            await page.keyboard.press("ArrowLeft");
            await page.keyboard.up("Shift");
            expect(await page.evaluate(() => getSelection().isCollapsed)).toBe(false);
            await select(mode, 0, 1);
            const before = await page.evaluate(() => window.testEditor.getValue());
            await page.keyboard.press("Backspace");
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before.replace(/^.*?\n/, "first\n\n"));
        });

        it(`${mode}: crosses paragraph and nested task boundaries`, async () => {
            await newEditor(page, {mode, value: "before\n\n- [ ] outer\n  - [x] inner\n- [ ] last\n"});
            await select(mode, 0, 1);
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: "before", offset: 6});
            await page.keyboard.press("ArrowRight");
            await expectCaret({node: "#text", text: " outer", offset: 1});
            await select(mode, 1, 1);
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: " outer", offset: 6});
            await page.keyboard.press("ArrowRight");
            await expectCaret({node: "#text", text: " inner", offset: 1});
        });

        it(`${mode}: enters task bodies beginning with inline formatting or paragraphs`, async () => {
            for (const value of ["- [ ] first\n- [ ] **second**\n", "- [ ] first\n\n- [ ] second\n"]) {
                await newEditor(page, {mode, value});
                const before = await page.evaluate(mode => {
                    const root = window.testEditor.vditor[mode].element; root.focus();
                    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                    let node;
                    while ((node = walker.nextNode())) {
                        if (node.textContent.includes("first")) {
                            const range = document.createRange(); range.setStart(node, node.textContent.length); range.collapse(true);
                            getSelection().removeAllRanges(); getSelection().addRange(range); break;
                        }
                    }
                    return window.testEditor.getValue();
                }, mode);
                await page.keyboard.press("ArrowRight");
                await page.waitForFunction(mode => {
                    const root = window.testEditor.vditor[mode].element;
                    const item = root.querySelectorAll("li")[1];
                    const range = document.createRange(); range.setStartAfter(item.querySelector("input")); range.collapse(true);
                    const caret = getSelection().getRangeAt(0);
                    return item.contains(caret.startContainer) && caret.compareBoundaryPoints(Range.START_TO_START, range) > 0;
                }, {}, mode);
                expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before);
            }
        });

        it(`${mode}: visits empty tasks and preserves user spaces`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n- [ ] last\n"});
            await select(mode, 0, 6);
            await page.keyboard.press("Enter");
            await select(mode, 0, 6);
            await page.keyboard.press("ArrowRight");
            const empty = await caret();
            expect(empty.text.trim()).toBe("");
            expect(await page.evaluate(() => {
                const s = getSelection(); const element = s.anchorNode.nodeType === 3 ? s.anchorNode.parentElement : s.anchorNode;
                return element.closest("li") === window.testEditor.vditor[window.testEditor.getCurrentMode()].element.querySelectorAll("li")[1];
            })).toBe(true);
            await page.keyboard.press("ArrowRight");
            await expectCaret({node: "#text", text: " last", offset: 1});
            await select(mode, 2, 1);
            await page.keyboard.press("ArrowLeft");
            expect((await caret()).text.trim()).toBe("");
            await newEditor(page, {mode, value: "- [ ] first\n"});
            await page.evaluate(mode => {
                const text = window.testEditor.vditor[mode].element.querySelector("li").childNodes[1];
                text.textContent = "   first";
            }, mode);
            await select(mode, 0, 3);
            await page.keyboard.press("ArrowLeft");
            expect((await caret()).offset).toBe(2);
        });

        it(`${mode}: follows visual arrows in RTL text`, async () => {
            await newEditor(page, {mode, rtl: true, value: "- [ ] ראשון\n- [ ] שני\n"});
            await select(mode, 1, 1);
            await page.keyboard.press("ArrowRight");
            await expectCaret({node: "#text", text: " ראשון", offset: 6});
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: " שני", offset: 1});
        });

        it(`${mode}: normalizes held keys before keyup and preserves undo`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n- [ ] second\n"});
            const before = await page.evaluate(() => window.testEditor.getValue());
            await select(mode, 1, 1);
            await page.keyboard.down("ArrowLeft");
            await page.waitForFunction(() => getSelection().anchorNode.textContent === " first");
            expect((await caret()).offset).toBe(6);
            await page.keyboard.down("ArrowLeft");
            await page.waitForFunction(() => getSelection().anchorOffset === 5);
            await page.keyboard.up("ArrowLeft");
            await page.keyboard.type("X");
            const values = await page.evaluate(() => {
                const editor = window.testEditor; const edited = editor.getValue();
                editor.vditor.undo.undo(editor.vditor); const undo = editor.getValue();
                editor.vditor.undo.redo(editor.vditor); return {edited, undo, redo: editor.getValue()};
            });
            expect(values.undo).toBe(before);
            expect(values.edited).toBe(before.replace("first", "firsXt"));
            expect(values.redo).toBe(values.edited);
        });

        it(`${mode}: leaves modifiers, composition and disabled editors alone`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n"});
            const offsets = await page.evaluate(mode => {
                const editor = window.testEditor; const root = editor.vditor[mode].element;
                const item = root.querySelector("li"); root.focus();
                const results = [];
                const dispatch = flags => {
                    const range = document.createRange(); range.setStart(item, 0); range.collapse(true);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                    for (const type of ["keydown", "keyup"]) {
                        root.dispatchEvent(new KeyboardEvent(type, {key: "ArrowRight", bubbles: true, cancelable: true, ...flags}));
                    }
                    results.push(getSelection().anchorOffset);
                };
                for (const flags of [{shiftKey: true}, {ctrlKey: true}, {metaKey: true}, {altKey: true}, {isComposing: true}]) {
                    dispatch(flags);
                }
                editor.vditor[mode].composingLock = true; dispatch({});
                editor.vditor[mode].composingLock = false;
                editor.disabled(); dispatch({});
                return results;
            }, mode);
            expect(offsets).toEqual([0, 0, 0, 0, 0, 0, 0]);
        });

        it(`${mode}: preserves checkbox clicks, toggle shortcuts and custom key handlers`, async () => {
            await newEditor(page, {mode, value: "- [ ] first\n- [ ] second\n"});
            await select(mode, 1, 1);
            await page.keyboard.press("ArrowLeft");
            await expectCaret({node: "#text", text: " first", offset: 6});
            const before = await page.evaluate(() => window.testEditor.getValue());
            await page.click(`.vditor-${mode} input[type="checkbox"]`);
            await page.waitForFunction(() => /^- \[[xX]\]/.test(window.testEditor.getValue()));
            await select(mode, 0, 1);
            await page.evaluate(mode => {
                const root = window.testEditor.vditor[mode].element;
                const mac = navigator.platform.toUpperCase().includes("MAC");
                root.dispatchEvent(new KeyboardEvent("keydown", {key: "J", code: "KeyJ", ctrlKey: !mac,
                    metaKey: mac, shiftKey: true, bubbles: true, cancelable: true}));
            }, mode);
            expect(await page.evaluate(() => window.testEditor.getValue())).toBe(before);
            await page.evaluate(mode => {
                const editor = window.testEditor;
                editor.vditor.options.keydown = event => event.preventDefault();
                const item = editor.vditor[mode].element.querySelector("li");
                const range = document.createRange(); range.setStart(item, 0); range.collapse(true);
                getSelection().removeAllRanges(); getSelection().addRange(range);
            }, mode);
            await page.keyboard.press("ArrowRight");
            expect((await caret()).node).toBe("LI");
            expect((await caret()).offset).toBe(0);
        });
    }

    it("keeps SV source navigation unchanged", async () => {
        const value = "- [ ] first\n- [ ] second\n";
        await newEditor(page, {mode: "sv", value});
        const offset = value.indexOf("second");
        await page.evaluate(offset => {
            const root = window.testEditor.vditor.sv.element; root.focus(); root.setSelectionRange(offset, offset);
        }, offset);
        await page.keyboard.press("ArrowLeft");
        const result = await page.evaluate(() => ({offset: window.testEditor.vditor.sv.element.selectionStart,
            value: window.testEditor.getValue()}));
        expect(result).toEqual({offset: offset - 1, value});
    });
});
