import {launchBrowser, useLocalVditorAssets} from "../util/launchBrowser";

declare let vditorTest: any;
declare let setVditorSelection: (start: number, end: number) => void;

describe("use puppeteer to test methods", () => {
    let browser: any;
    let page: any;
    const defaultValue = `下一代的 Markdown 编辑器，为未来而构建
[Vditor](https://github.com/Vanessa219/vditor) 是一款浏览器端的 Markdown 编辑器，使用 TypeScript 实现。`;
    const insertValue = "于是，Vditor 就这样诞生了。";
    const updateValue = "* [Vditor 使用指南](https://ld246.com/article/1549638745630?r=Vanessa)";

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => typeof vditorTest !== "undefined" && vditorTest.vditor?.lute);
        await page.evaluate(() => {
            (window as any).setVditorSelection = (start: number, end: number) => {
                const editorElement = vditorTest.vditor[vditorTest.vditor.currentMode].element;
                const walker = document.createTreeWalker(editorElement, NodeFilter.SHOW_TEXT);
                let currentOffset = 0;
                let startContainer: Node;
                let startOffset = 0;
                let endContainer: Node;
                let endOffset = 0;
                let node = walker.nextNode();
                while (node) {
                    const nextOffset = currentOffset + node.textContent.length;
                    if (!startContainer && start <= nextOffset) {
                        startContainer = node;
                        startOffset = Math.max(0, start - currentOffset);
                    }
                    if (end <= nextOffset) {
                        endContainer = node;
                        endOffset = Math.max(0, end - currentOffset);
                        break;
                    }
                    currentOffset = nextOffset;
                    node = walker.nextNode();
                }
                const range = document.createRange();
                if (!startContainer) {
                    range.selectNodeContents(editorElement);
                    range.collapse(false);
                } else {
                    range.setStart(startContainer, startOffset);
                    if (endContainer) {
                        range.setEnd(endContainer, endOffset);
                    } else {
                        range.setEndAfter(editorElement.lastChild);
                    }
                }
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            };
        });
    });

    it("method: getValue", async () => {
        const result = await page.evaluate(() => {
            vditorTest.setValue(`下一代的 Markdown 编辑器，为未来而构建
[Vditor](https://github.com/Vanessa219/vditor) 是一款浏览器端的 Markdown 编辑器，使用 TypeScript 实现。`);
            return vditorTest.getValue();
        });
        expect(result).toBe(defaultValue + "\n");
    });

    it("method: insertValue", async () => {
        const result = await page.evaluate(() => {
            setVditorSelection(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            vditorTest.insertValue("于是，Vditor 就这样诞生了。");
            return vditorTest.getValue();
        });
        expect(result).toBe(defaultValue + "\n\n" + insertValue + "\n");
    });

    it("method: focus", async () => {
        const result = await page.evaluate(() => {
            vditorTest.focus();
            return document.activeElement === vditorTest.vditor[vditorTest.vditor.currentMode].element;
        });
        expect(result).toBeTruthy();
    });

    it("method: blur", async () => {
        const result = await page.evaluate(() => {
            vditorTest.blur();
            return document.activeElement === vditorTest.vditor[vditorTest.vditor.currentMode].element;
        });
        expect(result).toBeFalsy();
    });

    it("method: disabled", async () => {
        const result = await page.evaluate(() => {
            vditorTest.disabled();
            return vditorTest.vditor[vditorTest.vditor.currentMode].element.getAttribute("contenteditable");
        });
        expect(result).toBe("false");
    });

    it("method: enable", async () => {
        const result = await page.evaluate(() => {
            vditorTest.enable();
            return vditorTest.vditor[vditorTest.vditor.currentMode].element.getAttribute("contenteditable");
        });
        expect(result).toBeTruthy();
    });

    it("method: setSelection and getSelection", async () => {
        const result = await page.evaluate(() => {
            setVditorSelection(25, 66);
            return vditorTest.getSelection();
        });
        expect(result).toBe("Vditor");
    });

    it("method: setValue", async () => {
        const result = await page.evaluate(() => {
            vditorTest.setValue("于是，Vditor 就这样诞生了。");
            return vditorTest.getValue();
        });
        expect(result).toBe(insertValue + "\n");
    });

    it("method: deleteValue and disabledCache", async () => {
        const result = await page.evaluate(() => {
            vditorTest.disabledCache();
            setVditorSelection(0, 3);
            vditorTest.deleteValue();
            return {
                cache: localStorage.getItem("vditorvditorTest"),
                cacheEnabled: vditorTest.vditor.options.cache.enable,
                value: vditorTest.getValue(),
            };
        });
        expect(result.value).toBe("Vditor 就这样诞生了。\n");
        expect(result.cache).toBeNull();
        expect(result.cacheEnabled).toBe(false);
    });

    it("method: deleteValue null", async () => {
        const result = await page.evaluate(() => {
            vditorTest.deleteValue();
            return vditorTest.getValue();
        });
        expect(result).toBe("Vditor 就这样诞生了。\n");
    });

    it("method: updateValue and enableCache", async () => {
        const result = await page.evaluate(() => {
            vditorTest.enableCache();
            setVditorSelection(0, 14);
            vditorTest.updateValue("* [Vditor 使用指南](https://ld246.com/article/1549638745630?r=Vanessa)");
            return {
                value: vditorTest.getValue(),
                cache: localStorage.getItem("vditorvditorTest"),
                cacheEnabled: vditorTest.vditor.options.cache.enable,
            };
        });
        expect(result.value).toBe(updateValue + "\n");
        expect(result.cache).toBeNull();
        expect(result.cacheEnabled).toBe(true);
    });

    it("method: clearCache", async () => {
        const result = await page.evaluate(() => {
            vditorTest.clearCache();
            return localStorage.getItem("vditorvditorTest");
        });
        expect(result).toBeNull();
    });

    it("method: html2md", async () => {
        const result = await page.evaluate(() => {
            return vditorTest.html2md('<a href="https://ld246.com/tag/vditor">讨论区</a>');
        });
        expect(result.trimEnd()).toBe("[讨论区](https://ld246.com/tag/vditor)");
    });

    it("method: isUploading false", async () => {
        const result = await page.evaluate(() => {
            return vditorTest.isUploading();
        });
        expect(result).toBeFalsy();
    });

    it("method: isUploading true", async () => {
        // TODO
    });

    it("method: renderPreview", async () => {
        // TODO
    });

    afterAll(async () => {
        await browser.close();
    });
});
