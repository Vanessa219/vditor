const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("outline API", () => {
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

    it.each(["sv", "ir", "wysiwyg"])("returns current heading text, level and matching IDs in %s", async mode => {
        const value = await page.evaluate(async mode => {
            const root = document.createElement("div");
            document.body.appendChild(root);
            const editor = await new Promise(resolve => {
                const instance = new window.vditorTest.constructor(root, {
                    mode, value: "# same\n\ntext\n\n### **same** `code`\n\n# same\n\n> ## nested\n", icon: "",
                    cache: {enable: false}, i18n: window.VditorI18n, _lutePath: "/js/lute/lute.min.js",
                    preview: {delay: 0}, after: () => resolve(instance),
                });
            });
            const before = editor.getValue();
            const first = editor.getOutline();
            const second = editor.getOutline();
            await new Promise(resolve => setTimeout(resolve, 80));
            editor.vditor.outline.render(editor.vditor);
            const targets = Array.from(editor.vditor.outline.element.querySelectorAll("[data-target-id]"), item => item.getAttribute("data-target-id"));
            const after = editor.getValue();
            editor.setValue("# replacement\n");
            const replacement = editor.getOutline();
            editor.setValue("");
            const empty = editor.getOutline();
            editor.destroy(); root.remove();
            return {before, after, first, second, targets, replacement, empty};
        }, mode);
        expect(value.first.map(({text, level}) => ({text, level}))).toEqual([
            {text: "same", level: 1}, {text: "same code", level: 3}, {text: "same", level: 1},
        ]);
        expect(new Set(value.first.map(item => item.id)).size).toBe(3);
        expect(value.first.map(item => item.id)).toEqual(value.targets);
        expect(value.second).toEqual(value.first);
        expect(value.after).toBe(value.before);
        expect(value.replacement).toHaveLength(1);
        expect(value.replacement[0].text).toBe("replacement");
        expect(value.empty).toEqual([]);
    });
});
