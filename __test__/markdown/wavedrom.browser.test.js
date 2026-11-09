const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("WaveDrom browser rendering", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    it("replaces the language-wavedrom code element with a rendered div", async () => {
        await page.evaluate(async () => {
            const preview = document.createElement("div");
            preview.id = "wavedrom-preview";
            document.body.appendChild(preview);
            await window.vditorTest.constructor.preview(preview, `\`\`\`wavedrom
{ signal: [{ name: "clk", wave: "p...." }] }
\`\`\``, {
                cdn: "https://cdn.jsdelivr.net/npm/vditor",
                i18n: window.VditorI18n,
                icon: "",
            });
        });
        await page.waitForSelector("#wavedrom-preview div.language-wavedrom svg.WaveDrom");

        const result = await page.evaluate(() => {
            const preview = document.querySelector("#wavedrom-preview");
            const wavedrom = preview.querySelector(".language-wavedrom");
            return {
                codeCount: preview.querySelectorAll("code.language-wavedrom").length,
                processed: wavedrom.getAttribute("data-processed"),
                tagName: wavedrom.tagName,
            };
        });

        expect(result).toEqual({
            codeCount: 0,
            processed: "true",
            tagName: "DIV",
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
});
