const {openEditorPage, newEditor} = require("../util/editorHarness");

describe("paired inline HTML markers", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    const select = async (text, offset = 1) => {
        await page.evaluate((text, offset) => {
            const root = window.testEditor.vditor.ir.element;
            root.focus();
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent === text) {
                    const range = document.createRange(); range.setStart(node, offset); range.collapse(true);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                    root.dispatchEvent(new KeyboardEvent("keyup", {key: "ArrowRight", bubbles: true}));
                    return;
                }
            }
            throw new Error("Missing text: " + text);
        }, text, offset);
        await page.waitForFunction(() => window.testEditor.vditor.ir.element.querySelector(".vditor-ir__node--expand"));
        return page.evaluate(() => [...window.testEditor.vditor.ir.element.querySelectorAll(
            '[data-type="html-inline"].vditor-ir__node--expand')].map(element => element.textContent));
    };

    it("expands both ends from content and either marker, respecting nesting and siblings", async () => {
        const value = '<span title="x">outer <span>inner</span> end</span> outside <kbd>Ctrl</kbd>\n';
        await newEditor(page, {mode: "ir", value});
        expect(await select("inner")).toEqual(['<span title="x">', "<span>", "</span>", "</span>"]);
        expect(await select("<span>")).toEqual(['<span title="x">', "<span>", "</span>", "</span>"]);
        expect(await select("Ctrl")).toEqual(["<kbd>", "</kbd>"]);
        expect(await page.evaluate(() => window.testEditor.getValue())).toBe(value);
    });

    it("does not pair void, unmatched or separate paragraph tags", async () => {
        await newEditor(page, {mode: "ir", value: "<span>first\n\nsecond</span> <br> <kbd>key</kbd>\n"});
        expect(await select("key")).toEqual(["<kbd>", "</kbd>"]);
    });
});
