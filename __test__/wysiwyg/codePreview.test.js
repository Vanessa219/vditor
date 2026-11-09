const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

describe.each([
    ["classic", 1024], ["dark", 1024], ["classic", 375], ["dark", 375],
])("WYSIWYG code preview (%s, %ipx)", (theme, width) => {
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
                altKey: true, bubbles: true, code: "Digit7", ctrlKey: true, key: "7",
            }));
            vditor.options.height = 600;
            vditor.wysiwyg.element.style.height = "600px";
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
        await page.waitForSelector('.vditor-wysiwyg__preview[data-render="1"]');
    };

    const waitCollapsed = () => page.waitForFunction(() =>
        getComputedStyle(document.querySelector('.vditor-wysiwyg__block > pre')).display === "none");

    const state = () => page.evaluate(() => {
        const editor = window.vditorTest.vditor.wysiwyg.element;
        const block = editor.querySelector('[data-type="code-block"]');
        const preview = block.querySelector(".vditor-wysiwyg__preview");
        return {
            expanded: getComputedStyle(block.firstElementChild).display !== "none",
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
        await page.click(".vditor-wysiwyg__preview");
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.vditor-wysiwyg__block[data-type="code-block"] > pre')).display !== "none");
        expect(await state()).toMatchObject({expanded: true, visible: false, height: 0});
        await page.keyboard.type("X");
        expect((await state()).markdown).toContain("Xconst value");
        await page.click(".vditor-wysiwyg .vditor-reset > p:last-child");
        await waitCollapsed();
        expect(await state()).toMatchObject({expanded: false, visible: true});
        await page.click(".vditor-wysiwyg__preview");
        expect(await state()).toMatchObject({expanded: true, visible: false, height: 0});
    });

    it("keeps custom render previews visible and clears the ordinary marker after language changes", async () => {
        await setValue("custom", "value", true);
        await page.click(".vditor-wysiwyg__preview");
        expect(await state()).toMatchObject({expanded: true, ordinary: false, visible: true});
        await setValue("javascript");
        await page.click(".vditor-wysiwyg__preview");
        expect(await state()).toMatchObject({ordinary: true, visible: false});
    });

    it("keeps line number measurements usable while a wrapped preview is collapsed", async () => {
        await page.addStyleTag({content: ".vditor-wysiwyg .vditor-wysiwyg__preview code { white-space: pre-wrap !important; }"});
        await setValue("javascript", "const veryLongLine = '" + "word ".repeat(60) + "';");
        await page.click(".vditor-wysiwyg__preview");
        await page.keyboard.type("X");
        expect(await page.$eval(".vditor-wysiwyg__preview code", el => getComputedStyle(el).whiteSpace)).toBe("pre-wrap");
        await page.waitForFunction(() => {
            const rows = document.querySelectorAll(".vditor-wysiwyg__preview .vditor-linenumber__rows > span");
            return rows.length && [...rows].every(row => parseFloat(row.style.height) > 0);
        });
        expect(await state()).toMatchObject({visible: false, height: 0});
        await page.click(".vditor-wysiwyg .vditor-reset > p:last-child");
        await waitCollapsed();
        const heights = await page.$$eval(".vditor-wysiwyg__preview .vditor-linenumber__rows > span",
            rows => rows.map(row => row.getBoundingClientRect().height));
        expect(heights.length).toBeGreaterThan(0);
        expect(heights.every(height => height > 0)).toBe(true);
    });
    const editLanguage = async language => {
        // The 200ms toolbar rebuild replaces the previous block's language input.
        await new Promise(resolve => setTimeout(resolve, 250));
        await page.waitForSelector(".vditor-wysiwyg .vditor-input");
        await page.$eval('.vditor-wysiwyg .vditor-input', el => {
            el.focus();
            el.select();
        });
        await page.keyboard.type(language);
        await page.keyboard.press("Escape");
    };

    it("restores the preview when leaving code with arrow keys", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-wysiwyg__preview");
        await page.keyboard.press("End");
        for (let i = 0; i < 8 && (await state()).expanded; i++) {
            await page.keyboard.press("ArrowDown");
        }
        await waitCollapsed();
        expect(await state()).toMatchObject({expanded: false, visible: true, markdown: original});
    });

    it("updates the same code block from ordinary to math and back through language editing", async () => {
        await setValue("javascript", "x+1");
        await page.click(".vditor-wysiwyg__preview");
        await editLanguage("math");
        await page.waitForSelector('.vditor-wysiwyg__preview .katex');
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
        await page.click(".vditor-wysiwyg__preview");
        await editLanguage("custom");
        expect(await state()).toMatchObject({expanded: true, ordinary: false, visible: true});
        expect(await page.$eval(".vditor-wysiwyg__preview", el => el.dataset.customRendered)).toBe("yes");
        await editLanguage("javascript");
        expect(await state()).toMatchObject({expanded: true, ordinary: true, visible: false});
    });

    it("undoes typed code without leaving duplicate visible previews", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-wysiwyg__preview");
        await new Promise(resolve => setTimeout(resolve, 900));
        await page.keyboard.type("X");
        expect((await state()).markdown).toContain("Xconst value");
        await new Promise(resolve => setTimeout(resolve, 900));
        await page.keyboard.down("Control");
        await page.keyboard.press("z");
        await page.keyboard.up("Control");
        expect(await state()).toMatchObject({markdown: original, expanded: true, visible: false, height: 0});
        await page.click(".vditor-wysiwyg .vditor-reset > p:last-child");
        await waitCollapsed();
        expect(await state()).toMatchObject({expanded: false, visible: true});
    });

    it("keeps cross-block shift-click selections and Markdown copy intact", async () => {
        await setValue();
        const original = (await state()).markdown;
        await page.click(".vditor-wysiwyg__preview");
        await page.click(".vditor-wysiwyg .vditor-reset > p:first-child");
        await page.keyboard.press("Home");
        await page.keyboard.down("Shift");
        await page.click(".vditor-wysiwyg .vditor-reset > p:last-child");
        await waitCollapsed();
        await page.keyboard.press("End");
        await page.keyboard.up("Shift");
        expect(await page.evaluate(() => getSelection().isCollapsed)).toBe(false);
        await waitCollapsed();
        expect(await state()).toMatchObject({expanded: false, visible: true, markdown: original});
        const copied = await page.evaluate(() => {
            const data = new DataTransfer();
            window.vditorTest.vditor.wysiwyg.element.dispatchEvent(new ClipboardEvent("copy", {bubbles: true, clipboardData: data}));
            return data.getData("text/plain");
        });
        expect(copied).toBe(original.trim());
    });

    it("handles both hidden-source style serializations and a newly visible source", async () => {
        await setValue();
        for (const style of ["display:none", "display: none;"]) {
            await page.$eval('.vditor-wysiwyg__block > pre', (el, value) => el.setAttribute("style", value), style);
            expect(await state()).toMatchObject({expanded: false, visible: true});
        }
        await page.$eval('.vditor-wysiwyg__block > pre', el => el.removeAttribute("style"));
        expect(await state()).toMatchObject({expanded: true, visible: false, height: 0});
        const layout = await page.evaluate(() => {
            const block = document.querySelector('.vditor-wysiwyg__block');
            return {sourceBottom: block.firstElementChild.getBoundingClientRect().bottom,
                nextTop: block.nextElementSibling.getBoundingClientRect().top};
        });
        expect(layout.nextTop).toBeGreaterThanOrEqual(layout.sourceBottom);
    });

    it("restores the preview when Escape exits source editing", async () => {
        await setValue();
        await page.click(".vditor-wysiwyg__preview");
        expect(await state()).toMatchObject({expanded: true, visible: false});
        await page.keyboard.press("Escape");
        expect(await state()).toMatchObject({expanded: false, visible: true});
    });

});
