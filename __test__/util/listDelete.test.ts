/** @jest-environment jsdom */

(global as any).VDITOR_VERSION = "test";
(global as any).TextDecoder = require("util").TextDecoder;
(global as any).TextEncoder = require("util").TextEncoder;

jest.mock("../../src/ts/toolbar/setToolbar", () => ({
    enableToolbar: jest.fn(), disableToolbar: jest.fn(), hidePanel: jest.fn(),
}));
jest.mock("../../src/ts/util/editorCommonEvent", () => ({scrollCenter: jest.fn()}));
jest.mock("../../src/ts/util/highlightToolbar", () => ({highlightToolbar: jest.fn()}));
jest.mock("../../src/ts/util/toc", () => ({renderToc: jest.fn()}));
jest.mock("diff-match-patch", () => {
    // 测试配置启用了 esModuleInterop，生产构建直接使用该 CommonJS 构造函数。
    const implementation = jest.requireActual("diff-match-patch");
    implementation.__esModule = true;
    return implementation;
});

import {fixList} from "../../src/ts/util/fixBrowserBehavior";
import {Undo} from "../../src/ts/undo";
import {processKeydown as processWysiwygKeydown} from "../../src/ts/wysiwyg/processKeydown";
import {processKeydown as processIRKeydown} from "../../src/ts/ir/processKeydown";

require("../../src/js/lute/lute.min.js");

