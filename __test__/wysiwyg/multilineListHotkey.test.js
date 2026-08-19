const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("WYSIWYG multiline list hotkeys", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(async () => {
            const Vditor = window.vditorTest.constructor;
            const element = document.createElement("div");
            document.body.appendChild(element);
            window.multilineListEditor = await new Promise((resolve) => {
                let editor;
                editor = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js",
                    after: () => resolve(editor),
                    cache: {enable: false},
                    i18n: window.VditorI18n,
                    mode: "wysiwyg",
                    preview: {delay: 0},
                    toolbar: ["list", "ordered-list", "check"],
                });
            });
        });
    });

    it.each([
        ["l", "KeyL", "UL", false],
        ["o", "KeyO", "OL", false],
        ["j", "KeyJ", "UL", true],
    ])("converts every selected block with %s", async (key, code, listTagName, task) => {
        const result = await page.evaluate(({hotkeyCode, hotkeyKey}) => {
            const vditorTest = window.multilineListEditor;
            const editor = vditorTest.vditor.wysiwyg.element;
            vditorTest.setValue("first\n\nsecond\n\nthird");
            const range = document.createRange();
            range.setStart(editor.firstElementChild.firstChild, 1);
            range.setEnd(editor.lastElementChild.firstChild,
                editor.lastElementChild.firstChild.textContent.length - 1);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();
            editor.dispatchEvent(new KeyboardEvent("keydown", {
                bubbles: true,
                code: hotkeyCode,
                ctrlKey: !navigator.platform.toUpperCase().includes("MAC"),
                key: hotkeyKey,
                metaKey: navigator.platform.toUpperCase().includes("MAC"),
            }));

            const list = editor.firstElementChild;
            const selection = getSelection();
            return {
                checkedCount: list.querySelectorAll("input[type='checkbox']").length,
                itemTexts: Array.from(list.children).map((item) => item.textContent.trim()),
                listCount: editor.querySelectorAll("ol, ul").length,
                selectionCollapsed: selection.isCollapsed,
                selectionText: selection.toString().replace(/\s+/g, ""),
                tagName: list.tagName,
            };
        }, {hotkeyCode: code, hotkeyKey: key});

        expect(result).toEqual({
            checkedCount: task ? 3 : 0,
            itemTexts: ["first", "second", "third"],
            listCount: 1,
            selectionCollapsed: false,
            selectionText: "irstsecondthir",
            tagName: listTagName,
        });
    });

    afterAll(async () => {
        await page.evaluate(() => {
            const element = window.multilineListEditor.vditor.element;
            window.multilineListEditor.destroy();
            element.remove();
        });
        await browser.close();
    });
});
