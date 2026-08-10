const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("WYSIWYG callouts", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const url = request.url();
            const distMarker = "/dist/";
            if ((url.includes("unpkg.com/vditor") || url.includes("cdn.jsdelivr.net/npm/vditor")) &&
                url.includes(distMarker)) {
                const localPath = url.substring(url.indexOf(distMarker) + distMarker.length);
                request.continue({url: `http://localhost:9000/${localPath}`});
            } else {
                request.continue();
            }
        });
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => {
            const vditor = window.vditorTest.vditor;
            if (vditor.currentMode !== "wysiwyg") {
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit7",
                    ctrlKey: true,
                    key: "7",
                }));
            }
        });
    });

    it("keeps the callout marker hidden after editing the title and content", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.wysiwyg.element;
            vditorTest.setValue("> [!NOTE] ✏️ Note\n>\n> Note content");

            const appendText = (element, value) => {
                const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
                let textNode = walker.nextNode();
                while (walker.nextNode()) {
                    textNode = walker.currentNode;
                }
                textNode.textContent += value;
                const range = document.createRange();
                range.setStart(textNode, textNode.textContent.length);
                range.collapse(true);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                editor.dispatchEvent(new InputEvent("input", {
                    bubbles: true,
                    data: value,
                    inputType: "insertText",
                }));
            };

            appendText(editor.querySelector(".callout-info"), "12");
            appendText(editor.querySelector("blockquote.callout > p:last-child"), "34");

            const marker = editor.querySelector(".vditor-wysiwyg__callout-marker");
            return {
                calloutCount: editor.querySelectorAll("blockquote.callout").length,
                markerDisplay: getComputedStyle(marker).display,
                markerHTML: marker?.outerHTML,
                value: vditorTest.getValue(),
            };
        });

        expect(result.calloutCount).toBe(1);
        expect(result.markerDisplay).toBe("none");
        expect(result.markerHTML).toContain("[!NOTE]");
        expect(result.value).toContain("✏️ Note12");
        expect(result.value).toContain("Note content34");
    });

    afterAll(async () => {
        await browser.close();
    });
});
