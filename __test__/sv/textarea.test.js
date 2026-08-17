const {launchBrowser} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("SV textarea", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest);
        await page.addScriptTag({url: "http://localhost:9000/js/i18n/en_US.js"});
    });

    test("uses a textarea without list auto-completion", async () => {
        const initial = await page.evaluate(async () => {
            const Vditor = window.vditorTest.constructor;
            const element = document.createElement("div");
            document.body.appendChild(element);
            window.svEditor = await new Promise((resolve) => {
                let editor;
                editor = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js",
                    after: () => resolve(editor),
                    cache: {enable: false},
                    i18n: window.VditorI18n,
                    mode: "sv",
                    preview: {delay: 0},
                    toolbar: [],
                    value: "* item",
                });
            });
            const textarea = window.svEditor.vditor.sv.element;
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            return {
                childCount: textarea.childElementCount,
                tagName: textarea.tagName,
                value: textarea.value,
            };
        });

        expect(initial).toEqual({
            childCount: 0,
            tagName: "TEXTAREA",
            value: "* item",
        });

        await page.keyboard.press("Enter");
        await page.keyboard.type("next");
        const result = await page.evaluate(() => {
            const textarea = window.svEditor.vditor.sv.element;
            textarea.setSelectionRange(2, 6);
            const selection = window.svEditor.getSelection();
            window.svEditor.updateValue("entry");
            window.svEditor.disabled();
            return {
                disabled: textarea.disabled,
                selection,
                value: window.svEditor.getValue(),
            };
        });
        expect(result).toEqual({
            disabled: true,
            selection: "item",
            value: "* entry\nnext\n",
        });
    });

    test("restores textarea content and caret on undo", async () => {
        await page.evaluate(async () => {
            const editor = window.svEditor;
            editor.enable();
            editor.setValue("a", true);
            const textarea = editor.vditor.sv.element;
            textarea.focus();
            textarea.setSelectionRange(1, 1);
            await new Promise((resolve) => setTimeout(resolve, editor.vditor.options.undoDelay + 100));
        });
        await page.keyboard.type("b");
        const result = await page.evaluate(async () => {
            const editor = window.svEditor;
            await new Promise((resolve) => setTimeout(resolve, editor.vditor.options.undoDelay + 100));
            editor.vditor.undo.undo(editor.vditor);
            return {
                selectionStart: editor.vditor.sv.element.selectionStart,
                value: editor.getValue(),
            };
        });
        expect(result).toEqual({
            selectionStart: 1,
            value: "a\n",
        });
    });

    afterAll(async () => {
        await page.evaluate(() => {
            if (window.svEditor) {
                const element = window.svEditor.vditor.element;
                window.svEditor.destroy();
                element.remove();
            }
        });
        await browser?.close();
    });
});
