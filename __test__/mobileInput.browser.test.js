const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const {launchBrowser} = require("./util/launchBrowser");

describe("mobile Enter followed by Chinese composition and paste", () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = process.env.VDITOR_DESKTOP_BROWSER ? await puppeteer.launch({
            executablePath: process.env.VDITOR_DESKTOP_BROWSER, headless: false,
        }) : await launchBrowser();
        page = await browser.newPage();
        await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
        const version = await browser.version();
        console.log(`Mobile emulation: ${version}`);
        await page.setUserAgent("Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36 EdgA/130.0.0.0");
        await page.setRequestInterception(true);
        page.on("request", request => {
            const url = request.url();
            if ((url.includes("unpkg.com/vditor") || url.includes("cdn.jsdelivr.net/npm/vditor")) && url.includes("/dist/")) {
                if (url.endsWith("/js/icons/ant.js")) {
                    request.respond({status: 200, contentType: "application/javascript",
                        headers: {"Access-Control-Allow-Origin": "*"},
                        body: fs.readFileSync(path.resolve(__dirname, "../src/js/icons/ant.js")),
                    });
                } else {
                    request.continue({url: `http://localhost:9000/${url.split("/dist/")[1]}`});
                }
            } else {
                request.continue();
            }
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => { await browser?.close(); });

    it.each(["wysiwyg", "ir"])("updates content, callback and counter after Enter in %s", async mode => {
        await page.evaluate(async mode => {
            const element = document.createElement("div");
            document.body.appendChild(element);
            const Vditor = window.vditorTest.constructor;
            window.mobileInputValues = [];
            window.mobileCounterValues = [];
            window.mobileInputEditor = await new Promise(resolve => {
                const editor = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js", cdn: "http://localhost:9000", cache: false,
                    i18n: window.VditorI18n, mode, toolbar: [],
                    counter: {enable: true, type: "markdown", after: value => window.mobileCounterValues.push(value)},
                    input: value => window.mobileInputValues.push(value), after: () => resolve(editor),
                });
            });
            const editor = window.mobileInputEditor;
            editor.setValue("first", true);
            const surface = editor.vditor[mode].element;
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(surface.lastElementChild);
            range.collapse(false);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        }, mode);
        await page.keyboard.press("Enter");
        const session = await page.createCDPSession();
        await session.send("Input.imeSetComposition", {text: "中文", selectionStart: 2, selectionEnd: 2});
        await session.send("Input.insertText", {text: "中文"});
        await page.waitForFunction(() => window.mobileInputValues.some(value => value.includes("中文")));
        const beforePaste = await page.evaluate(() => window.mobileCounterValues.at(-1));
        await page.evaluate(mode => {
            const clipboardData = new DataTransfer();
            clipboardData.setData("text/plain", " pasted");
            window.mobileInputEditor.vditor[mode].element.dispatchEvent(new ClipboardEvent("paste", {
                bubbles: true, cancelable: true, clipboardData,
            }));
        }, mode);
        await page.waitForFunction(() => window.mobileInputValues.some(value => value.includes("中文") && value.includes("pasted")));
        const result = await page.evaluate(() => ({
            value: window.mobileInputEditor.getValue(), counter: window.mobileCounterValues.at(-1),
            displayed: window.mobileInputEditor.vditor.counter.element.textContent,
        }));
        expect(result.value).toContain("first");
        expect(result.value).toContain("中文");
        expect(result.value).toContain("pasted");
        expect(result.counter).toBeGreaterThan(beforePaste);
        expect(Number(result.displayed)).toBe(result.value.replace(/\n$/, "").length);
        if (process.env.VDITOR_DESKTOP_SCREENSHOTS) {
            await page.screenshot({path: `${process.env.VDITOR_DESKTOP_SCREENSHOTS}-${mode}.png`, fullPage: true});
        }
        await page.evaluate(() => {
            const element = window.mobileInputEditor.vditor.element;
            window.mobileInputEditor.destroy();
            element.remove();
        });
    });
});
