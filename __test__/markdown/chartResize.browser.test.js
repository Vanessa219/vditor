const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("../util/launchBrowser");

describe("responsive ECharts", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setContent('<div id="container" style="width:600px"><div class="language-echarts" style="height:300px"></div></div>');
        await page.addScriptTag({path: path.resolve(__dirname, "../../src/js/echarts/echarts.min.js")});
        const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname,
            "../../src/ts/markdown/chartRender.ts"), "utf8"), {
            compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
        }).outputText;
        await page.addScriptTag({content: `(() => {
            const api = {};
            const deps = {"../constants": {Constants: {}}, "../util/addScript": {addScript: () => Promise.resolve()},
                "../util/function": {looseJsonParse: text => JSON.parse(text)},
                "./adapterRender": {chartRenderAdapter: {getElements: root => root.querySelectorAll(".language-echarts"), getCode: () => '{"animation":false,"series":[{"type":"pie","data":[{"value":1}]}]}'}}};
            new Function("exports", "require", ${JSON.stringify(source)})(api, name => deps[name] || {});
            window.renderChart = api.chartRender;
        })();`});
    });
    afterAll(async () => { await browser?.close(); });
    it("resizes with its container and releases removed charts", async () => {
        await page.evaluate(() => window.renderChart(document, "", "classic"));
        await page.waitForFunction(() => document.querySelector(".language-echarts").getAttribute("data-processed") === "true");
        expect(await page.evaluate(() => echarts.getInstanceByDom(document.querySelector(".language-echarts")).getWidth())).toBe(600);
        await page.evaluate(() => document.querySelector("#container").style.width = "280px");
        await page.waitForFunction(() => echarts.getInstanceByDom(document.querySelector(".language-echarts")).getWidth() === 280);
        await page.evaluate(() => {
            window.chartElement = document.querySelector(".language-echarts");
            document.querySelector("#container").remove();
        });
        await page.waitForFunction(() => !echarts.getInstanceByDom(window.chartElement));
    });
});
