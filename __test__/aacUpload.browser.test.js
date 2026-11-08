const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("AAC uploads", () => {
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
    it.each(["sv", "ir", "wysiwyg"])("inserts an AAC player in %s", async (mode) => {
        const value = await page.evaluate(async mode => {
            const root = document.createElement("div");
            document.body.appendChild(root);
            const editor = await new Promise(resolve => {
                const instance = new window.vditorTest.constructor(root, {
                    mode, cache: {enable: false}, i18n: window.VditorI18n, icon: "",
                    _lutePath: "/js/lute/lute.min.js", toolbar: ["upload"], upload: {url: "/upload"},
                    after: () => resolve(instance),
                });
            });
            const NativeXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = class {
                static DONE = 4;
                upload = {};
                open() {}
                setRequestHeader() {}
                send() {
                    this.status = 200;
                    this.readyState = 4;
                    this.responseText = JSON.stringify({code: 0, data: {succMap: {"recording.AAC": "/recording.aac"}}});
                    setTimeout(() => this.onreadystatechange(), 0);
                }
            };
            try {
                editor.vditor[mode].element.focus();
                const transfer = new DataTransfer();
                transfer.items.add(new File(["audio"], "recording.AAC", {type: "audio/aac"}));
                const input = editor.vditor.toolbar.element.querySelector('input[type="file"]');
                input.files = transfer.files;
                input.dispatchEvent(new Event("change", {bubbles: true}));
                await new Promise(resolve => setTimeout(resolve, 150));
                return {markdown: editor.getValue(), html: editor.getHTML()};
            } finally {
                window.XMLHttpRequest = NativeXHR;
                editor.destroy();
                root.remove();
            }
        }, mode);
        expect(value.markdown).toContain("/recording.aac");
        if (mode !== "sv") expect(value.html).toContain("<audio");
        else expect(value.markdown).toContain("[recording.AAC](/recording.aac)");
    });
});
