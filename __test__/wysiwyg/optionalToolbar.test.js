const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe("optional WYSIWYG toolbar callback", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.addScriptTag({url: "http://localhost:9000/js/icons/ant.js", id: "vditorIconScript"});
    });
    afterAll(async () => { await browser?.close(); });

    it("opens heading and link toolbars without a custom callback", async () => {
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        await page.evaluate(async () => {
            const element = document.createElement("div");
            element.id = "optional-toolbar-fixture";
            document.body.appendChild(element);
            const Vditor = window.vditorTest.constructor;
            window.optionalToolbarEditor = await new Promise(resolve => {
                const editor = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js", cdn: "http://localhost:9000", cache: false, i18n: window.VditorI18n,
                    mode: "wysiwyg", toolbar: [], after: () => resolve(editor),
                });
            });
            window.optionalToolbarEditor.setValue("# heading\n\n[link](https://example.com)");
        });
        await page.click("#optional-toolbar-fixture h1");
        await page.click("#optional-toolbar-fixture .vditor-wysiwyg a");
        await page.evaluate(() => {
            window.optionalToolbarEditor.destroy();
            document.querySelector("#optional-toolbar-fixture").remove();
        });
        expect(errors).toEqual([]);
    });
});
