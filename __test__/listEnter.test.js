const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("nested list Enter", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const url = request.url();
            const distMarker = "/dist/";
            const isVditorCDN = url.includes("cdn.jsdelivr.net/npm/vditor") || url.includes("unpkg.com/vditor");
            if (isVditorCDN && url.includes(distMarker)) {
                const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
                request.continue({url: `http://localhost:9000/${localPath}`});
            } else {
                request.continue();
            }
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    const modes = [
        {digit: "7", mode: "wysiwyg"},
        {digit: "8", mode: "ir"},
    ];

    modes.forEach(({digit, mode}) => {
        it(`moves the trailing empty nested item into its parent in ${mode} mode`, async () => {
            const result = await page.evaluate(({mode: currentMode, digit: modeDigit}) => {
                const vditorTest = window.vditorTest;
                const vditor = vditorTest.vditor;
                if (vditor.currentMode !== currentMode) {
                    vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true,
                        bubbles: true,
                        code: `Digit${modeDigit}`,
                        ctrlKey: true,
                        key: modeDigit,
                    }));
                }

                vditorTest.setValue("- parent\n  - child\n  -\n- next");
                const editor = vditor[currentMode].element;
                const emptyItem = editor.querySelector("ul ul li:last-child");
                const range = document.createRange();
                range.selectNodeContents(emptyItem);
                range.collapse(false);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                editor.focus();

                const handled = !emptyItem.dispatchEvent(new KeyboardEvent("keydown", {
                    bubbles: true,
                    cancelable: true,
                    code: "Enter",
                    key: "Enter",
                }));
                const outerList = editor.querySelector(":scope > ul");
                const parentItem = outerList.firstElementChild;
                const paragraphElement = parentItem.lastElementChild;
                return {
                    handled,
                    parentChildren: Array.from(parentItem.children).map((item) => item.tagName),
                    paragraphTag: paragraphElement.tagName,
                    selectionInParagraph: paragraphElement.contains(getSelection().anchorNode),
                };
            }, {digit, mode});

            expect(result.handled).toBeTruthy();
            expect(result.parentChildren).toEqual(["UL", "P"]);
            expect(result.paragraphTag).toBe("P");
            expect(result.selectionInParagraph).toBeTruthy();

            await page.keyboard.type("after");
            await page.waitForFunction(() => window.vditorTest.getValue().includes("after"));
            expect(await page.evaluate(() => window.vditorTest.getValue())).toBe(
                "- parent\n\n  - child\n\n  after\n- next\n",
            );
        });

        it(`creates an outer sibling after another Enter in ${mode} mode`, async () => {
            await page.evaluate(({mode: currentMode, digit: modeDigit}) => {
                const vditorTest = window.vditorTest;
                const vditor = vditorTest.vditor;
                if (vditor.currentMode !== currentMode) {
                    vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true,
                        bubbles: true,
                        code: `Digit${modeDigit}`,
                        ctrlKey: true,
                        key: modeDigit,
                    }));
                }

                vditorTest.setValue("- parent\n  - child\n  -\n- next");
                const editor = vditor[currentMode].element;
                const emptyItem = editor.querySelector("ul ul li:last-child");
                const range = document.createRange();
                range.selectNodeContents(emptyItem);
                range.collapse(false);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                editor.focus();
                emptyItem.dispatchEvent(new KeyboardEvent("keydown", {
                    bubbles: true,
                    cancelable: true,
                    code: "Enter",
                    key: "Enter",
                }));
            }, {digit, mode});

            await page.keyboard.press("Enter");
            const result = await page.evaluate(({mode: currentMode}) => {
                const editor = window.vditorTest.vditor[currentMode].element;
                return {
                    itemCount: editor.querySelectorAll(":scope > ul > li").length,
                    value: window.vditorTest.getValue(),
                };
            }, {mode});
            expect(result.itemCount).toBe(3);
            expect(result.value).toBe("- parent\n\n  - child\n-\n- next\n");
        });

        it(`keeps top-level empty items and media items unchanged in ${mode} mode`, async () => {
            const result = await page.evaluate(({mode: currentMode, digit: modeDigit}) => {
                const vditorTest = window.vditorTest;
                const vditor = vditorTest.vditor;
                if (vditor.currentMode !== currentMode) {
                    vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                        altKey: true,
                        bubbles: true,
                        code: `Digit${modeDigit}`,
                        ctrlKey: true,
                        key: modeDigit,
                    }));
                }

                const dispatchKey = (editor, item, key) => {
                    const range = document.createRange();
                    range.selectNodeContents(item);
                    range.collapse(false);
                    getSelection().removeAllRanges();
                    getSelection().addRange(range);
                    editor.focus();
                    return !item.dispatchEvent(new KeyboardEvent("keydown", {
                        bubbles: true,
                        cancelable: true,
                        code: key,
                        key,
                    }));
                };

                vditorTest.setValue("- first\n-\n- second");
                const editor = vditor[currentMode].element;
                const topLevelItem = editor.querySelector(":scope > ul > li:nth-child(2)");
                const topLevelHandled = dispatchKey(editor, topLevelItem, "Enter");

                vditorTest.setValue("- parent\n  - ![alt](test.png)");
                const mediaItem = editor.querySelector("ul ul li:last-child");
                const mediaEnterHandled = dispatchKey(editor, mediaItem, "Enter");
                return {
                    hasImage: Boolean(editor.querySelector("ul ul li:last-child img")),
                    mediaEnterHandled,
                    topLevelHandled,
                };
            }, {digit, mode});

            expect(result.topLevelHandled).toBeFalsy();
            expect(result.mediaEnterHandled).toBeFalsy();
            expect(result.hasImage).toBeTruthy();
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
});
