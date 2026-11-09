const {openEditorPage, newEditor} = require("../util/editorHarness");

describe("MathJax loading and numbering", () => {
    it.each(["none", "ams"])("loads asynchronously and honors tags=%s", async tags => {
        const {browser, page} = await openEditorPage();
        try {
            await page.evaluate(() => {
                window.syncRequests = [];
                const open = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url, async, ...rest) {
                    if (async === false) { window.syncRequests.push(url); }
                    return open.call(this, method, url, async, ...rest);
                };
            });
            await newEditor(page, {icon: "ant", value: "$$\n\\begin{equation}E=mc^2\\end{equation}\n$$\n",
                preview: {math: {engine: "MathJax", mathJaxOptions: {tex: {tags}}}}});
            await page.waitForFunction(() => window.testEditor.vditor.wysiwyg.element.querySelector("mjx-container svg"));
            await page.waitForFunction(() => document.querySelector("#vditorIconScript"));
            const result = await page.evaluate(() => ({sync: window.syncRequests,
                labels: window.testEditor.vditor.wysiwyg.element.querySelectorAll('[data-mml-node="mlabeledtr"]').length,
                scripts: document.querySelectorAll("#protyleMathJaxScript").length,
                value: window.testEditor.getValue()}));
            expect(result.sync).toEqual([]);
            expect(result.scripts).toBe(1);
            expect(result.labels).toBe(tags === "ams" ? 1 : 0);
            expect(result.value).toContain("\\begin{equation}E=mc^2\\end{equation}");
        } finally { await browser.close(); }
    });
});
