const {openEditorPage} = require("./util/editorHarness");

describe("editor preference callback", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    it("reports toolbar and API settings, isolates snapshots and restores JSON options", async () => {
        const result = await page.evaluate(async () => {
            const calls = [];
            const create = async (options = {}) => {
                const root = document.createElement("div"); document.body.appendChild(root);
                return new Promise(resolve => {
                    const instance = new window.vditorTest.constructor(root, {
                        icon: "", cache: {enable: false}, i18n: window.VditorI18n,
                        _lutePath: "/js/lute/lute.min.js", ...options,
                        configChange: value => calls.push(value), after: () => resolve(instance),
                    });
                });
            };
            const editor = await create();
            const initial = calls.length;
            editor.setValue("hello");
            const afterInput = calls.length;
            editor.vditor.toolbar.elements["edit-mode"].querySelector("[data-mode='sv']").click();
            editor.setPreviewMode("editor");
            editor.setTheme("dark", "dark", "github");
            editor.vditor.toolbar.elements["edit-mode"].querySelector("[data-mode='wysiwyg']").click();
            editor.vditor.toolbar.elements.outline.firstElementChild.click();
            const code = editor.vditor.toolbar.elements["code-theme"].lastElementChild.querySelector("button");
            code.click();
            const content = editor.vditor.toolbar.elements["content-theme"].lastElementChild.querySelector("button");
            content.click();
            const saved = JSON.parse(JSON.stringify(calls[calls.length - 1]));
            calls[calls.length - 1].outline.enable = !saved.outline.enable;
            const isolated = editor.vditor.options.outline.enable === saved.outline.enable;
            const snapshots = calls.map(item => item.mode);
            const root = editor.vditor.element; editor.destroy(); root.remove();
            const restored = await create(saved);
            const actual = {mode: restored.getCurrentMode(), theme: restored.vditor.options.theme,
                outline: restored.vditor.options.outline.enable,
                code: restored.vditor.options.preview.hljs.style, content: restored.vditor.options.preview.theme.current,
                preview: restored.vditor.options.preview.mode};
            const finalRoot = restored.vditor.element; restored.destroy(); finalRoot.remove();
            return {initial, afterInput, snapshots, isolated, saved, actual};
        });
        expect(result.initial).toBe(0);
        expect(result.afterInput).toBe(0);
        expect(result.snapshots).toEqual(["sv", "sv", "sv", "wysiwyg", "wysiwyg", "wysiwyg", "wysiwyg"]);
        expect(result.isolated).toBe(true);
        expect(result.actual).toEqual({mode: result.saved.mode, theme: result.saved.theme,
            outline: result.saved.outline.enable, code: result.saved.preview.hljs.style,
            content: result.saved.preview.theme.current, preview: result.saved.preview.mode});
    });
});
