const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("selecting and copying documents with TOC", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
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
            const result = {copied: clipboardData.getData("text/plain"), value: editor.getValue()};
            window.tocCopyEditor = editor;
            return result;
        }, mode);
        expect(result.copied).toBe(result.value.trim());
        expect(result.copied).toContain("[toc]");
        expect(result.copied).toContain("body");
        await page.click("#toc-copy-fixture .vditor-toc span");
        await page.keyboard.down("Control");
        await page.keyboard.press("a");
        await page.keyboard.up("Control");
        const selection = await page.evaluate(mode => {
            const editor = window.tocCopyEditor;
            const surface = editor.vditor[mode].element;
            const range = getSelection().getRangeAt(0);
            const result = {inside: surface.contains(range.commonAncestorContainer), text: range.toString()};
            editor.destroy();
            document.querySelector("#toc-copy-fixture").remove();
            return result;
        }, mode);
        expect(selection.inside).toBe(true);
        expect(selection.text).toContain("body");
    });
});
