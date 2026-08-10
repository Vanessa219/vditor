const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("WYSIWYG headings in lists", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
            const url = request.url();
            const distMarker = "/dist/";
            if (url.includes("cdn.jsdelivr.net/npm/vditor") && url.includes(distMarker)) {
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

    it("keeps an ordered list valid after repeatedly setting and removing a heading", async () => {
        const result = await page.evaluate(() => {
            const editor = window.vditorTest.vditor.wysiwyg.element;
            window.vditorTest.setValue("1. first\n2. second");

            const firstItem = editor.querySelector("li");
            const walker = document.createTreeWalker(firstItem, NodeFilter.SHOW_TEXT);
            let textNode = walker.nextNode();
            while (textNode && textNode.textContent.trim() === "") {
                textNode = walker.nextNode();
            }
            const range = document.createRange();
            range.setStart(textNode, 1);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.focus();

            const toggleHeading = (level) => {
                editor.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: `Digit${level}`,
                    ctrlKey: true,
                    key: level.toString(),
                }));
            };

            let headingMarkdown = "";
            const headingLevelsValid = [];
            for (let i = 0; i < 12; i++) {
                const level = i % 6 + 1;
                toggleHeading(level);
                headingMarkdown = window.vditorTest.getValue();
                headingLevelsValid.push(editor.querySelector(`ol > li:first-child > h${level}`) !== null);
                toggleHeading(level);
            }

            return {
                headingLevelsValid,
                headingMarkdown,
                html: editor.innerHTML,
                invalidHeading: editor.querySelector("h1 > li, h1 > ol, h1 > ul") !== null,
                invalidListItem: Array.from(editor.children).some((item) => item.tagName === "LI"),
                value: window.vditorTest.getValue(),
            };
        });

        expect(result.headingMarkdown).toBe("1. ###### first\n2. second\n");
        expect(result.headingLevelsValid.every(Boolean)).toBeTruthy();
        expect(result.value).toBe("1. first\n2. second\n");
        expect(result.invalidHeading).toBeFalsy();
        expect(result.invalidListItem).toBeFalsy();
        expect(result.html).not.toContain("<p data-block=\"0\"></p>");
    });

    it("preserves task and nested list structures", async () => {
        const result = await page.evaluate(() => {
            const vditorTest = window.vditorTest;
            const editor = vditorTest.vditor.wysiwyg.element;

            const setFirstItemHeading = (markdown) => {
                vditorTest.setValue(markdown);
                const firstItem = editor.querySelector("li");
                const walker = document.createTreeWalker(firstItem, NodeFilter.SHOW_TEXT);
                let textNode = walker.nextNode();
                while (textNode && textNode.textContent.trim() === "") {
                    textNode = walker.nextNode();
                }
                const range = document.createRange();
                range.setStart(textNode, Math.min(1, textNode.textContent.length));
                range.collapse(true);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                editor.focus();
                editor.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit1",
                    ctrlKey: true,
                    key: "1",
                }));
                return {
                    html: editor.innerHTML,
                    invalidHeading: editor.querySelector("h1 > ol, h1 > ul") !== null,
                    value: vditorTest.getValue(),
                };
            };

            const task = setFirstItemHeading("- [ ] task");
            editor.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true,
                bubbles: true,
                code: "Digit1",
                ctrlKey: true,
                key: "1",
            }));
            task.canceledValue = vditorTest.getValue();
            const nested = setFirstItemHeading("1. first\n   * nested");
            setFirstItemHeading("1. first\n\n   second");
            editor.dispatchEvent(new KeyboardEvent("keydown", {
                altKey: true,
                bubbles: true,
                code: "Digit1",
                ctrlKey: true,
                key: "1",
            }));
            const loose = {
                firstBlock: editor.querySelector("li")?.firstElementChild?.tagName,
                value: vditorTest.getValue(),
            };
            return {loose, nested, task};
        });

        expect(result.task.value).toBe("- [ ] # task\n");
        expect(result.task.canceledValue).toBe("- [ ] task\n");
        expect(result.task.html).toContain("<input type=\"checkbox\"> <h1");
        expect(result.nested.value).toBe("1. # first\n\n   * nested\n");
        expect(result.nested.html).toMatch(/<h1[^>]*>first<\/h1><ul/);
        expect(result.nested.invalidHeading).toBeFalsy();
        expect(result.loose.value).toBe("1. first\n\n   second\n");
        expect(result.loose.firstBlock).toBe("P");
    });

    afterAll(async () => {
        await browser.close();
    });
});
