const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

jest.setTimeout(30000);

describe("blockquote in a list", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    const setModeAndCaret = async (mode, digit, markdown = "- parent\n\n  - child\n\n    > quote",
                                   text = "quote", waitForUndo = false, offset = text.length) => {
        await page.evaluate(async ({caretOffset, caretText, currentMode, markdownValue, modeDigit,
                                     shouldWaitForUndo}) => {
            const vditorTest = window.vditorTest;
            const vditor = vditorTest.vditor;
            if (vditor.currentMode !== currentMode) {
                const isMac = navigator.platform.toUpperCase().includes("MAC");
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: `Digit${modeDigit}`,
                    ctrlKey: !isMac,
                    key: modeDigit,
                    metaKey: isMac,
                }));
            }

            vditorTest.setValue(markdownValue);
            if (shouldWaitForUndo) {
                await new Promise((resolve) => setTimeout(resolve, vditor.options.undoDelay + 100));
            }
            const editor = vditor[currentMode].element;
            const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
            let textNode = walker.nextNode();
            while (textNode && !textNode.textContent.includes(caretText)) {
                textNode = walker.nextNode();
            }
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.indexOf(caretText) + caretOffset);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();
        }, {
            caretOffset: offset,
            caretText: text,
            currentMode: mode,
            markdownValue: markdown,
            modeDigit: digit,
            shouldWaitForUndo: waitForUndo,
        });
    };

    [
        {digit: "7", mode: "wysiwyg"},
        {digit: "8", mode: "ir"},
    ].forEach(({digit, mode}) => {
        it(`keeps Enter inside a top-level list quote in ${mode} mode`, async () => {
            await setModeAndCaret(mode, digit, "* > 111", "111", true);

            await page.keyboard.press("Enter");
            const result = await page.evaluate(({currentMode}) => {
                const editor = window.vditorTest.vditor[currentMode].element;
                const blockquote = editor.querySelector("blockquote");
                return {
                    itemCount: editor.querySelectorAll(":scope > ul > li").length,
                    paragraphCount: blockquote.querySelectorAll(":scope > p").length,
                    selectionInBlockquote: blockquote.contains(getSelection().anchorNode),
                    value: window.vditorTest.getValue(),
                };
            }, {currentMode: mode});

            expect(result).toEqual({
                itemCount: 1,
                paragraphCount: 2,
                selectionInBlockquote: true,
                value: "* > 111\n  >\n  >\n",
            });
        });

        ["ArrowDown", "ArrowRight"].forEach((key) => {
            it(`moves to the next list item with ${key} in ${mode} mode`, async () => {
                await setModeAndCaret(mode, digit, "* > 111\n*", "111");

                await page.keyboard.press(key);
                const result = await page.evaluate(({currentMode}) => {
                    const editor = window.vditorTest.vditor[currentMode].element;
                    const items = editor.querySelectorAll(":scope > ul > li");
                    const selectionNode = getSelection().anchorNode;
                    return {
                        firstItemChildren: Array.from(items[0].children).map((item) => item.tagName),
                        itemCount: items.length,
                        selectionInNextItem: items[1].isSameNode(selectionNode) || items[1].contains(selectionNode),
                    };
                }, {currentMode: mode});

                expect(result).toEqual({
                    firstItemChildren: ["BLOCKQUOTE"],
                    itemCount: 2,
                    selectionInNextItem: true,
                });
            });
        });

        it(`does not insert a block before a list quote with ArrowUp in ${mode} mode`, async () => {
            await setModeAndCaret(mode, digit, "* > 111", "111", false, 0);
            await page.keyboard.press("ArrowUp");

            const result = await page.evaluate(({currentMode}) => {
                const editor = window.vditorTest.vditor[currentMode].element;
                const item = editor.querySelector(":scope > ul > li");
                return {
                    itemChildren: Array.from(item.children).map((child) => child.tagName),
                    itemCount: editor.querySelectorAll(":scope > ul > li").length,
                    value: window.vditorTest.getValue(),
                };
            }, {currentMode: mode});

            expect(result).toEqual({
                itemChildren: ["BLOCKQUOTE"],
                itemCount: 1,
                value: "* > 111\n  >\n",
            });
        });

        it(`keeps a new paragraph inside the quote in ${mode} mode`, async () => {
            await setModeAndCaret(mode, digit);
            await page.keyboard.press("Enter");

            const result = await page.evaluate(({currentMode}) => {
                const vditorTest = window.vditorTest;
                const editor = vditorTest.vditor[currentMode].element;
                const blockquote = editor.querySelector("blockquote");
                return {
                    listItemCount: editor.querySelectorAll("ul ul > li").length,
                    paragraphCount: blockquote.querySelectorAll(":scope > p").length,
                    selectionInBlockquote: blockquote.contains(getSelection().anchorNode),
                    value: vditorTest.getValue(),
                };
            }, {currentMode: mode});

            expect(result.listItemCount).toBe(1);
            expect(result.paragraphCount).toBe(2);
            expect(result.selectionInBlockquote).toBeTruthy();
            expect(result.value).toBe("- parent\n\n  - child\n\n    > quote\n    >\n    >\n");

            await page.keyboard.type("after");
            expect(await page.evaluate(() => window.vditorTest.getValue())).toBe(
                "- parent\n\n  - child\n\n    > quote\n    >\n    > after\n    >\n",
            );

            await setModeAndCaret(mode, digit);
            await page.keyboard.press("Enter");
            await page.keyboard.press("Enter");
            const exitResult = await page.evaluate(({currentMode}) => {
                const editor = window.vditorTest.vditor[currentMode].element;
                const blockquote = editor.querySelector("blockquote");
                return {
                    listItemCount: editor.querySelectorAll("ul ul > li").length,
                    paragraphAfterQuote: blockquote.nextElementSibling?.tagName,
                    selectionInBlockquote: blockquote.contains(getSelection().anchorNode),
                };
            }, {currentMode: mode});
            expect(exitResult).toEqual({
                listItemCount: 1,
                paragraphAfterQuote: "P",
                selectionInBlockquote: false,
            });
        });
    });

    it("keeps the existing marker continuation in sv mode", async () => {
        await setModeAndCaret("sv", "9");
        await page.keyboard.press("Enter");
        await page.keyboard.type("after");

        const value = await page.evaluate(() => window.vditorTest.getValue());
        expect(value).toContain("    > quote\n    > after");
        expect(value).not.toContain("  -\n");
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
});
