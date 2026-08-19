const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

jest.setTimeout(30000);

describe("toolbar buttons", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    it("does not submit a parent form", async () => {
        const result = await page.evaluate(() => new Promise((resolve) => {
            const form = document.createElement("form");
            const element = document.createElement("div");
            form.appendChild(element);
            document.body.appendChild(form);

            let submitCount = 0;
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                submitCount++;
            });

            const Vditor = window.vditorTest.constructor;
            let editor;
            editor = new Vditor(element, {
                _lutePath: "/js/lute/lute.min.js",
                after: () => {
                    const toolbarElement = editor.vditor.toolbar.element;
                    const buttons = Array.from(toolbarElement.querySelectorAll("button"));
                    toolbarElement.querySelector('[data-type="preview"]').click();
                    toolbarElement.querySelector('[data-type="both"]').click();
                    const value = {
                        buttonCount: buttons.length,
                        buttonTypes: Array.from(new Set(buttons.map((button) => button.getAttribute("type")))),
                        submitCount,
                    };
                    editor.destroy();
                    form.remove();
                    resolve(value);
                },
                cache: false,
                i18n: window.VditorI18n,
                mode: "sv",
                toolbar: [
                    "headings",
                    "emoji",
                    "edit-mode",
                    "code-theme",
                    "content-theme",
                    "export",
                    "both",
                    "preview",
                ],
            });
        }));

        expect(result.buttonCount).toBeGreaterThan(10);
        expect(result.buttonTypes).toEqual(["button"]);
        expect(result.submitCount).toBe(0);
    });

    afterAll(async () => {
        await browser?.close();
    });
});
