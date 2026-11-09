const {openEditorPage} = require("./util/editorHarness");

describe("custom tips integration", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    it("uses initialization callbacks for public tips and hides on destroy", async () => {
        const result = await page.evaluate(async () => {
            const root = document.createElement("div"); document.body.appendChild(root);
            const calls = [];
            const editor = await new Promise(resolve => {
                const instance = new window.vditorTest.constructor(root, {
                    icon: "", cache: {enable: false}, i18n: window.VditorI18n,
                    _lutePath: "/js/lute/lute.min.js", after: () => resolve(instance),
                    tips: {show: (text, time) => calls.push([text, time]), hide: () => calls.push("hide")},
                });
            });
            editor.tip("custom message", 0);
            const builtIn = root.querySelector(".vditor-tip").textContent;
            editor.destroy(); root.remove();
            return {calls, builtIn};
        });
        expect(result).toEqual({calls: [["custom message", 0], "hide"], builtIn: ""});
    });
});
