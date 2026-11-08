const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const puppeteer = require("puppeteer");

describe("clipboard code and Markdown conversion", () => {
    let browser;
    let page;
    beforeAll(async () => {
        let executablePath;
        try { executablePath = puppeteer.executablePath(); } catch { executablePath = puppeteer.executablePath("chrome"); }
        browser = await puppeteer.launch({executablePath});
        page = await browser.newPage();
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/lute/lute.min.js")});
        const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname,
            "../../src/ts/util/processCode.ts"), "utf8"), {
            compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
        }).outputText;
        await page.addScriptTag({content: `window.clipboardCode = {}; new Function("exports", "require", ${JSON.stringify(source)})(window.clipboardCode, () => ({}));`});
    });
    afterAll(async () => { await browser?.close(); });

    it.each(["sv", "ir", "wysiwyg"])("parses Markdown clipboard payloads in %s", async (mode) => {
        const results = await page.evaluate((mode) => {
            const lute = Lute.New();
            lute.SetInlineMathAllowDigitAfterOpenMarker(true);
            const values = [
                ["```python\nprint(1)\n```\n\n<div>\n<style>th { text-align: right; }</style>\n<table><tr><td>value</td></tr></table>\n</div>",
                    '<div style="font-family:monospace">clipboard</div>', '{"mode":"markdown"}'],
                ["formula $2(z+\\bar{z})=4+6i$", '<pre style="white-space: pre-wrap">formula</pre>', ""],
            ];
            return values.map(([text, html, metadata]) => {
                if (window.clipboardCode.isPlainTextPaste(html, metadata)) html = "";
                const code = window.clipboardCode.processPasteCode(html, text, mode);
                const converted = html ? lute.HTML2Md(html) : text;
                return {code, html: lute.Md2HTML(converted)};
            });
        }, mode);
        expect(results[0].code).toBe(false);
        expect(results[0].html).toContain("language-python");
        expect(results[0].html).toContain("<table>");
        expect(results[1].code).toBe(false);
        expect(results[1].html).toContain("language-math");
    });

    it.each(["sv", "ir", "wysiwyg"])("preserves standalone code and mixed HTML in %s", async (mode) => {
        const result = await page.evaluate((mode) => {
            const {processPasteCode, isPlainTextPaste} = window.clipboardCode;
            const standalone = [
                "<pre><code>print(1)</code></pre>",
                "<pre>print(1)</pre>",
                '<div style="font-family:monospace">print(1)</div>',
                '<table><tr><td class="line-number">1</td><td class="line-content">print(1)</td></tr></table>',
            ].map(html => processPasteCode(html, "print(1)\nprint(2)", mode));
            const mixed = [
                "<div><p>before</p><pre><code>print(1)</code></pre><p>after</p></div>",
                "<div>before<pre><code>print(1)</code></pre>after</div>",
                "<div><pre>first</pre><pre>second</pre></div>",
            ].map(html => processPasteCode(html, "before\nprint(1)\nafter", mode));
            return {standalone, mixed,
                invalidMetadata: isPlainTextPaste("<p>text</p>", "{invalid"),
                richPre: isPlainTextPaste('<pre style="white-space:pre-wrap"><code>code</code></pre>', ""),
                cocoa: processPasteCode('\n<p class="p1">text</p>', "text", mode)};
        }, mode);
        expect(result.standalone.every(value => typeof value === "string")).toBe(true);
        expect(result.mixed).toEqual([false, false, false]);
        expect(result.invalidMetadata).toBe(false);
        expect(result.richPre).toBe(false);
        expect(result.cocoa).toBe(false);
    });
});
