const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("reordering list items through cut and paste", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser(); page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => { await browser?.close(); });
    for (const mode of ["ir", "wysiwyg"]) {
        it.each(["unordered", "ordered", "task"])(`moves a whole %s item before the first item in ${mode}`, async kind => {
            const result = await page.evaluate(async ({mode, kind}) => {
                window.reorderEditor?.destroy(); document.querySelector("#reorder-editor")?.remove();
                const root = document.createElement("div"); root.id = "reorder-editor"; document.body.appendChild(root);
                const markdown = kind === "ordered" ? "1. first\n2. second\n3. third\n" :
                    kind === "task" ? "- [ ] first\n- [x] second\n- [ ] third\n" : "- first\n- second\n- third\n";
                const editor = await new Promise(resolve => {
                    const instance = new window.vditorTest.constructor(root, {
                        mode, value: markdown, icon: "", cache: {enable: false}, i18n: window.VditorI18n,
                        _lutePath: "/js/lute/lute.min.js", after: () => resolve(instance),
                    });
                });
                window.reorderEditor = editor;
                editor.vditor.undo.clearStack(editor.vditor);
                editor.vditor.undo.addToUndoStack(editor.vditor);
                const editable = editor.vditor[mode].element; editable.focus();
                const second = editable.querySelectorAll("li")[1];
                const range = document.createRange(); range.selectNode(second);
                getSelection().removeAllRanges(); getSelection().addRange(range);
                const values = {};
                const clipboard = {getData: type => values[type] || "", setData: (type, value) => values[type] = value,
                    files: [], types: ["text/plain"]};
                const cut = new Event("cut", {bubbles: true, cancelable: true});
                Object.defineProperty(cut, "clipboardData", {value: clipboard}); editable.dispatchEvent(cut);
                const cutMarkdown = editor.getValue();
                editor.vditor.undo.addToUndoStack(editor.vditor);
                const first = editable.querySelector("li");
                const walker = document.createTreeWalker(first, NodeFilter.SHOW_TEXT);
                let node;
                while ((node = walker.nextNode())) if (node.textContent.includes("first")) break;
                range.setStart(node, node.textContent.indexOf("first")); range.collapse(true);
                getSelection().removeAllRanges(); getSelection().addRange(range);
                const paste = new Event("paste", {bubbles: true, cancelable: true});
                Object.defineProperty(paste, "clipboardData", {value: clipboard}); editable.dispatchEvent(paste);
                await new Promise(resolve => setTimeout(resolve, 100));
                const markdownAfter = editor.getValue();
                const items = Array.from(editable.querySelectorAll("li"), item => item.textContent.replace(/\u200b/g, "").trim());
                editor.vditor.undo.addToUndoStack(editor.vditor);
                editor.vditor.undo.undo(editor.vditor);
                const undone = editor.getValue();
                editor.vditor.undo.redo(editor.vditor);
                return {markdown: markdownAfter, items, clipboard: values["text/plain"], cutMarkdown, undone, redone: editor.getValue()};
            }, {mode, kind});
            expect(result.clipboard).toContain("second");
            expect(result.items).toHaveLength(3);
            expect(result.items[0]).toContain("second");
            expect(result.items[1]).toContain("first");
            expect(result.items[2]).toContain("third");
            if (kind === "task") expect(result.markdown).toMatch(/^- \[x\]\s+second/i);
            expect(result.undone).toBe(result.cutMarkdown);
            expect(result.redone).toBe(result.markdown);
        });
    }
});
