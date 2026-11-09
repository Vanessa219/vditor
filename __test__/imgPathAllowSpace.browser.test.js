const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("image path spaces option", () => {
    let browser;
    let page;
    beforeAll(async () => ({browser, page} = await openEditorPage()));
    afterAll(async () => { await browser?.close(); });

    it.each(["sv", "ir", "wysiwyg"])("applies the option in %s and Markdown previews", async mode => {
        for (const enabled of [false, true]) {
            await newEditor(page, {mode, preview: {markdown: {imgPathAllowSpace: enabled}}});
            const result = await page.evaluate(async () => {
                const editor = window.testEditor;
                const markdown = "![alt](images/my photo.png)";
                editor.setValue(markdown);
                return {
                    html: editor.getHTML(),
                    preview: await editor.constructor.md2html(markdown, {
                        markdown: editor.vditor.options.preview.markdown,
                    }),
                    roundTrip: editor.vditor.lute.Md2HTML(editor.getValue()),
                };
            });
            for (const html of Object.values(result)) {
                if (enabled) {
                    expect(decodeURI(html)).toContain('src="images/my photo.png"');
                } else {
                    expect(html).not.toContain("<img");
                }
            }
        }
    });
});
