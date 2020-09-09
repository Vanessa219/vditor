import puppeteer from "puppeteer";

declare let vditorTest: any;

describe("use puppeteer to test methods", () => {
    let browser: any;
    let page: any;
    const defaultValue = `下一代的 Markdown 编辑器，为未来而构建
[Vditor](https://github.com/Vanessa219/vditor) 是一款浏览器端的 Markdown 编辑器，使用 TypeScript 实现。`;
    const insertValue = "于是，Vditor 就这样诞生了。";
    const updateValue = "* [Vditor 使用指南](https://ld246.com/article/1549638745630?r=Vanessa)";

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage(),
        ]);
        await page.goto("http://localhost:9000");
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
            vditorTest.insertValue("于是，Vditor 就这样诞生了。");
            return vditorTest.getValue();
        });
        expect(result).toBe(defaultValue + insertValue + "\n");
    });

    it("method: focus", async () => {
        const result = await page.evaluate(() => {
            vditorTest.focus();
            return document.activeElement === vditorTest.vditor.editor.element;
        });
        expect(result).toBeTruthy();
    });

    it("method: blur", async () => {
        const result = await page.evaluate(() => {
            vditorTest.blur();
            return document.activeElement === vditorTest.vditor.editor.element;
        });
        expect(result).toBeFalsy();
    });

    it("method: disabled", async () => {
        const result = await page.evaluate(() => {
            vditorTest.disabled();
            return vditorTest.vditor.editor.element.getAttribute("contenteditable");
        });
        expect(result).toBe("false");
    });

    it("method: enable", async () => {
        const result = await page.evaluate(() => {
            vditorTest.enable();
            return vditorTest.vditor.editor.element.getAttribute("contenteditable");
        });
        expect(result).toBeTruthy();
    });

    it("method: setSelection and getSelection", async () => {
        const result = await page.evaluate(() => {
            vditorTest.setSelection(25, 66);
            return vditorTest.getSelection();
        });
        expect(result).toBe("[Vditor](https://github.com/Vanessa219/vditor)");
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
            vditorTest.setSelection(0, 3);
            vditorTest.deleteValue();
            return {
                cache: localStorage.getItem("vditorvditorTest"),
                value: vditorTest.getValue(),
            };
        });
        expect(result.value).toBe("Vditor 就这样诞生了。\n");
        expect(result.cache).toBe(insertValue + "\n");
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
            vditorTest.setSelection(0, 14);
            vditorTest.updateValue("* [Vditor 使用指南](https://ld246.com/article/1549638745630?r=Vanessa)");
            return {
                value: vditorTest.getValue(),
                cache: localStorage.getItem("vditorvditorTest"),
            };
        });
        expect(result.value).toBe(updateValue + "\n");
        expect(result.cache).toBe(updateValue + "\n");
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
        expect(result).toBe("[讨论区](https://ld246.com/tag/vditor)");
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
