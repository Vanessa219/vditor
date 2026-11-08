const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("../util/launchBrowser");

describe("code line number rendering", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setContent('<style>code {display:block;width:160px;white-space:pre-wrap;font:16px/24px monospace}</style><pre><code></code></pre>');
        const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname,
            "../../src/ts/markdown/highlightRender.ts"), "utf8"), {
            compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
        }).outputText;
        await page.addScriptTag({content: `(() => {
            const api = {};
            const deps = {"../constants": {Constants: {CODE_THEME: ["github"]}},
                "../util/addScript": {addScript: () => Promise.resolve()}, "../util/addStyle": {addStyle() {}}};
            window.hljs = {getLanguage: () => true, highlight: text => ({value: text})};
            new Function("exports", "require", ${JSON.stringify(source)})(api, name => deps[name] || {});
            window.renderLines = api.highlightRender;
        })();`});
    });
    afterAll(async () => { await browser?.close(); });

    it.each(["first\nsecond", "first\nsecond\n", "first\n\nsecond\n", "long ".repeat(30) + "\nsecond\n"])(
        "keeps every source line across repeated highlighting: %j", async (text) => {
            const result = await page.evaluate(async text => {
                const code = document.querySelector("code");
                code.textContent = text;
                const values = [];
                for (let i = 0; i < 2; i++) {
                    window.renderLines({style: "github", enable: true, lineNumber: true, defaultLang: ""}, document);
                    await new Promise(resolve => setTimeout(resolve, 0));
                    values.push({text: code.textContent, rows: code.querySelectorAll(".vditor-linenumber__rows > span").length,
                        heights: Array.from(code.querySelectorAll(".vditor-linenumber__rows > span"), row => row.style.height)});
                }
                return values;
            }, text);
            const count = text.replace(/\n$/, "").split("\n").length;
            for (const value of result) {
                expect(value.text).toBe(text);
                expect(value.rows).toBe(count);
                expect(value.heights.every(height => parseFloat(height) >= 24)).toBe(true);
            }
        });
});
