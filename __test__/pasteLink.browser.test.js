const {launchBrowser} = require("./util/launchBrowser");

describe.each(["desktop", "mobile"])("URL clipboard paste on %s", platform => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        if (platform === "mobile") {
            await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
            await page.setUserAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36");
        }
        const origin = process.env.VDITOR_TEST_ORIGIN || "http://localhost:9000";
        await page.goto(origin + "/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
    });

    afterAll(async () => { await browser?.close(); });

    const paste = (mode, url, initial = "", start = 0, end = start) =>
        page.evaluate(async ({mode, url, initial, start, end}) => {
            if (window.pasteLinkEditor) {
                const root = window.pasteLinkEditor.vditor.element;
                window.pasteLinkEditor.destroy();
                root.remove();
            }
            const root = document.createElement("div");
            document.body.appendChild(root);
            const editor = await new Promise(resolve => {
                const instance = new window.vditorTest.constructor(root, {
                    mode, value: initial, cache: {enable: false}, i18n: window.VditorI18n,
                    icon: "", _lutePath: "/js/lute/lute.min.js", undoDelay: 0,
                    preview: {delay: 0, hljs: {enable: false}, markdown: {gfmAutoLink: false}},
                    after: () => resolve(instance),
                });
            });
            window.pasteLinkEditor = editor;
            const surface = editor.vditor[mode].element;
            surface.focus();
            if (mode === "sv") {
                surface.setSelectionRange(start, end);
            } else {
                const range = document.createRange();
                if (end > start) {
                    range.selectNodeContents(surface.querySelector("p") || surface);
                } else {
                    range.selectNodeContents(surface);
                    range.collapse(true);
                }
                getSelection().removeAllRanges();
                getSelection().addRange(range);
            }
            editor.clearStack();
            const clipboardData = new DataTransfer();
            clipboardData.setData("text/plain", url);
            surface.dispatchEvent(new ClipboardEvent("paste", {bubbles: true, cancelable: true, clipboardData}));
            await new Promise(resolve => setTimeout(resolve, 100));
            const value = editor.getValue();
            const container = document.createElement("div");
            container.innerHTML = editor.getHTML();
            const link = container.querySelector("a");
            return {value, href: link?.getAttribute("href"), label: link?.textContent,
                text: container.textContent, roundTrip: editor.vditor.lute.Md2HTML(value)};
        }, {mode, url, initial, start, end});

    for (const mode of ["sv", "ir", "wysiwyg"]) {
        it.each([
            "https://example.com", "https://example.com/a)b", "https://example.com/a(b",
            "https://example.com/a]b", "https://example.com/a[b", "https://example.com/?q=**bold**",
            "https://example.com/?q=&amp;", "https://example.com/?q=\\abc",
            "https://example.com/?q=:smile:", "https://example.com/?a=1&b=2",
        ])(`uses the complete URL as link text in ${mode}: %s`, async url => {
            const result = await paste(mode, url);
            expect(result.label).toBe(url);
            expect(result.text.trim()).toBe(url);
            expect(decodeURI(result.href)).toBe(url);
            expect(result.roundTrip).toContain("<a href=");
            expect(result.roundTrip).toContain(result.href.replace(/&/g, "&amp;"));
        });

        it(`uses the selected text literally in ${mode}`, async () => {
            const label = "a]b & plain *";
            const result = await paste(mode, "https://example.com/a)b", label, 0, label.length);
            expect(decodeURI(result.href)).toBe("https://example.com/a)b");
            expect(result.label).toBe(label);
        });

        it(`keeps ordinary Markdown paste in ${mode}`, async () => {
            const result = await paste(mode, "before **bold** after");
            expect(result.href).toBeUndefined();
            expect(result.roundTrip).toContain("before <strong>bold</strong> after");
        });

        it(`undoes and redoes a pasted link in ${mode}`, async () => {
            await paste(mode, "https://example.com/a)b");
            const result = await page.evaluate(() => {
                const editor = window.pasteLinkEditor;
                const pasted = editor.getValue();
                editor.vditor.undo.undo(editor.vditor);
                const undone = editor.getValue();
                editor.vditor.undo.redo(editor.vditor);
                return {pasted, undone, redone: editor.getValue()};
            });
            expect(result.undone.trim()).toBe("");
            expect(result.redone).toBe(result.pasted);
        });
    }

    it.each([
        ["[label]()", 8], ["![alt]()", 7], ["[label](old)", 8],
        ["`value`", 3], ["```\n\n```", 4], ["    code", 6],
        ["[id]: \n", 6], ["$value$", 3], ["<span title=\"\"></span>", 13],
    ])("keeps a URL literal in source syntax: %s", async (initial, position) => {
        const url = "https://example.com";
        const result = await paste("sv", url, initial, position);
        expect(result.value.trimEnd()).toBe((initial.slice(0, position) + url + initial.slice(position)).trimEnd());
    });

    it("replaces a selected source destination with the URL", async () => {
        const result = await paste("sv", "https://example.com", "[label](old)", 8, 11);
        expect(result.value.trim()).toBe("[label](https://example.com)");
    });
});
