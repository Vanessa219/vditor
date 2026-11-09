const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("heading shortcut hints", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    it.each([false, true])("keeps headings usable with touch=%s", async touch => {
        await page.setViewport({width: touch ? 393 : 1200, height: 800, isMobile: touch, hasTouch: touch});
        await newEditor(page);
        const result = await page.evaluate(() => {
            const headings = window.testEditor.vditor.toolbar.elements.headings;
            const buttons = Array.from(headings.querySelectorAll("button[data-tag]"));
            const hints = buttons.map(button => getComputedStyle(button.querySelector(".vditor-hint__hotkey")).display);
            window.testEditor.focus();
            buttons[1].click();
            return {hints, heading: !!window.testEditor.vditor.wysiwyg.element.querySelector("h2")};
        });
        expect(result.hints).toHaveLength(6);
        expect(result.hints.every(display => touch ? display === "none" : display !== "none")).toBe(true);
        expect(result.heading).toBe(true);
    });
});
