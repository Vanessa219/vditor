const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("../util/launchBrowser");

describe("outline navigation in a scrolling parent", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/lute/lute.min.js")});
        const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname,
            "../../src/ts/markdown/outlineRender.ts"), "utf8"), {
            compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
        }).outputText;
        await page.addScriptTag({content: `(() => {
            const api = {};
            const deps = {"../util/hasClosestByHeadings": {hasClosestByHeadings: el => /^H[1-6]$/.test(el.tagName)},
                "./mathRender": {mathRender() {}}};
            new Function("exports", "require", ${JSON.stringify(source)})(api, name => deps[name] || {});
            window.renderOutline = api.outlineRender;
        })();`});
    });
    afterAll(async () => { await browser?.close(); });
    it.each([false, true])("scrolls the parent with pinned toolbar = %s", async pin => {
        const result = await page.evaluate(pin => {
            document.body.innerHTML = '<div id="duplicate"><h2 id="target_1">wrong editor</h2></div>' +
                '<div id="scroll" style="height:200px;overflow:auto;border:2px solid"><div id="editor">' +
                '<div id="toolbar" style="height:40px"></div><div id="content"><p style="height:600px">before</p>' +
                '<h2 id="target">target</h2><p style="height:600px">after</p></div></div></div><div id="outline"></div>';
            const content = document.querySelector("#content");
            window.renderOutline(content, document.querySelector("#outline"), {
                currentMode: "wysiwyg", lute: Lute.New(), element: document.querySelector("#editor"),
                preview: {element: document.createElement("div")}, toolbar: {element: document.querySelector("#toolbar")},
                options: {height: "auto", toolbarConfig: {pin}, preview: {markdown: {toc: false}}},
            });
            document.querySelector("#outline [data-target-id]").click();
            const scroll = document.querySelector("#scroll");
            return {top: scroll.scrollTop, gap: content.querySelector("h2").getBoundingClientRect().top -
                scroll.getBoundingClientRect().top - scroll.clientTop};
        }, pin);
        expect(result.top).toBeGreaterThan(400);
        expect(Math.abs(result.gap - (pin ? 40 : 0))).toBeLessThan(2);
    });
});
