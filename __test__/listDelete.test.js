const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("Delete before a list", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    for (const [mode, digit] of [["wysiwyg", "7"], ["ir", "8"]]) {
        for (const markdown of ["- first\n  - nested\n- second", "3. first\n   - nested\n4. second",
            "- [x] first\n  - nested\n- [ ] second"]) {
            it(`preserves ${markdown.split("\n")[0]} and undo/redo in ${mode}`, async () => {
                const original = await page.evaluate(({mode, digit, markdown}) => {
                    const instance = window.vditorTest;
                    const vditor = instance.vditor;
                    if (vditor.currentMode !== mode) {
                        const mac = navigator.platform.toUpperCase().includes("MAC");
                        vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                            key: digit, code: `Digit${digit}`, altKey: true, ctrlKey: !mac, metaKey: mac, bubbles: true,
                        }));
                    }
                    instance.setValue(markdown);
                    const editor = vditor[mode].element;
                    editor.insertAdjacentHTML("afterbegin", '<p data-block="0">\n</p>');
                    const range = document.createRange();
                    range.selectNodeContents(editor.firstElementChild);
                    range.collapse(true);
                    editor.focus();
                    getSelection().removeAllRanges();
                    getSelection().addRange(range);
                    vditor.undo.clearStack(vditor);
                    vditor.undo.addToUndoStack(vditor);
                    return {html: editor.innerHTML, list: editor.querySelector("ul, ol").outerHTML,
                        markdown: instance.getValue()};
                }, {mode, digit, markdown});

                await page.keyboard.press("Delete");
                await page.waitForFunction(() => {
                    const vditor = window.vditorTest.vditor;
                    return vditor.undo[vditor.currentMode].undoStack.length === 2;
                });
                const deleted = await page.evaluate(() => {
                    const instance = window.vditorTest;
                    const editor = instance.vditor[instance.vditor.currentMode].element;
                    const caret = getSelection().getRangeAt(0).cloneRange();
                    const firstItem = editor.querySelector("li");
                    const before = document.createRange();
                    before.selectNodeContents(firstItem);
                    before.setEnd(caret.startContainer, caret.startOffset);
                    return {html: editor.innerHTML, markdown: instance.getValue(),
                        inside: firstItem.contains(caret.startContainer), caret: before.toString().trim()};
                });
                expect(deleted.html).toBe(original.list);
                expect(deleted.markdown).toBe(original.markdown);
                expect(deleted.inside).toBe(true);
                expect(deleted.caret).toBe("");

                await page.evaluate(() => {
                    const vditor = window.vditorTest.vditor;
                    vditor.undo.undo(vditor);
                });
                expect(await page.evaluate(() => {
                    const vditor = window.vditorTest.vditor;
                    return vditor[vditor.currentMode].element.innerHTML;
                })).toBe(original.html);
                await page.evaluate(() => {
                    const vditor = window.vditorTest.vditor;
                    vditor.undo.redo(vditor);
                });
                expect(await page.evaluate(() => {
                    const vditor = window.vditorTest.vditor;
                    return vditor[vditor.currentMode].element.innerHTML;
                })).toBe(deleted.html);

                await page.keyboard.type("X");
                await page.waitForFunction(() => window.vditorTest.getValue().includes("Xfirst"));
            });
        }
    }

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
});
