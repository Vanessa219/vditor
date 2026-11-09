const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("editable link clicks", () => {
    let browser;
    let page;
    beforeAll(async () => ({browser, page} = await openEditorPage()));
    afterAll(async () => { await browser?.close(); });

    const prepare = async (mode, link, platform = "Win32") => {
        await page.evaluate(platform => Object.defineProperty(navigator, "platform", {
            configurable: true, value: platform,
        }), platform);
        await newEditor(page, {mode, link});
        await page.evaluate(() => {
            window.testEditor.vditor.element.id = "linkClickEditor";
            window.linkOpens = [];
            window.linkCallbacks = [];
            window.open = url => { window.linkOpens.push(url); };
            window.testEditor.setValue("before [label](https://example.com) after");
        });
        return mode === "sv" ? "#linkClickEditor .vditor-preview a" :
            `#linkClickEditor .vditor-${mode} ${mode === "ir" ? ".vditor-ir__link" : "a"}`;
    };

    const modifiedClick = async (selector, key) => {
        await page.keyboard.down(key);
        try { await page.click(selector); } finally { await page.keyboard.up(key); }
    };

    for (const mode of ["ir", "wysiwyg"]) {
        it.each(["Win32", "MacIntel"])(`edits on click and follows on the platform modifier in ${mode} on %s`, async platform => {
            const selector = await prepare(mode, {ctrlClick: true}, platform);
            await page.click(selector);
            expect(await page.evaluate(() => window.linkOpens)).toEqual([]);
            expect(await page.evaluate(mode => window.testEditor.vditor[mode].element.contains(getSelection().anchorNode), mode)).toBe(true);
            if (mode === "ir") {
                await page.waitForFunction(() => document.querySelector("#linkClickEditor [data-type='a']")
                    .classList.contains("vditor-ir__node--expand"));
            } else {
                await page.waitForFunction(() => window.testEditor.vditor.wysiwyg.popover.querySelectorAll("input").length === 3);
            }
            await page.keyboard.type("X");
            await page.waitForFunction(() => window.testEditor.getValue().includes("X"));
            await modifiedClick(selector, platform === "MacIntel" ? "Control" : "Meta");
            expect(await page.evaluate(() => window.linkOpens)).toEqual([]);
            await modifiedClick(selector, platform === "MacIntel" ? "Meta" : "Control");
            expect(await page.evaluate(() => window.linkOpens)).toEqual(["https://example.com"]);
        });

        it(`keeps single-click opening by default in ${mode}`, async () => {
            const selector = await prepare(mode, {});
            await page.click(selector);
            expect(await page.evaluate(() => window.linkOpens)).toEqual(["https://example.com"]);
        });

        it(`honors isOpen and custom click callbacks in ${mode}`, async () => {
            const selector = await prepare(mode, {ctrlClick: true, isOpen: false});
            await modifiedClick(selector, "Control");
            expect(await page.evaluate(() => window.linkOpens)).toEqual([]);
            await page.evaluate(() => {
                window.testEditor.vditor.options.link.click = element => window.linkCallbacks.push(element.textContent);
            });
            await page.click(selector);
            expect(await page.evaluate(() => window.linkCallbacks)).toEqual([]);
            await modifiedClick(selector, "Control");
            expect(await page.evaluate(() => window.linkCallbacks)).toHaveLength(1);
            expect(await page.evaluate(() => window.linkOpens)).toEqual([]);
        });
    }

    it("keeps preview links clickable without modifiers", async () => {
        const selector = await prepare("sv", {ctrlClick: true});
        await page.waitForSelector(selector);
        await page.click(selector);
        expect(await page.evaluate(() => window.linkOpens)).toEqual(["https://example.com"]);
    });

    it.each(["ir", "wysiwyg"])("edits links on touch in %s", async mode => {
        await page.setViewport({width: 390, height: 844, isMobile: true, hasTouch: true});
        const selector = await prepare(mode, {ctrlClick: true});
        await page.tap(selector);
        expect(await page.evaluate(() => window.linkOpens)).toEqual([]);
        expect(await page.evaluate(mode => window.testEditor.vditor[mode].element.contains(getSelection().anchorNode), mode)).toBe(true);
    });
});
