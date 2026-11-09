const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const {launchBrowser} = require("./util/launchBrowser");

describe("initialization errors after loading translations", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, "../src/index.ts"), "utf8"), {
            compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019},
        }).outputText;
        await page.addScriptTag({content: `(() => {
            const api = {};
            const deps = {
                "./method": {default: class {}},
                "./ts/constants": {VDITOR_VERSION: "test"},
                "./ts/util/Options": {Options: class {merge() {return {lang: "zh_CN", cdn: "/assets", cache: {enable: false}};}}},
                "./ts/util/addScript": {addScript() {return window.scriptResult;}},
            };
            new Function("exports", "require", ${JSON.stringify(source)})(api, name => deps[name] || {});
            window.TestVditor = api.default;
        })();`});
    });
    afterAll(async () => { await browser?.close(); });

    it("keeps initialization exceptions separate from resource load errors", async () => {
        const errors = [];
        const listener = error => errors.push(error.message);
        page.on("pageerror", listener);
        const tips = await page.evaluate(async () => {
            window.tips = [];
            window.TestVditor.prototype.showErrorTip = text => window.tips.push(text);
            window.TestVditor.prototype.init = () => { throw new Error("invalid preview configuration"); };
            window.scriptResult = Promise.resolve(true);
            new window.TestVditor(document.createElement("div"));
            await new Promise(resolve => setTimeout(resolve, 30));
            return window.tips;
        });
        page.off("pageerror", listener);
        expect(tips).toEqual([]);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain("invalid preview configuration");
    });

    it("reports a resource load failure without inventing an HTTP status", async () => {
        const tips = await page.evaluate(async () => {
            window.tips = [];
            window.TestVditor.prototype.showErrorTip = text => window.tips.push(text);
            window.scriptResult = Promise.reject(new Event("error"));
            new window.TestVditor(document.createElement("div"));
            await new Promise(resolve => setTimeout(resolve, 30));
            return window.tips;
        });
        expect(tips).toEqual(["Failed to load /assets/dist/js/i18n/zh_CN.js"]);
    });
});
