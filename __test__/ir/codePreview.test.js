const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe.each([
    ["classic", 1024], ["dark", 1024], ["classic", 375], ["dark", 375],
])("IR code preview (%s, %ipx)", (theme, width) => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setViewport({width, height: 900});
        await useLocalVditorAssets(page);
        // The demo loads icons with synchronous XHR; rewrite before CORS is applied.
        await page.evaluateOnNewDocument(() => {
            const open = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                if (/https:\/\/(unpkg.com|cdn.jsdelivr.net)\/.*vditor.*\/dist\//.test(url)) {
                    url = "http://localhost:9000/" + url.split("/dist/")[1];
                }
                return open.call(this, method, url, ...rest);
            };
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(({theme, width}) => {
            window.vditorTest.setTheme(theme);
            window.vditorTest.vditor.element.style.width = `${Math.min(width - 16, 500)}px`;
            const vditor = window.vditorTest.vditor;
            vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true, bubbles: true, code: "Digit8", ctrlKey: true, key: "8",
            }));
            vditor.options.height = 600;
            vditor.ir.element.style.height = "600px";
        }, {theme, width});
    });

    afterAll(async () => {
        await browser?.close();
    });

    const setValue = async (language = "javascript", code = "const value = 1;", custom = false) => {
        await page.evaluate(({language, code, custom}) => {
            const api = window.vditorTest;
            api.vditor.options.customRenders = custom ? [{language, render: () => {}}] : [];
            api.setValue("before\n\n```" + language + "\n" + code + "\n```\n\nafter");
        }, {language, code, custom});
        await page.waitForSelector('.vditor-ir__preview[data-render="1"]');
    };

    const state = () => page.evaluate(() => {
        const editor = window.vditorTest.vditor.ir.element;
        const block = editor.querySelector('[data-type="code-block"]');
        const preview = block.querySelector(".vditor-ir__preview");
        return {
            expanded: block.classList.contains("vditor-ir__node--expand"),
            ordinary: preview.classList.contains("vditor-code__preview"),
            visible: getComputedStyle(preview).visibility !== "hidden",
            height: preview.getBoundingClientRect().height,
            markdown: window.vditorTest.getValue(),
        };
    });

    it("shows only the editable source after clicking ordinary code and restores preview on exit", async () => {
        await setValue();
        const initial = await state();
        expect(initial.ordinary).toBe(true);
        expect(initial.visible).toBe(true);
        await page.click(".vditor-ir__preview");
        await page.waitForFunction(() => document.querySelector('.vditor-ir__node--expand[data-type="code-block"]'));
        expect(await state()).toMatchObject({expanded: true, visible: false, height: 0});
        await page.keyboard.type("X");
        expect((await state()).markdown).toContain("Xconst value");
        await page.click(".vditor-ir .vditor-reset > p:last-child");
        expect(await state()).toMatchObject({expanded: false, visible: true});
        await page.click(".vditor-ir__preview");
        expect(await state()).toMatchObject({expanded: true, visible: false, height: 0});
    });

    it("keeps custom render previews visible and clears the ordinary marker after language changes", async () => {
        await setValue("custom", "value", true);
        await page.click(".vditor-ir__preview");
        expect(await state()).toMatchObject({expanded: true, ordinary: false, visible: true});
        await setValue("javascript");
        await page.click(".vditor-ir__preview");
        expect(await state()).toMatchObject({ordinary: true, visible: false});
    });

    it("keeps line number measurements usable while a wrapped preview is collapsed", async () => {
        await page.addStyleTag({content: ".vditor-ir .vditor-ir__preview code { white-space: pre-wrap !important; }"});
        await setValue("javascript", "const veryLongLine = '" + "word ".repeat(60) + "';");
        await page.click(".vditor-ir__preview");
        await page.keyboard.type("X");
        expect(await page.$eval(".vditor-ir__preview code", el => getComputedStyle(el).whiteSpace)).toBe("pre-wrap");
        await page.waitForFunction(() => {
            const rows = document.querySelectorAll(".vditor-ir__preview .vditor-linenumber__rows > span");
            return rows.length && [...rows].every(row => parseFloat(row.style.height) > 0);
        });
        expect(await state()).toMatchObject({visible: false, height: 0});
        await page.click(".vditor-ir .vditor-reset > p:last-child");
        const heights = await page.$$eval(".vditor-ir__preview .vditor-linenumber__rows > span",
            rows => rows.map(row => row.getBoundingClientRect().height));
        expect(heights.length).toBeGreaterThan(0);
        expect(heights.every(height => height > 0)).toBe(true);
    });
    const editLanguage = async language => {
        await page.$eval('[data-type="code-block-info"]', el => {
            const range = document.createRange();
            range.selectNodeContents(el);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            el.closest('[contenteditable]').focus();
        });
        await page.keyboard.type(language);
        await page.keyboard.press("Escape");
        await page.waitForFunction(language => {
            const info = document.querySelector('[data-type="code-block-info"]');
            return info.textContent.replace(/\u200b/g, "") === language;
        }, {}, language);
    };

    it("restores the preview when leaving code with arrow keys", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-ir__preview");
        await page.keyboard.press("End");
        for (let i = 0; i < 6 && (await state()).expanded; i++) {
            await page.keyboard.press("ArrowDown");
        }
        expect(await state()).toMatchObject({expanded: false, visible: true, markdown: original});
    });

    it("updates the same code block from ordinary to math and back through language editing", async () => {
        await setValue("javascript", "x+1");
        await page.click(".vditor-ir__preview");
        await editLanguage("math");
        await page.waitForSelector('.vditor-ir__preview .katex');
        expect(await state()).toMatchObject({expanded: true, ordinary: false, visible: true});
        await editLanguage("javascript");
        expect(await state()).toMatchObject({expanded: true, ordinary: true, visible: false, height: 0});
        expect((await state()).markdown).toContain("```javascript\nx+1");
    });

    it("updates the ordinary marker when changing to and from a custom renderer", async () => {
        await setValue("javascript", "value");
        await page.evaluate(() => {
            window.vditorTest.vditor.options.customRenders = [{language: "custom", render: el => {
                el.dataset.customRendered = "yes";
            }}];
        });
        await page.click(".vditor-ir__preview");
        await editLanguage("custom");
        expect(await state()).toMatchObject({expanded: true, ordinary: false, visible: true});
        expect(await page.$eval(".vditor-ir__preview", el => el.dataset.customRendered)).toBe("yes");
        await editLanguage("javascript");
        expect(await state()).toMatchObject({expanded: true, ordinary: true, visible: false});
    });

    it("undoes typed code without leaving duplicate visible previews", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-ir__preview");
        await new Promise(resolve => setTimeout(resolve, 900));
        await page.keyboard.type("X");
        expect((await state()).markdown).toContain("Xconst value");
        await new Promise(resolve => setTimeout(resolve, 900));
        await page.keyboard.down("Control");
        await page.keyboard.press("z");
        await page.keyboard.up("Control");
        expect(await state()).toMatchObject({markdown: original, expanded: true, visible: false, height: 0});
        await page.click(".vditor-ir .vditor-reset > p:last-child");
        expect(await state()).toMatchObject({expanded: false, visible: true});
    });

    it("keeps cross-block shift-click selections and Markdown copy intact", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-ir__preview");
        await page.click(".vditor-ir .vditor-reset > p:first-child");
        await page.keyboard.press("Home");
        await page.keyboard.down("Shift");
        await page.click(".vditor-ir .vditor-reset > p:last-child");
        await page.keyboard.press("End");
        await page.keyboard.up("Shift");
        expect(await page.evaluate(() => getSelection().isCollapsed)).toBe(false);
        expect(await state()).toMatchObject({expanded: false, visible: true, markdown: original});
        const copied = await page.evaluate(() => {
            const data = new DataTransfer();
            window.vditorTest.vditor.ir.element.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData: data}));
            return data.getData("text/plain");
        });
        expect(copied).toBe(original.trim());
    });

});
