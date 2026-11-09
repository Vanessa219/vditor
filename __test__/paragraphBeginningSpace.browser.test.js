const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("paragraph indentation", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });

    for (const mode of ["wysiwyg", "ir", "sv"]) {
        it.each([false, true])(`${mode}: honors paragraphBeginningSpace=%s without changing Markdown`, async enabled => {
            const value = "中文段落\n\nEnglish paragraph\n\n# Heading\n\n- item\n";
            await newEditor(page, {mode, value, preview: {markdown: {paragraphBeginningSpace: enabled}}});
            const result = await page.evaluate(mode => {
                const editor = window.testEditor;
                const root = document.createElement("div"); root.className = "vditor-reset";
                root.innerHTML = editor.getHTML(); document.body.append(root);
                const indent = element => parseFloat(getComputedStyle(element).textIndent) /
                    parseFloat(getComputedStyle(element).fontSize);
                const output = [...root.querySelectorAll("p")].map(indent);
                const edit = mode === "sv" ? [] : [...editor.vditor[mode].element.querySelectorAll("p")].map(indent);
                const other = [...root.querySelectorAll("h1, li")].map(indent);
                const markdown = editor.getValue(); root.remove();
                return {output, edit, other, markdown};
            }, mode);
            expect(result.output).toEqual([enabled ? 2 : 0, enabled ? 2 : 0]);
            expect(result.edit).toEqual(mode === "sv" ? [] : result.output);
            expect(result.other).toEqual([0, 0]);
            expect(result.markdown).toBe(value);
        });
    }
});
