const {launchBrowser, useLocalVditorAssets} = require("../util/launchBrowser");

jest.setTimeout(30000);

describe("WYSIWYG mobile toolbar", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.setViewport({height: 844, width: 390});
        await useLocalVditorAssets(page);
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest?.vditor?.lute);
        await page.evaluate(() => new Promise((resolve) => {
            const element = document.createElement("div");
            element.id = "mobileVditor";
            document.body.appendChild(element);
            const Vditor = window.vditorTest.constructor;
            let mobileVditorTest;
            mobileVditorTest = new Vditor(element, {
                after: () => {
                    window.mobileVditorTest = mobileVditorTest;
                    resolve();
                },
                cache: false,
                customWysiwygMobileToolbar: (type, toolbarElement) => {
                    window.mobileToolbarTypes = window.mobileToolbarTypes || [];
                    window.mobileToolbarTypes.push(type);
                    let actions = [];
                    if (type === "block") {
                        actions = ["heading-2", "quote", "list", "ordered-list", "check", "code", "table", "line"];
                    } else if (type === "li") {
                        actions = ["list", "ordered-list", "check", "outdent", "indent"];
                    }
                    actions.forEach((name) => {
                        let target;
                        if (name === "heading-2") {
                            target = mobileVditorTest.vditor.toolbar.elements.headings.querySelector('[data-tag="h2"]');
                        } else {
                            target = mobileVditorTest.vditor.toolbar.elements[name].firstElementChild;
                        }
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "vditor-icon";
                        button.setAttribute("data-action", name);
                        button.textContent = name === "heading-2" ? "H2" : name;
                        button.onclick = () => target.dispatchEvent(new Event("click", {
                            bubbles: true,
                            cancelable: true,
                        }));
                        toolbarElement.appendChild(button);
                    });
                },
                lang: "en_US",
                mode: "wysiwyg",
                toolbar: [
                    "headings",
                    "quote",
                    "list",
                    "ordered-list",
                    "check",
                    "outdent",
                    "indent",
                    "code",
                    "table",
                    "line",
                ],
            });
        }));
        await page.evaluate(() => document.querySelector("#webpack-dev-server-client-overlay")?.remove());
    });

    it("renders callback-provided block actions and keeps the caret", async () => {
        await page.evaluate(() => {
            window.mobileVditorTest.setValue("mobile toolbar");
            const editor = window.mobileVditorTest.vditor.wysiwyg.element;
            const textNode = editor.querySelector("p").firstChild;
            const range = document.createRange();
            range.setStart(textNode, 6);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        await page.waitForSelector("#mobileVditor .vditor-wysiwyg__mobile-toolbar", {timeout: 3000, visible: true});
        await page.click('#mobileVditor [data-type="mobile-menu"]');
        const menuState = await page.$eval("#mobileVditor .vditor-wysiwyg__mobile-actions", (element) => ({
            className: element.className,
            display: getComputedStyle(element).display,
        }));
        expect(menuState).toEqual(expect.objectContaining({
            display: "flex",
        }));

        const actions = await page.$$eval("#mobileVditor .vditor-wysiwyg__mobile-actions [data-action]", (items) =>
            items.map((item) => item.getAttribute("data-action")));
        expect(actions).toEqual(expect.arrayContaining([
            "heading-2",
            "quote",
            "list",
            "ordered-list",
            "check",
            "code",
            "table",
            "line",
        ]));

        await page.click('#mobileVditor [data-action="heading-2"]');
        await page.waitForFunction(() => window.mobileVditorTest.getValue() === "## mobile toolbar\n", {timeout: 3000});
        expect(await page.evaluate(() => ({
            offset: getSelection().anchorOffset,
            parentTag: getSelection().anchorNode.parentElement.tagName,
            value: window.mobileVditorTest.getValue(),
        }))).toEqual({
            offset: 6,
            parentTag: "H2",
            value: "## mobile toolbar\n",
        });
    });

    it("renders callback-provided list actions", async () => {
        await page.evaluate(() => {
            window.mobileVditorTest.setValue("* item");
            const editor = window.mobileVditorTest.vditor.wysiwyg.element;
            const walker = document.createTreeWalker(editor.querySelector("li"), NodeFilter.SHOW_TEXT);
            const textNode = walker.nextNode();
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            editor.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        await page.waitForSelector("#mobileVditor .vditor-wysiwyg__mobile-toolbar", {timeout: 3000, visible: true});
        await page.waitForSelector('#mobileVditor .vditor-wysiwyg__mobile-actions [data-action="outdent"]', {timeout: 3000});
        await page.click('#mobileVditor [data-type="mobile-menu"]');
        const actions = await page.$$eval("#mobileVditor .vditor-wysiwyg__mobile-actions [data-action]", (items) =>
            items.map((item) => item.getAttribute("data-action")));
        expect(actions).toEqual(["list", "ordered-list", "check", "outdent", "indent"]);
    });

    it("does not show an entry when the callback adds no actions", async () => {
        await page.evaluate(() => {
            window.mobileToolbarTypes = [];
            window.mobileVditorTest.setValue("| h |\n| - |\n| v |");
            const vditor = window.mobileVditorTest.vditor;
            const editor = vditor.wysiwyg.element;
            const textNode = editor.querySelector("th").firstChild;
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            vditor.wysiwyg.popover.innerHTML = "";
            editor.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        await page.waitForFunction(() => window.mobileToolbarTypes.includes("table"), {timeout: 3000});
        expect(await page.evaluate(() => ({
            entry: window.mobileVditorTest.vditor.wysiwyg.popover.querySelector(".vditor-wysiwyg__mobile-toolbar"),
            types: window.mobileToolbarTypes,
        }))).toEqual({
            entry: null,
            types: ["table"],
        });
    });

    it("does not show an entry when the interface is not configured", async () => {
        expect(await page.evaluate(async () => {
            const vditorTest = window.vditorTest;
            const vditor = vditorTest.vditor;
            if (vditor.currentMode !== "wysiwyg") {
                vditor[vditor.currentMode].element.dispatchEvent(new KeyboardEvent("keydown", {
                    altKey: true,
                    bubbles: true,
                    code: "Digit7",
                    ctrlKey: !navigator.platform.toUpperCase().includes("MAC"),
                    key: "7",
                    metaKey: navigator.platform.toUpperCase().includes("MAC"),
                }));
            }
            vditorTest.setValue("no mobile toolbar");
            const editor = vditor.wysiwyg.element;
            const textNode = editor.querySelector("p").firstChild;
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            vditor.wysiwyg.popover.innerHTML = "";
            editor.dispatchEvent(new MouseEvent("click", {bubbles: true}));
            await new Promise((resolve) => setTimeout(resolve, 300));
            return vditor.wysiwyg.popover.querySelector(".vditor-wysiwyg__mobile-toolbar");
        })).toBeNull();
    });

    it("switches a task list containing nested regular items", async () => {
        const pageErrors = [];
        const pageErrorHandler = (error) => pageErrors.push(error.message);
        page.on("pageerror", pageErrorHandler);
        await page.evaluate(() => {
            window.mobileVditorTest.setValue("* [ ] task\n  * nested");
            const vditor = window.mobileVditorTest.vditor;
            const editor = vditor.wysiwyg.element;
            const walker = document.createTreeWalker(editor.querySelector("li"), NodeFilter.SHOW_TEXT);
            let textNode = walker.nextNode();
            while (textNode && textNode.textContent.trim() === "") {
                textNode = walker.nextNode();
            }
            const range = document.createRange();
            range.setStart(textNode, textNode.textContent.length);
            range.collapse(true);
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            vditor.wysiwyg.popover.innerHTML = "";
            editor.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        await page.waitForSelector('#mobileVditor .vditor-wysiwyg__mobile-actions [data-action="list"]', {timeout: 3000});
        await page.click('#mobileVditor [data-type="mobile-menu"]');
        await page.click('#mobileVditor [data-action="list"]');
        page.off("pageerror", pageErrorHandler);
        expect(pageErrors).toEqual([]);
        expect(await page.evaluate(() => ({
            inputCount: window.mobileVditorTest.vditor.wysiwyg.element.querySelectorAll("li input").length,
            value: window.mobileVditorTest.getValue(),
        }))).toEqual({
            inputCount: 0,
            value: "* task\n  * nested\n",
        });
    });

    afterAll(async () => {
        await page.evaluate(() => window.mobileVditorTest.destroy());
        await browser.close();
    });
});
