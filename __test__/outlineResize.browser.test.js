const {openEditorPage, newEditor} = require("./util/editorHarness");

describe("outline width", () => {
    let browser;
    let page;
    beforeAll(async () => { ({browser, page} = await openEditorPage()); });
    afterAll(async () => { await browser?.close(); });
    for (const position of ["left", "right"]) {
        it.each(["classic", "dark"])(`${position}: drag, keyboard and width limits in %s`, async theme => {
            await page.setViewport({width: 1200, height: 800});
            await newEditor(page, {mode: "ir", theme, width: 600, height: 300,
                value: "# heading\n\ntext", outline: {enable: true, position, width: 200}});
            await page.evaluate(() => {
                window.outlineChanges = [];
                window.testEditor.vditor.options.configChange = value => window.outlineChanges.push(value);
            });
            const handle = (await page.evaluateHandle(() => window.testEditor.vditor.outline.resizeElement)).asElement();
            await handle.evaluate(element => element.scrollIntoView({block: "center"}));
            const rect = await handle.boundingBox();
            await page.mouse.move(rect.x + rect.width / 2, rect.y + 40);
            await page.mouse.down();
            await page.mouse.move(rect.x + rect.width / 2 + 50, rect.y + 40);
            await page.mouse.up();
            const dragged = await page.evaluate(() => ({width: window.testEditor.vditor.options.outline.width,
                calls: window.outlineChanges.map(value => value.outline.width)}));
            expect(dragged.width).toBe(position === "left" ? 250 : 150);
            expect(dragged.calls).toEqual([dragged.width]);
            await handle.focus();
            await page.keyboard.press("Home");
            expect(await page.evaluate(() => window.testEditor.vditor.options.outline.width)).toBe(120);
            await page.keyboard.press("End");
            expect(await page.evaluate(() => window.testEditor.vditor.options.outline.width)).toBe(458);
            const result = await page.evaluate(() => {
                const v = window.testEditor.vditor;
                const divider = v.outline.resizeElement;
                return {width: v.outline.element.clientWidth,
                    aria: divider.getAttribute("aria-valuenow"),
                    editorWidth: v.ir.element.parentElement.clientWidth,
                    changed: window.testEditor.getValue()};
            });
            expect(result.width).toBe(458);
            expect(result.aria).toBe("458");
            expect(result.editorWidth).toBeGreaterThanOrEqual(130);
            expect(result.changed).toBe("# heading\n\ntext\n");
        });
    }

    it("supports touch dragging on tablets", async () => {
        await page.setViewport({width: 1024, height: 800, hasTouch: true});
        await newEditor(page, {mode: "ir", width: 600, height: 300,
            outline: {enable: true, position: "left", width: 200}});
        const handle = (await page.evaluateHandle(() => window.testEditor.vditor.outline.resizeElement)).asElement();
        await handle.evaluate(element => element.scrollIntoView({block: "center"}));
        const rect = await handle.boundingBox();
        expect(rect.width).toBeGreaterThanOrEqual(16);
        const session = await page.createCDPSession();
        const x = rect.x + rect.width / 2;
        const y = rect.y + 30;
        await session.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x, y}]});
        await session.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x: x + 50, y}]});
        await session.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
        await session.detach();
        expect(await page.evaluate(() => window.testEditor.vditor.options.outline.width)).toBe(250);
    });

    it("keeps space for editing in a narrow host with large text", async () => {
        await page.setViewport({width: 1200, height: 800});
        await newEditor(page, {mode: "ir", width: 320, height: 300, value: "# heading\n\ntext",
            outline: {enable: true, position: "left", width: 500}});
        const result = await page.evaluate(() => {
            const v = window.testEditor.vditor;
            v.ir.element.style.fontSize = "32px";
            return {outline: v.outline.element.clientWidth, editor: v.ir.element.parentElement.clientWidth};
        });
        expect(result.outline).toBe(178);
        expect(result.editor).toBeGreaterThanOrEqual(130);
    });

    it("hides the divider with the outline on mobile", async () => {
        await page.setViewport({width: 393, height: 800, isMobile: true, hasTouch: true});
        await newEditor(page, {outline: {enable: true, position: "left", width: 200}});
        expect(await page.evaluate(() => getComputedStyle(window.testEditor.vditor.outline.resizeElement).display)).toBe("none");
    });
});
