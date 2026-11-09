const {launchBrowser, useLocalVditorAssets} = require("./util/launchBrowser");

describe("Markdown clipboard paste", () => {
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
        it(`pastes formulas and Markdown with HTML without an outer code block in ${mode}`, async () => {
            for (const fixture of [
                {text: "设 $2(z+\\bar{z})+3(z-\\bar{z})=4+6i$ , 则 $z=(\\quad)$ .", metadata: "",
                    html: '<pre style="white-space: pre-wrap">formula</pre>'},
                {text: "```python\nprint(1)\n```\n\n<div>\n<table><tr><td>value</td></tr></table>\n</div>",
                    metadata: '{"mode":"markdown"}', html: '<div style="font-family:monospace">clipboard</div>'},
            ]) {
                const value = await page.evaluate(async ({mode, fixture}) => {
                    window.pasteEditor?.destroy();
                    document.querySelector("#paste-editor")?.remove();
                    const element = document.createElement("div");
                    element.id = "paste-editor";
                    document.body.appendChild(element);
                    const editor = await new Promise(resolve => {
                        const instance = new window.vditorTest.constructor(element, {
                            mode, cache: {enable: false}, i18n: window.VditorI18n, icon: "",
                            _lutePath: "/js/lute/lute.min.js", value: "", after: () => resolve(instance),
                        });
                    });
                    window.pasteEditor = editor;
                    const editable = editor.vditor[mode].element;
                    editable.focus();
                    if (mode !== "sv") {
                        const range = document.createRange();
                        range.selectNodeContents(editable.firstElementChild || editable);
                        range.collapse(true);
                        getSelection().removeAllRanges();
                        getSelection().addRange(range);
                    }
                    const data = new DataTransfer();
                    data.setData("text/plain", fixture.text);
                    data.setData("text/html", fixture.html);
                    if (fixture.metadata) data.setData("vscode-editor-data", fixture.metadata);
                    editable.dispatchEvent(new ClipboardEvent("paste", {clipboardData: data, bubbles: true}));
                    await new Promise(resolve => setTimeout(resolve, 250));
                    return editor.getValue();
                }, {mode, fixture});
                if (fixture.metadata) {
                    expect(value).toContain("```python\nprint(1)\n```");
                    expect(value).toContain("value");
                    expect(value).not.toMatch(/^```\n/);
                } else {
                    expect(value.trim()).toBe(fixture.text);
                    expect(value).not.toContain("```");
                }
            }
        });
    }
});
