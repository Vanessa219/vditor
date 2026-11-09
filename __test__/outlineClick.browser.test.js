const {openEditorPage} = require("./util/editorHarness");

describe("display outline click callback", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    it.each([false, true])("supports custom navigation=%s without changing collapse", async custom => {
        const result = await page.evaluate(custom => {
            const content = document.createElement("div");
            content.innerHTML = "<h1 id='parent'>Parent</h1><h2 id='child'>Child</h2>";
            const outline = document.createElement("div");
            document.body.append(content, outline);
            const calls = [];
            const scrolls = [];
            const original = window.scrollTo;
            window.scrollTo = (...args) => scrolls.push(args);
            const callback = (heading, event) => calls.push({id: heading.id, scoped: content.contains(heading), type: event.type});
            const render = window.vditorTest.constructor.outlineRender;
            render(content, outline, custom ? callback : undefined);
            render(content, outline, custom ? callback : undefined);
            outline.querySelector("[data-target-id='child'] span").click();
            const count = calls.length;
            const action = outline.querySelector(".vditor-outline__action");
            action.dispatchEvent(new MouseEvent("click", {bubbles: true}));
            const collapsed = action.classList.contains("vditor-outline__action--close");
            window.scrollTo = original;
            content.remove(); outline.remove();
            return {calls, count, scrolls: scrolls.length, collapsed};
        }, custom);
        expect(result.collapsed).toBe(true);
        expect(result.count).toBe(custom ? 1 : 0);
        expect(result.scrolls).toBe(custom ? 0 : 1);
        expect(result.calls).toEqual(custom ? [{id: "child", scoped: true, type: "click"}] : []);
    });
});
