const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe.each(["desktop", "mobile"])("inline links on %s", (platform) => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        if (platform === "mobile") {
            await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
            await page.setUserAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36");
        }
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            window.vditorTest.vditor.options.undoDelay = 0;
            window.vditorTest.vditor.options.preview.url = "";
        });
    });

    afterAll(async () => {
        await browser?.close();
    });

    const switchMode = async (mode) => {
        await page.evaluate((mode) => {
            const editor = window.vditorTest;
            if (editor.getCurrentMode() === mode) {
                return;
            }
            const digit = {wysiwyg: "7", ir: "8", sv: "9"}[mode];
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            editor.vditor[editor.getCurrentMode()].element.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true, bubbles: true, code: `Digit${digit}`, ctrlKey: !isMac, key: digit, metaKey: isMac,
            }));
        }, mode);
        await page.waitForFunction((mode) => window.vditorTest.getCurrentMode() === mode, {}, mode);
    };

    it.each(["sv", "ir", "wysiwyg"])("preserves empty labels and spaced destinations in %s", async (mode) => {
        await switchMode(mode);
        for (const markdown of ['[](<url> "title")', '[](<url 1> "title")',
            '[text](<url 1> "title")', '[text](url%201 "title")']) {
            const result = await page.evaluate((markdown) => {
                const editor = window.vditorTest;
                editor.setValue(markdown, true);
                const standard = Lute.New();
                const value = editor.getValue();
                return {html: editor.getHTML(), expected: standard.Md2HTML(markdown),
                    roundTrip: standard.Md2HTML(value)};
            }, markdown);
            expect(result.html).toBe(result.expected);
            expect(result.roundTrip).toBe(result.expected);
        }
    });

    it("preserves link metadata through mode switches", async () => {
        const markdown = 'before [](<url 1> "title") after';
        await page.evaluate((markdown) => window.vditorTest.setValue(markdown, true), markdown);
        for (const mode of ["sv", "wysiwyg", "ir", "sv", "ir", "wysiwyg"]) {
            await switchMode(mode);
            const result = await page.evaluate((markdown) => ({
                html: window.vditorTest.getHTML(), expected: Lute.New().Md2HTML(markdown),
            }), markdown);
            expect(result.html).toBe(result.expected);
        }
    });

    it.each(["ir", "wysiwyg"])("restores link metadata when undoing a deleted label in %s", async (mode) => {
        await switchMode(mode);
        await page.evaluate((mode) => {
            const editor = window.vditorTest;
            editor.setValue('[text](<url 1> "title")', true);
            const surface = editor.vditor[mode].element;
            const label = surface.querySelector(mode === "ir" ? ".vditor-ir__link" : "a");
            surface.focus();
            const range = document.createRange();
            range.setStart(label.firstChild, 0);
            range.setEnd(label.firstChild, label.firstChild.length);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
        }, mode);
        await page.keyboard.press("Backspace");
        await page.waitForFunction((mode) => window.vditorTest.getValue().trim() ===
            (mode === "ir" ? '[](url%201 "title")' : ""), {}, mode);
        const values = await page.evaluate(() => {
            const editor = window.vditorTest;
            const empty = editor.getHTML();
            editor.vditor.undo.undo(editor.vditor);
            const restored = editor.getHTML();
            editor.vditor.undo.redo(editor.vditor);
            return {empty, restored, redone: editor.getHTML()};
        });
        expect(values.empty).toBe(mode === "ir" ? '<p><a href="url%201" title="title"></a></p>\n' : "");
        expect(values.restored).toBe('<p><a href="url%201" title="title">text</a></p>\n');
        expect(values.redone).toBe(values.empty);
    });

    it.each(["sv", "ir", "wysiwyg"])("pastes Markdown with empty labels and spaced destinations in %s", async (mode) => {
        await switchMode(mode);
        const markdown = 'before [](<url 1> "title") and [text](<url 2> "title") after';
        await page.evaluate(({mode, markdown}) => {
            const editor = window.vditorTest;
            editor.setValue("", true);
            const surface = editor.vditor[mode].element;
            surface.focus();
            if (mode === "sv") {
                surface.setSelectionRange(0, 0);
            } else {
                const range = document.createRange();
                range.selectNodeContents(surface);
                range.collapse(false);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
            }
            const clipboardData = new DataTransfer();
            clipboardData.setData("text/plain", markdown);
            surface.dispatchEvent(new ClipboardEvent("paste", {bubbles: true, cancelable: true, clipboardData}));
        }, {mode, markdown});
        await page.waitForFunction((markdown) => window.vditorTest.getHTML() === Lute.New().Md2HTML(markdown), {}, markdown);
        const result = await page.evaluate(() => Lute.New().Md2HTML(window.vditorTest.getValue()));
        expect(result).toBe('<p>before <a href="url%201" title="title"></a> and <a href="url%202" title="title">text</a> after</p>\n');
    });

    it("copies a paragraph containing an empty link as Markdown", async () => {
        await switchMode("wysiwyg");
        const result = await page.evaluate(() => {
            const editor = window.vditorTest;
            const markdown = 'before [](<url 1> "title") after';
            editor.setValue(markdown, true);
            const surface = editor.vditor.wysiwyg.element;
            surface.focus();
            const range = document.createRange();
            range.selectNodeContents(surface);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            const clipboardData = new DataTransfer();
            surface.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, cancelable: true, clipboardData}));
            return {actual: Lute.New().Md2HTML(clipboardData.getData("text/plain")), expected: Lute.New().Md2HTML(markdown)};
        });
        expect(result.actual).toBe(result.expected);
    });
});
