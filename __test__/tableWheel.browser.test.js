const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("overflow table wheel scrolling", () => {
    let browser;
    let page;
    const value = "| " + Array.from({length: 10}, (_, i) => `long_column_${i}`).join(" | ") + " |\n| " +
        Array.from({length: 10}, () => "---").join(" | ") + " |\n";
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    for (const mode of ["wysiwyg", "ir", "sv"]) {
        it.each([false, true])(`${mode}: handles overflow and boundary with RTL=%s`, async rtl => {
            await newEditor(page, {mode, value, rtl, width: 500, height: 300});
            if (mode === "sv") {
                await page.waitForFunction(() => window.testEditor.vditor.preview.previewElement.querySelector("table"));
            }
            const result = await page.evaluate((mode, rtl) => {
                const v = window.testEditor.vditor;
                const table = (mode === "sv" ? v.preview.previewElement : v[mode].element).querySelector("table");
                const send = (deltaY, options = {}) => {
                    const event = new WheelEvent("wheel", {deltaY, ...options, bubbles: true, cancelable: true});
                    table.querySelector("th").dispatchEvent(event);
                    return {prevented: event.defaultPrevented, left: table.scrollLeft};
                };
                const forward = send(80);
                const back = send(-80);
                const beyondStart = send(-80);
                const line = send(2, {deltaMode: 1});
                const horizontal = send(80, {deltaX: 20});
                const zoom = send(80, {ctrlKey: true});
                const shift = send(80, {shiftKey: true});
                table.scrollLeft = rtl ? -table.scrollWidth : table.scrollWidth;
                const end = send(80);
                return {forward, back, beyondStart, line, horizontal, zoom, shift, end,
                    overflow: table.scrollWidth > table.clientWidth};
            }, mode, rtl);
            expect(result.overflow).toBe(true);
            expect(result.forward).toEqual({prevented: true, left: rtl ? -80 : 80});
            expect(result.back).toEqual({prevented: true, left: 0});
            expect(result.beyondStart.prevented).toBe(false);
            expect(result.line.prevented).toBe(true);
            expect(Math.abs(result.line.left)).toBeGreaterThan(2);
            for (const item of [result.horizontal, result.zoom, result.shift, result.end]) {
                expect(item.prevented).toBe(false);
            }
        });
    }

    it("scrolls with a real mouse wheel while keeping the editor's vertical position", async () => {
        await newEditor(page, {mode: "wysiwyg", value: value + "\n\n" + "paragraph\n\n".repeat(40),
            width: 500, height: 300});
        const table = (await page.evaluateHandle(() => window.testEditor.vditor.wysiwyg.element.querySelector("table"))).asElement();
        await table.evaluate(element => element.scrollIntoView({block: "center"}));
        const rect = await table.boundingBox();
        const before = await page.evaluate(() => window.testEditor.vditor.wysiwyg.element.scrollTop);
        await page.mouse.move(rect.x + 30, rect.y + 15);
        await page.mouse.wheel({deltaY: 80});
        await page.waitForFunction(() => window.testEditor.vditor.wysiwyg.element.querySelector("table").scrollLeft > 0);
        expect(await page.evaluate(() => window.testEditor.vditor.wysiwyg.element.scrollTop)).toBe(before);
    });

    it("supports static preview rerenders without duplicate handlers and ignores fitting tables", async () => {
        const result = await page.evaluate(async value => {
            const root = document.createElement("div"); root.style.width = "300px"; document.body.appendChild(root);
            const options = {icon: "", i18n: window.VditorI18n, cdn: location.origin,
                theme: {current: ""}, hljs: {enable: false}};
            await window.vditorTest.constructor.preview(root, value, options);
            await window.vditorTest.constructor.preview(root, value, options);
            const table = root.querySelector("table");
            table.dispatchEvent(new WheelEvent("wheel", {deltaY: 40, bubbles: true, cancelable: true}));
            const left = table.scrollLeft;
            await window.vditorTest.constructor.preview(root, "| a |\n| --- |\n", options);
            const event = new WheelEvent("wheel", {deltaY: 40, bubbles: true, cancelable: true});
            root.querySelector("table").dispatchEvent(event);
            const fitting = event.defaultPrevented;
            root.remove(); return {left, fitting};
        }, value);
        expect(result).toEqual({left: 40, fitting: false});
    });
});