describe.each(["wysiwyg", "ir"])("Delete before a list in %s", (mode) => {
    let editor: HTMLElement;
    let vditor: IVditor;
    let range: Range;
    let paragraph: HTMLElement;

    const setup = (markdown = "- first\n  - nested\n- second", content = "\n") => {
        const lute = (global as any).Lute.New();
        editor = document.createElement("div");
        editor.className = "vditor-reset";
        editor.contentEditable = "true";
        editor.innerHTML = `<p data-block="0">${content}</p>` +
            (mode === "ir" ? lute.Md2VditorIRDOM(markdown) : lute.Md2VditorDOM(markdown));
        document.body.replaceChildren(editor);
        paragraph = editor.firstElementChild as HTMLElement;
        range = document.createRange();
        range.selectNodeContents(paragraph);
        range.collapse(true);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        vditor = {
            currentMode: mode, [mode]: {element: editor}, lute, undo: new Undo(), toolbar: {elements: {}},
            options: {input: jest.fn(), undoDelay: 10, counter: {enable: false}, cache: {enable: false},
                preview: {markdown: {imageCaption: false}}},
        } as unknown as IVditor;
    };

    const press = (options: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent("keydown", {key: "Delete", cancelable: true, ...options});
        const handled = fixList(range, vditor, paragraph, event);
        expect(event.defaultPrevented).toBe(handled);
        return handled;
    };

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        document.body.replaceChildren();
    });

    it.each(["- first\n  - nested\n- second", "3. first\n   - nested\n4. second",
        "- [x] first\n  - nested\n- [ ] second"])("preserves list nodes, attributes and Markdown: %s", (markdown) => {
        setup(markdown);
        const list = paragraph.nextElementSibling;
        const html = list.outerHTML;
        const expected = mode === "ir" ? vditor.lute.VditorIRDOM2Md(html) : vditor.lute.VditorDOM2Md(html);
        const firstItem = list.firstElementChild;
        expect(press()).toBe(true);
        expect(editor.firstElementChild).toBe(list);
        expect(list.outerHTML).toBe(html);
        expect(firstItem.contains(getSelection().anchorNode)).toBe(true);
        expect(getSelection().anchorNode.nodeType).toBe(Node.TEXT_NODE);
        expect(getSelection().anchorNode.textContent.substring(getSelection().anchorOffset)).toBe("first");
        jest.runOnlyPendingTimers();
        expect(vditor.options.input).toHaveBeenCalledTimes(1);
        expect(vditor.options.input).toHaveBeenCalledWith(expected);
    });

    it.each(["", "<br>", "\n", "\u200b\u200b", "<span><strong></strong><br></span>"])(
        "accepts empty paragraph placeholders %s", content => {
            setup("- first", content);
            expect(press()).toBe(true);
        });

    it.each(["text", " ", "   ", "\u00a0", "\t", "<span><strong> </strong><br></span>",
        "<img src='test.png'>", "<video></video>", "<audio></audio>", "<input>",
        "<input type='checkbox'>", "<textarea></textarea>", "<select></select>", "<button></button>",
        "<canvas></canvas>", "<iframe></iframe>", "<svg></svg>", "<span contenteditable='false'></span>",
        "<span data-type='html-inline'></span>"])("preserves nonempty content %s", content => {
        setup("- first", content);
        const html = editor.innerHTML;
        expect(press()).toBe(false);
        expect(editor.innerHTML).toBe(html);
    });

    it.each(["\n\n", "<br><br>", "\n<br>", "<span>\n</span><br>"])(
        "does not remove multiple visible empty lines: %s", content => {
            setup("- first", content);
            const html = editor.innerHTML;
            expect(press()).toBe(false);
            expect(editor.innerHTML).toBe(html);
        });

    it.each(["ctrlKey", "metaKey", "altKey", "shiftKey"])("leaves %s combinations alone", modifier => {
        setup();
        expect(press({[modifier]: true})).toBe(false);
    });

    it("leaves selected ranges, other keys, nonadjacent lists and container-boundary carets alone", () => {
        setup();
        range.selectNodeContents(paragraph);
        expect(press()).toBe(false);
        range.collapse(true);
        expect(press({key: "Backspace"})).toBe(false);
        range.setStart(editor, 0);
        expect(press()).toBe(false);
        range.selectNodeContents(paragraph);
        range.collapse(true);
        paragraph.after(document.createTextNode("between"));
        expect(press()).toBe(false);
    });

    it("leaves paragraphs inside list items alone", () => {
        setup();
        const item = editor.querySelector("li");
        item.prepend(paragraph);
        range.selectNodeContents(paragraph);
        range.collapse(true);
        expect(press()).toBe(false);
    });

    it("preserves a nested-only or empty first item and positions before its content", () => {
        setup("-\n  - child\n- second");
        const list = paragraph.nextElementSibling;
        const first = list.firstElementChild;
        const html = list.outerHTML;
        expect(press()).toBe(true);
        expect(list.outerHTML).toBe(html);
        expect(getSelection().anchorNode).toBe(first);
        expect(getSelection().anchorOffset).toBe(0);

        setup("-\n- second");
        const empty = paragraph.nextElementSibling.firstElementChild;
        expect(press()).toBe(true);
        expect(empty.contains(getSelection().anchorNode)).toBe(true);
        expect(getSelection().anchorOffset).toBe(0);
    });

    it("handles a paragraph and list inside a blockquote without moving the list", () => {
        setup();
        const blockquote = document.createElement("blockquote");
        const list = paragraph.nextElementSibling;
        blockquote.append(paragraph, list);
        editor.append(blockquote);
        range.selectNodeContents(paragraph);
        range.collapse(true);
        expect(press()).toBe(true);
        expect(blockquote.firstElementChild).toBe(list);
        expect(editor.firstElementChild).toBe(blockquote);
    });

    it.each(["- **first**", "- [first](https://example.org)", "- [x] **first**"])(
        "places the caret in editable text rather than markers: %s", markdown => {
            setup(markdown);
            expect(press()).toBe(true);
            expect(getSelection().anchorNode.textContent).toBe("first");
            expect(getSelection().anchorOffset).toBe(0);
            expect(getSelection().anchorNode.parentElement.closest(".vditor-ir__marker, input")).toBeNull();
        });

    it.each(["$x$", "![alt](test.png)", "<kbd>x</kbd>", "<span>html</span>", "&copy;"])(
        "positions before atomic inline content so inserted text survives Markdown serialization: %s", content => {
            setup("- " + content);
            expect(press()).toBe(true);
            const selection = getSelection();
            const container = selection.anchorNode.nodeType === Node.TEXT_NODE ?
                selection.anchorNode.parentElement : selection.anchorNode as HTMLElement;
            expect(container.closest(".vditor-ir__preview, .vditor-wysiwyg__preview, .vditor-ir__marker")).toBeNull();
            if (mode === "ir") {
                expect(container.closest(".vditor-ir__node")).toBeNull();
            }
            selection.getRangeAt(0).insertNode(document.createTextNode("INSERTED"));
            const markdown = mode === "ir" ? vditor.lute.VditorIRDOM2Md(editor.innerHTML) :
                vditor.lute.VditorDOM2Md(editor.innerHTML);
            expect(markdown).toContain("INSERTED" + content);
        });

    it("keeps the caret outside a code block's hidden markers", () => {
        setup("- ```js\n  const x = 1\n  ```");
        expect(press()).toBe(true);
        const selection = getSelection();
        expect(selection.anchorNode).toBe(editor.querySelector("li"));
        expect(selection.anchorOffset).toBe(0);
        selection.getRangeAt(0).insertNode(document.createTextNode("INSERTED"));
        const markdown = mode === "ir" ? vditor.lute.VditorIRDOM2Md(editor.innerHTML) :
            vditor.lute.VditorDOM2Md(editor.innerHTML);
        expect(markdown).toContain("INSERTED");
        expect(markdown.indexOf("INSERTED")).toBeLessThan(markdown.indexOf("const x = 1"));
    });

    it.each(["- first\n- second", "3. first\n4. second", "- [x] first\n- [ ] second"])(
        "records the deletion in the real undo stack and restores it on redo: %s", markdown => {
            setup(markdown);
            const original = editor.innerHTML;
            vditor.undo.addToUndoStack(vditor);
            vditor.undo.recordFirstPosition(vditor, new KeyboardEvent("keydown", {key: "Delete"}));
            expect(press()).toBe(true);
            jest.runOnlyPendingTimers();
            const deleted = editor.innerHTML;
            vditor.undo.undo(vditor);
            expect(editor.innerHTML).toBe(original);
            expect(editor.firstElementChild.contains(getSelection().anchorNode)).toBe(true);
            jest.runOnlyPendingTimers();
            vditor.undo.redo(vditor);
            expect(editor.innerHTML).toBe(deleted);
            expect(editor.querySelector("li").contains(getSelection().anchorNode)).toBe(true);
            jest.runOnlyPendingTimers();
            expect(vditor.options.input).toHaveBeenCalledTimes(3);
        });

    it("handles the complete keydown path and ignores composition", () => {
        setup("- [x] **first**\n- [ ] second");
        const html = paragraph.nextElementSibling.outerHTML;
        const expected = mode === "ir" ? vditor.lute.VditorIRDOM2Md(html) : vditor.lute.VditorDOM2Md(html);
        const handler = mode === "ir" ? processIRKeydown : processWysiwygKeydown;
        const composing = new KeyboardEvent("keydown", {key: "Delete", isComposing: true, cancelable: true});
        expect(handler(vditor, composing)).toBe(false);
        expect(paragraph.isConnected).toBe(true);
        const event = new KeyboardEvent("keydown", {key: "Delete", cancelable: true});
        expect(handler(vditor, event)).toBe(true);
        expect(event.defaultPrevented).toBe(true);
        expect(paragraph.isConnected).toBe(false);
        expect(getSelection().anchorNode.textContent).toBe("first");
        jest.runOnlyPendingTimers();
        expect(vditor.options.input).toHaveBeenCalledWith(expected);
    });
});
