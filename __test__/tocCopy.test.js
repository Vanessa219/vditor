const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe.each([false, true])("selecting and copying documents with TOC on mobile=%s", mobile => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setViewport({width: mobile ? 393 : 1024, height: 800, isMobile: mobile, hasTouch: mobile});
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => { await browser?.close(); });

    it.each(["wysiwyg", "ir"])("copies the whole %s document when selection includes a TOC", async mode => {
        const result = await page.evaluate(async mode => {
            const element = document.createElement("div");
            element.id = "toc-copy-fixture";
            document.body.appendChild(element);
            const Vditor = window.vditorTest.constructor;
            const editor = await new Promise(resolve => {
                const value = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js", cache: false, i18n: window.VditorI18n,
                    mode, toolbar: [], preview: {markdown: {toc: true}},
                    after: () => resolve(value),
                });
            });
            editor.setValue("[toc]\n\n# heading\n\nbody", true);
            const surface = editor.vditor[mode].element;
            const range = document.createRange();
            range.selectNodeContents(surface);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            surface.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, cancelable: true, clipboardData}));
            const result = {copied: clipboardData.getData("text/plain"), value: editor.getValue(),
                targets: [...surface.querySelectorAll(".vditor-toc [data-target-id]")].every(item =>
                    [...surface.children].some(heading => heading.id === item.getAttribute("data-target-id")))};
            window.tocCopyEditor = editor;
            return result;
        }, mode);
        expect(result.copied).toBe(result.value.trim());
        expect(result.copied).toContain("[toc]");
        expect(result.copied).toContain("body");
        expect(result.targets).toBe(true);
        await page.click("#toc-copy-fixture .vditor-toc span");
        expect(await page.evaluate(() => {
            const editor = window.tocCopyEditor;
            const surface = editor.vditor[editor.vditor.currentMode].element;
            const anchor = getSelection().anchorNode;
            return document.activeElement === surface && surface.contains(getSelection().anchorNode) &&
                (anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor).closest("h1") !== null;
        })).toBe(true);
        await page.keyboard.down("Control");
        await page.keyboard.press("a");
        await page.keyboard.up("Control");
        const selection = await page.evaluate(mode => {
            const editor = window.tocCopyEditor;
            const surface = editor.vditor[mode].element;
            const range = getSelection().getRangeAt(0);
            const clipboardData = new DataTransfer();
            surface.dispatchEvent(new ClipboardEvent("copy", {clipboardData, bubbles: true, cancelable: true}));
            const result = {inside: surface.contains(range.commonAncestorContainer), text: range.toString(),
                copied: clipboardData.getData("text/plain"), value: editor.getValue()};
            editor.destroy();
            document.querySelector("#toc-copy-fixture").remove();
            return result;
        }, mode);
        expect(selection.inside).toBe(true);
        expect(selection.text).toContain("body");
        expect(selection.copied).toBe(selection.value.trim());
    });

    it.each(["wysiwyg", "ir"])("keeps code-block selection scoped in %s", async mode => {
        await page.evaluate(async mode => {
            const root = document.createElement("div");
            document.body.appendChild(root);
            const Editor = window.vditorTest.constructor;
            window.selectionEditor = await new Promise(resolve => {
                const editor = new Editor(root, {_lutePath: "/js/lute/lute.min.js", cache: false,
                    i18n: window.VditorI18n, mode, toolbar: [], preview: {markdown: {toc: true}},
                    after: () => resolve(editor)});
            });
            const editor = window.selectionEditor;
            editor.setValue("[toc]\n\n# heading\n\n```js\nconst x = 1\n```\n\nbody", true);
            const surface = editor.vditor[mode].element;
            const code = surface.querySelector("pre code");
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(code);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        }, mode);
        await page.keyboard.down("Control");
        await page.keyboard.press("a");
        await page.keyboard.up("Control");
        const selection = await page.evaluate(mode => {
            const editor = window.selectionEditor;
            const surface = editor.vditor[mode].element;
            const code = surface.querySelector("pre code");
            const range = getSelection().getRangeAt(0);
            const result = {inside: code.contains(range.commonAncestorContainer), text: range.toString().trim()};
            const root = editor.vditor.element;
            editor.destroy(); root.remove();
            return result;
        }, mode);
        expect(selection).toEqual({inside: true, text: "const x = 1"});
    });
});
