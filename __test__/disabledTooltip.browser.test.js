const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("disabled toolbar tooltip", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    it("hides a disabled focused button's tooltip after the pointer leaves", async () => {
        await newEditor(page);
        const result = await page.evaluate(() => {
            const button = window.testEditor.vditor.toolbar.elements.bold.firstElementChild;
            button.focus();
            const enabled = getComputedStyle(button, "::after").display;
            button.classList.add("vditor-menu--disabled");
            const disabled = getComputedStyle(button, "::after").display;
            button.classList.remove("vditor-menu--disabled");
            return {enabled, disabled, restored: getComputedStyle(button, "::after").display};
        });
        expect(result).toEqual({enabled: "inline-block", disabled: "none", restored: "inline-block"});
    });
});
