const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("IR inline style toolbar", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditor?.vditor?.lute);
        await page.evaluate(() => {
            const vditor = window.vditor.vditor;
            if (vditor.currentMode !== "ir") {
                const isMac = navigator.platform.toUpperCase().includes("MAC");
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit8",
                    ctrlKey: !isMac,
                    key: "8",
                    metaKey: isMac,
                }));
            }
        });
    });

    [
        {command: "bold", selector: "[data-type='strong']"},
        {command: "italic", selector: "[data-type='em']"},
    ].forEach(({command, selector}) => {
        it(`toggles ${command} off without selecting the text again`, async () => {
            const selectionPosition = await page.evaluate(() => {
                const vditor = window.vditor.vditor;
                window.vditor.setValue("测试文本");
                const textNode = vditor.ir.element.querySelector("p").firstChild;
                const startRange = document.createRange();
                startRange.setStart(textNode, 0);
                startRange.setEnd(textNode, 1);
                const startRect = startRange.getBoundingClientRect();
                const endRange = document.createRange();
                endRange.setStart(textNode, 1);
                endRange.setEnd(textNode, 2);
                const endRect = endRange.getBoundingClientRect();
                return {
                    endX: endRect.right - 1,
                    startX: startRect.left + 1,
                    y: startRect.top + startRect.height / 2,
                };
            });
            await page.mouse.move(selectionPosition.startX, selectionPosition.y);
            await page.mouse.down();
            await page.mouse.move(selectionPosition.endX, selectionPosition.y);
            await page.mouse.up();
            expect(await page.evaluate(() => getSelection().toString())).toBe("测试");

            const position = await page.$eval(`[data-type="${command}"]`, (element) => {
                const rect = element.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
            });
            await page.mouse.click(position.x, position.y);
            await page.waitForFunction((formatSelector, commandName) => {
                const editor = window.vditor.vditor.ir.element;
                const button = document.querySelector(`[data-type="${commandName}"]`);
                return editor.querySelectorAll(formatSelector).length === 1 &&
                    button.classList.contains("vditor-menu--current");
            }, {}, selector, command);
            expect(await page.evaluate(() => getSelection().toString())).toBe("测试");

            await page.mouse.click(position.x, position.y);
            const result = await page.evaluate((formatSelector) => {
                const editor = window.vditor.vditor.ir.element;
                return {
                    formattedCount: editor.querySelectorAll(formatSelector).length,
                    selection: getSelection().toString(),
                    value: window.vditor.getValue(),
                };
            }, selector);
            expect(result).toEqual({
                formattedCount: 0,
                selection: "测试",
                value: "测试文本\n",
            });
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });
});
