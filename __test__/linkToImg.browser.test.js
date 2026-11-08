const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("external image transfer", () => {
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

    for (const mode of ["sv", "ir", "wysiwyg"]) {
        it.each(["custom", "builtin", "empty", "failure", "paths", "absolute-paths", "root-paths"])(`handles %s transfer in ${mode}`, async kind => {
            const result = await page.evaluate(async ({mode, kind}) => {
                const root = document.createElement("div");
                document.body.appendChild(root);
                const calls = [];
                const requests = [];
                const upload = {linkToImgUrl: "/transfer", linkToImgCallback: text => calls.push(JSON.parse(text)),
                    extraData: {owner: "test", url: "must-not-override", file: new Blob(["binary"])}};
                if (kind !== "builtin") upload.linkToImgHandler = async url => {
                    calls.push(url);
                    if (kind === "failure") throw new Error("transfer failed");
                    if (kind === "paths") return "images/uploaded.png";
                    if (kind === "absolute-paths") return "https://cdn.example.com/uploaded.png";
                    return kind === "empty" ? "" : "/uploaded.png";
                };
                const editor = await new Promise(resolve => {
                    const instance = new window.vditorTest.constructor(root, {
                        mode, icon: "", upload, cache: {enable: false}, i18n: window.VditorI18n,
                        _lutePath: "/js/lute/lute.min.js", after: () => resolve(instance),
                        preview: {markdown: kind.includes("paths") ? {linkBase: "/base", linkPrefix: "/prefix"} : {}},
                    });
                });
                const NativeXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = class {
                    static DONE = 4;
                    open() {}
                    setRequestHeader() {}
                    send(body) {
                        requests.push(JSON.parse(body));
                        this.status = 200; this.readyState = 4;
                        this.responseText = JSON.stringify({code: 0, data: {originalURL: JSON.parse(body).url, url: "/uploaded.png"}});
                        setTimeout(() => this.onreadystatechange(), 20);
                    }
                };
                try {
                    const editable = editor.vditor[mode].element;
                    editable.focus();
                    if (mode !== "sv") {
                        const range = document.createRange(); range.selectNodeContents(editable); range.collapse(true);
                        getSelection().removeAllRanges(); getSelection().addRange(range);
                    }
                    const data = new DataTransfer(); data.setData("text/plain", "![image](https://example.com/original.png)");
                    editable.dispatchEvent(new ClipboardEvent("paste", {bubbles: true, clipboardData: data}));
                    await new Promise(resolve => setTimeout(resolve, 120));
                    return {value: editor.getValue(), html: editor.getHTML(), tip: editor.vditor.tip.element.textContent, calls, requests};
                } finally {
                    window.XMLHttpRequest = NativeXHR;
                    editor.destroy(); root.remove();
                }
            }, {mode, kind});
            expect(result.calls).toHaveLength(1);
            expect(result.requests).toEqual(kind === "builtin" ? [{owner: "test", url: "https://example.com/original.png"}] : []);
            expect(result.value).toContain(kind === "empty" || kind === "failure" ? "https://example.com/original.png" : "/uploaded.png");
            if (kind === "failure") expect(result.tip).toContain("transfer failed");
            if (kind === "paths") {
                expect(result.value).toContain("images/uploaded.png");
                expect(result.html).toContain("/prefix/base/images/uploaded.png");
            }
            if (kind === "absolute-paths") expect(result.html).toContain("/prefixhttps://cdn.example.com/uploaded.png");
            if (kind === "root-paths") expect(result.html).toContain("/prefix/uploaded.png");
            expect(result.value).not.toContain("/prefix");
        });
    }
});
