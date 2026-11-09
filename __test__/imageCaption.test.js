const {launchBrowser} = require("./util/launchBrowser");

jest.setTimeout(30000);

describe("image caption", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await launchBrowser();
        page = await browser.newPage();
        await page.goto("http://localhost:9000/jest-puppeteer.html", {waitUntil: "domcontentloaded"});
        await page.waitForFunction(() => window.vditorTest);
        await page.addScriptTag({url: "http://localhost:9000/js/i18n/en_US.js"});
    });

    test("renders image titles without changing Markdown", async () => {
        const result = await page.evaluate(async () => {
            const Vditor = window.vditorTest.constructor;
            const markdown = '![alt](image.png "Caption")';
            const createEditor = (mode, imageCaption) => new Promise((resolve) => {
                const element = document.createElement("div");
                document.body.appendChild(element);
                let editor;
                editor = new Vditor(element, {
                    _lutePath: "/js/lute/lute.min.js",
                    after: () => resolve(editor),
                    cache: {
                        enable: false,
                    },
                    i18n: window.VditorI18n,
                    mode,
                    preview: {
                        delay: 0,
                        markdown: {
                            imageCaption,
                        },
                    },
                    toolbar: [],
                    value: markdown,
                });
            });
            const removeEditor = (editor) => {
                const element = editor.vditor.element;
                editor.destroy();
                element.remove();
            };

            const wysiwyg = await createEditor("wysiwyg", true);
            const wysiwygResult = {
                caption: wysiwyg.vditor.wysiwyg.element
                    .querySelector(".vditor-image")?.getAttribute("data-image-caption"),
                captionContent: getComputedStyle(
                    wysiwyg.vditor.wysiwyg.element.querySelector(".vditor-image"),
                    "::after",
                ).content,
                html: wysiwyg.getHTML(),
                markdown: wysiwyg.getValue(),
            };
            const image = wysiwyg.vditor.wysiwyg.element.querySelector("img");
            image.dispatchEvent(new MouseEvent("click", {bubbles: true}));
            const titleInput = wysiwyg.vditor.wysiwyg.popover.querySelectorAll(".vditor-input")[2];
            titleInput.value = "Updated caption";
            titleInput.dispatchEvent(new InputEvent("input", {bubbles: true}));
            const updatedCaption = wysiwyg.vditor.wysiwyg.element
                .querySelector(".vditor-image")?.getAttribute("data-image-caption");
            const updatedMarkdown = wysiwyg.getValue();
            wysiwyg.setValue('text ![alt](image.png "Caption") text');
            const inlineCaption = wysiwyg.vditor.wysiwyg.element.querySelector(".vditor-image");
            wysiwyg.setValue('![one](one.png "One") ![two](two.png "Two")');
            const multipleCaption = wysiwyg.vditor.wysiwyg.element.querySelector(".vditor-image");
            wysiwyg.setValue("![alt](image.png)");
            const emptyCaption = wysiwyg.vditor.wysiwyg.element.querySelector(".vditor-image");
            wysiwyg.setValue('[![alt](image.png "Linked caption")](https://example.com)');
            const linkedCaption = wysiwyg.vditor.wysiwyg.element
                .querySelector(".vditor-image")?.getAttribute("data-image-caption");
            wysiwyg.setValue('![alt][image]\n\n[image]: image.png "Reference caption"');
            const referenceCaption = wysiwyg.vditor.wysiwyg.element
                .querySelector(".vditor-image")?.getAttribute("data-image-caption");
            removeEditor(wysiwyg);

            const ir = await createEditor("ir", true);
            const irResult = {
                caption: ir.vditor.ir.element
                    .querySelector('[data-type="img"]')?.getAttribute("data-image-caption"),
                html: ir.getHTML(),
                markdown: ir.getValue(),
            };
            removeEditor(ir);

            const sv = await createEditor("sv", true);
            sv.renderPreview();
            await new Promise((resolve) => setTimeout(resolve, 50));
            const svResult = {
                caption: sv.vditor.preview.previewElement.querySelector("figcaption")?.textContent,
                html: sv.getHTML(),
                markdown: sv.getValue(),
            };
            removeEditor(sv);

            const disabled = await createEditor("wysiwyg", false);
            const disabledResult = {
                caption: disabled.vditor.wysiwyg.element.querySelector(".vditor-image"),
                html: disabled.getHTML(),
            };
            removeEditor(disabled);

            const staticHTML = await Vditor.md2html(markdown, {
                markdown: {
                    imageCaption: true,
                },
            });
            const escapedHTML = await Vditor.md2html('![alt](image.png "<b>Caption</b>")', {
                markdown: {
                    imageCaption: true,
                },
            });

            return {
                disabled: {
                    caption: disabledResult.caption?.outerHTML,
                    html: disabledResult.html,
                },
                emptyCaption: emptyCaption?.outerHTML,
                escapedHTML,
                inlineCaption: inlineCaption?.outerHTML,
                ir: irResult,
                linkedCaption,
                multipleCaption: multipleCaption?.outerHTML,
                referenceCaption,
                staticHTML,
                sv: svResult,
                updatedCaption,
                updatedMarkdown,
                wysiwyg: wysiwygResult,
            };
        });

        expect(result.wysiwyg.caption).toBe("Caption");
        expect(result.wysiwyg.captionContent).toBe('"Caption"');
        expect(result.wysiwyg.markdown).toBe('![alt](image.png "Caption")\n');
        expect(result.wysiwyg.html).toContain("<figcaption>Caption</figcaption>");
        expect(result.updatedCaption).toBe("Updated caption");
        expect(result.updatedMarkdown).toBe('![alt](image.png "Updated caption")\n');
        expect(result.inlineCaption).toBeUndefined();
        expect(result.multipleCaption).toBeUndefined();
        expect(result.emptyCaption).toBeUndefined();
        expect(result.linkedCaption).toBe("Linked caption");
        expect(result.referenceCaption).toBe("Reference caption");
        expect(result.ir.caption).toBe("Caption");
        expect(result.ir.markdown).toBe('![alt](image.png "Caption")\n');
        expect(result.ir.html).toContain("<figcaption>Caption</figcaption>");
        expect(result.sv.caption).toBe("Caption");
        expect(result.sv.markdown.trim()).toBe('![alt](image.png "Caption")');
        expect(result.sv.html).toContain("<figcaption>Caption</figcaption>");
        expect(result.disabled.caption).toBeUndefined();
        expect(result.disabled.html).not.toContain("figcaption");
        expect(result.staticHTML).toContain("<figcaption>Caption</figcaption>");
        expect(result.escapedHTML).toContain("<figcaption>&lt;b&gt;Caption&lt;/b&gt;</figcaption>");
        expect(result.escapedHTML).not.toContain("<figcaption><b>");
    });

    afterAll(async () => {
        await browser?.close();
    });
});
