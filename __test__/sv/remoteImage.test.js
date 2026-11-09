const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe("SV remote image paste", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => { await browser?.close(); });

    it.each([
        ["![image](https://example.com/image.png)", "", true],
        ["image", '<img src="https://example.com/image.png" alt="image">', true],
        ["[link](https://example.com/image.png)", "", false],
        ["`![image](https://example.com/image.png)`", "", false],
    ])("only transfers images: %s", async (plain, html, transfers) => {
        const result = await page.evaluate(async ({plain, html}) => {
            const element = document.createElement("div");
            document.body.appendChild(element);
            const Vditor = window.vditorTest.constructor;
            const editor = await new Promise(resolve => {
                const value = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js", cache: false, i18n: window.VditorI18n,
                    mode: "sv", toolbar: [], upload: {linkToImgUrl: "/fetch-image"},
                    after: () => resolve(value),
                });
            });
            const NativeXHR = window.XMLHttpRequest;
            const requests = [];
            window.XMLHttpRequest = class {
                static DONE = 4;
                open(method, url) { this.url = url; }
                setRequestHeader() {}
                send(body) {
                    requests.push({url: this.url, body: JSON.parse(body)});
                    setTimeout(() => {
                        this.readyState = 4;
                        this.status = 200;
                        this.responseText = JSON.stringify({code: 0, data: {
                            originalURL: "https://example.com/image.png", url: "/local/image.png",
                        }});
                        this.onreadystatechange();
                    }, 0);
                }
            };
            try {
                const input = editor.vditor.sv.element;
                input.focus();
                const clipboardData = new DataTransfer();
                clipboardData.setData("text/plain", plain);
                clipboardData.setData("text/html", html);
                input.dispatchEvent(new ClipboardEvent("paste", {bubbles: true, clipboardData}));
                await new Promise(resolve => setTimeout(resolve, 100));
                return {value: editor.getValue(), requests};
            } finally {
                window.XMLHttpRequest = NativeXHR;
                editor.destroy();
                element.remove();
            }
        }, {plain, html});
        expect(result.requests).toHaveLength(transfers ? 1 : 0);
        if (transfers) {
            expect(result.requests[0]).toEqual({url: "/fetch-image", body: {url: "https://example.com/image.png"}});
            expect(result.value).toContain("![image](/local/image.png)");
        } else {
            expect(result.value.trim()).toBe(plain);
        }
    });
});
