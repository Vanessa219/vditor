const {launchBrowser} = require("./util/launchBrowser");

describe("table clipboard", () => {
    let browser;
    let page;
    const origin = process.env.VDITOR_TEST_ORIGIN || "http://localhost:9000";
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", request => {
            const url = request.url();
            const marker = url.indexOf("/dist/");
            request.continue(marker !== -1 && /(?:jsdelivr.net|unpkg.com)/.test(url) ?
                {url: origin + "/" + url.substring(marker + 6)} : {});
        });
        await page.goto(origin + "/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => { await browser?.close(); });

    const run = (mode, callback, ...args) => page.evaluate(async (mode, callback, args) => {
        const root = document.createElement("div");
        document.body.appendChild(root);
        const instance = await new Promise(resolve => {
            const editor = new window.vditorTest.constructor(root, {
                mode, icon: "", cache: {enable: false}, i18n: window.VditorI18n,
                _lutePath: "/js/lute/lute.min.js", undoDelay: 0, preview: {delay: 0},
                after: () => resolve(editor),
            });
        });
        const element = instance.vditor[mode].element;
        const select = (start, end = start) => {
            const range = document.createRange();
            range.selectNodeContents(start);
            if (start === end) { range.collapse(false); } else { range.setEndAfter(end.lastChild || end); }
            getSelection().removeAllRanges(); getSelection().addRange(range); element.focus();
        };
        const paste = async (html, plain = "") => {
            const data = new DataTransfer();
            data.setData("text/html", html); data.setData("text/plain", plain);
            element.dispatchEvent(new ClipboardEvent("paste", {bubbles: true, clipboardData: data}));
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        try { return await new Function("return (" + callback + ")")()(instance, element, select, paste, ...args); }
        finally { instance.destroy(); root.remove(); }
    }, mode, callback.toString(), args);

    for (const mode of ["wysiwyg", "ir"]) {
        if (mode === "wysiwyg") { it(`${mode}: keeps ordinary multiline text in one cell`, async () => {
            const result = await run(mode, async (instance, element, select, paste) => {
                instance.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |\n");
                select(element.querySelector("tbody td"));
                await paste("", "first\nsecond");
                return {value: instance.getValue(), rows: element.querySelector("table").rows.length};
            });
            expect(result.rows).toBe(2);
            expect(result.value).toContain("first");
            expect(result.value).toContain("second");
        }); }
        it(`${mode}: fills and grows a table, preserving rich text and undo/redo`, async () => {
            const result = await run(mode, async (instance, element, select, paste) => {
                instance.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |\n");
                const before = instance.getValue();
                select(element.querySelector("tbody td:last-child"));
                await paste("<table><tr><td><strong>bold</strong></td><td><a href='https://example.com'>link</a></td></tr><tr><td>next</td><td>last</td></tr></table>");
                const after = instance.getValue();
                const sizes = Array.from(element.querySelector("table").rows, row => row.cells.length);
                instance.vditor.undo.undo(instance.vditor);
                const undo = instance.getValue();
                instance.vditor.undo.redo(instance.vditor);
                return {before, after, undo, redo: instance.getValue(), sizes};
            });
            expect(result.sizes).toEqual([3, 3, 3]);
            expect(result.after).toContain("**bold**");
            expect(result.after).toContain("[link](https://example.com)");
            expect(result.after).toContain("last");
            expect(result.undo).toBe(result.before);
            expect(result.redo).toBe(result.after);
        });

        it(`${mode}: parses escaped pipes and retains inline Markdown`, async () => {
            const result = await run(mode, async (instance, element, select, paste) => {
                instance.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |\n");
                select(element.querySelector("tbody td"));
                await paste("", "| a\\|b | **bold** |\n| --- | --- |\n| : | `code` |");
                return {value: instance.getValue(), width: element.querySelector("table").rows[0].cells.length};
            });
            expect(result.width).toBe(2);
            expect(result.value).toContain("a\\|b");
            expect(result.value).toContain("**bold**");
            expect(result.value).toContain("`code`");
            expect(result.value).toContain(":");
        });

        it(`${mode}: keeps surrounding content in mixed HTML`, async () => {
            const result = await run(mode, async (instance, element, select, paste) => {
                instance.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |\n");
                select(element.querySelector("tbody td"));
                await paste("<p>before</p><table><tr><td>middle</td></tr></table><p>after</p>");
                return instance.getValue();
            });
            for (const value of ["before", "middle", "after"]) { expect(result).toContain(value); }
        });

        it(`${mode}: copies standard HTML and round-trips multiple rich cells`, async () => {
            const result = await run(mode, async (instance, element, select, paste) => {
                instance.setValue("| **bold** | [link](https://example.com) |\n| --- | --- |\n| a\\|b | `code` |\n");
                const table = element.querySelector("table");
                select(table.rows[0].cells[0], table.rows[1].cells[1]);
                const data = new DataTransfer();
                element.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData: data}));
                const html = data.getData("text/html");
                const plain = data.getData("text/plain");
                instance.setValue("| h1 | h2 |\n| --- | --- |\n| a | b |\n");
                select(element.querySelector("th"));
                await paste(html, plain);
                return {html, plain, value: instance.getValue()};
            });
            expect(result.html).not.toMatch(/vditor-|data-type|<wbr/);
            expect(result.html).toContain("<strong>bold</strong>");
            expect(result.plain).toContain("a\\|b");
            expect(result.value).toContain("**bold**");
            expect(result.value).toContain("`code`");
        });
    }

    it("SV preserves Markdown table paste", async () => {
        const result = await run("sv", async (instance, element, select, paste) => {
            instance.setValue(""); element.focus();
            await paste("", "| a | b |\n| --- | --- |\n| c | d |\n");
            return instance.getValue();
        });
        expect(result).toContain("| a | b |");
        expect(result).toContain("| c | d |");
    });
});
