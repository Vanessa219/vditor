const fs = require("fs");
const os = require("os");
const path = require("path");
const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("upload file selection", () => {
    let browser;
    let page;
    let directory;
    let file;
    beforeAll(async () => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), "vditor-upload-selection-"));
        file = path.join(directory, "image.png");
        fs.writeFileSync(file, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=", "base64"));
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });
    afterAll(async () => {
        await browser?.close();
        if (file) fs.unlinkSync(file);
        if (directory) fs.rmdirSync(directory);
    });

    for (const mode of ["sv", "ir", "wysiwyg"]) {
        it.each(["middle", "end"])(`keeps the %s caret after file input focus in ${mode}`, async location => {
            await page.evaluate(async ({mode, location}) => {
                window.uploadEditor?.destroy(); document.querySelector("#upload-editor")?.remove();
                const root = document.createElement("div"); root.id = "upload-editor"; document.body.appendChild(root);
                window.uploadEditor = await new Promise(resolve => {
                    const editor = new window.vditorTest.constructor(root, {
                        mode, value: "first\n\nmiddle\n\nlast\n", icon: "", toolbar: ["upload"],
                        cache: {enable: false}, i18n: window.VditorI18n, _lutePath: "/js/lute/lute.min.js",
                        upload: {url: "/upload"}, after: () => resolve(editor),
                    });
                });
                const element = window.uploadEditor.vditor[mode].element;
                element.focus();
                if (mode === "sv") {
                    const offset = location === "end" ? element.value.length : element.value.indexOf("middle") + 3;
                    element.setSelectionRange(offset, offset);
                } else {
                    const paragraph = element.querySelectorAll("p")[location === "end" ? 2 : 1];
                    const node = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT).nextNode();
                    const range = document.createRange(); range.setStart(node, location === "end" ? 4 : 3); range.collapse(true);
                    getSelection().removeAllRanges(); getSelection().addRange(range);
                }
                window.nativeUploadXHR ||= window.XMLHttpRequest;
                window.XMLHttpRequest = class {
                    static DONE = 4;
                    upload = {};
                    open() {}
                    setRequestHeader() {}
                    send() {
                        this.readyState = 4; this.status = 200;
                        this.responseText = JSON.stringify({code: 0, data: {succMap: {"image.png": "/image.png"}}});
                        setTimeout(() => this.onreadystatechange(), 20);
                    }
                };
            }, {mode, location});
            try {
                const input = await page.$('#upload-editor input[type="file"]');
                await input.click();
                await input.uploadFile(file);
                await page.waitForFunction(() => window.uploadEditor.getValue().includes("/image.png"));
                const markdown = await page.evaluate(() => window.uploadEditor.getValue());
                if (location === "middle") expect(markdown).toContain("mid![image.png](/image.png)");
                else expect(markdown.indexOf("/image.png")).toBeGreaterThan(markdown.indexOf("last"));
            } finally {
                await page.evaluate(() => {window.XMLHttpRequest = window.nativeUploadXHR;});
            }
        });
    }
});
