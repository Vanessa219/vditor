const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

jest.setTimeout(30000);

describe("upload errors", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    it("does not change IR content when no file is uploaded", async () => {
        const result = await page.evaluate(() => new Promise((resolve) => {
            const element = document.createElement("div");
            document.body.appendChild(element);
            const NativeXMLHttpRequest = window.XMLHttpRequest;
            const responseText = JSON.stringify({
                code: 1,
                data: {
                    errFiles: ["image.png <b>(already exists)</b>"],
                    succMap: {},
                },
                msg: "",
            });

            class FakeXMLHttpRequest {
                static DONE = 4;

                constructor() {
                    this.readyState = 0;
                    this.responseText = "";
                    this.status = 0;
                    this.upload = {};
                }

                open() {
                    // noop
                }

                send() {
                    this.readyState = FakeXMLHttpRequest.DONE;
                    this.responseText = responseText;
                    this.status = 200;
                    this.onreadystatechange();
                }

                setRequestHeader() {
                    // noop
                }
            }

            const Vditor = window.vditorTest.constructor;
            let editor;
            editor = new Vditor(element, {
                _lutePath: "/js/lute/lute.min.js",
                after: () => {
                    editor.setValue("![image](image.png)");
                    const vditor = editor.vditor;
                    const linkElement = vditor.ir.element.querySelector(".vditor-ir__marker--link");
                    const range = document.createRange();
                    range.selectNodeContents(linkElement);
                    getSelection().removeAllRanges();
                    getSelection().addRange(range);
                    vditor.ir.range = range.cloneRange();

                    const beforeHTML = vditor.ir.element.innerHTML;
                    const beforeMarkdown = editor.getValue();
                    window.XMLHttpRequest = FakeXMLHttpRequest;

                    const input = vditor.toolbar.element.querySelector('input[type="file"]');
                    input.focus();
                    getSelection().removeAllRanges();
                    getSelection().addRange(range);
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(new File(["image"], "image.png", {type: "image/png"}));
                    input.files = dataTransfer.files;
                    input.dispatchEvent(new Event("change", {bubbles: true}));

                    const value = {
                        afterHTML: vditor.ir.element.innerHTML,
                        afterMarkdown: editor.getValue(),
                        beforeHTML,
                        beforeMarkdown,
                        tip: vditor.tip.element.textContent,
                    };
                    window.XMLHttpRequest = NativeXMLHttpRequest;
                    editor.destroy();
                    element.remove();
                    resolve(value);
                },
                cache: false,
                i18n: window.VditorI18n,
                mode: "ir",
                toolbar: ["upload"],
                upload: {
                    url: "/upload",
                },
            });
        }));

        expect(result.afterHTML).toBe(result.beforeHTML);
        expect(result.afterMarkdown).toBe(result.beforeMarkdown);
        expect(result.tip).toContain("already exists");
    });

    afterAll(async () => {
        await browser?.close();
    });
});
