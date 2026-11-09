/** @jest-environment jsdom */
import {setCodeHighlight} from "../../src/ts/util/codeSelection";
import {normalizeCodeDOM, normalizeCodeHTML} from "../../src/ts/util/codeDOM";

describe("editable code selection and serialization", () => {
    let code: HTMLElement;
    const highlighted = '<span class="hljs-keyword">const</span> answer = <span class="hljs-number">1</span>;\n';
    beforeEach(() => {
        document.body.innerHTML = '<p>before</p><pre><code class="language-js">const answer = 1;\n</code></pre><p>after</p>';
        code = document.querySelector("code");
        getSelection().removeAllRanges();
    });

    it.each([[6, 6], [0, 17], [17, 0], [17, 17]])("preserves endpoints %s to %s", (anchor, focus) => {
        getSelection().setBaseAndExtent(code.firstChild, anchor, code.firstChild, focus);
        setCodeHighlight(code, highlighted);
        const offset = (node: Node, end: number) => {
            const range = document.createRange(); range.selectNodeContents(code); range.setEnd(node, end);
            return range.toString().length;
        };
        expect(offset(getSelection().anchorNode, getSelection().anchorOffset)).toBe(anchor);
        expect(offset(getSelection().focusNode, getSelection().focusOffset)).toBe(focus);
        expect(code.textContent).toBe("const answer = 1;\n");
        setCodeHighlight(code, highlighted);
        expect(offset(getSelection().anchorNode, getSelection().anchorOffset)).toBe(anchor);
    });

    it("preserves a selection spanning code and another block", () => {
        const outside = document.querySelector("p").firstChild;
        getSelection().setBaseAndExtent(outside, 2, code.firstChild, 8);
        setCodeHighlight(code, highlighted);
        expect(getSelection().anchorNode).toBe(outside);
        expect(getSelection().anchorOffset).toBe(2);
        expect(getSelection().toString()).toBe("foreconst an");
    });

    it("leaves a selection in another block untouched", () => {
        const outside = document.querySelector("p").firstChild;
        getSelection().setBaseAndExtent(outside, 2, outside, 4);
        setCodeHighlight(code, highlighted);
        expect(getSelection().toString()).toBe("fo");
    });

    it("preserves empty-code caret positions", () => {
        code.textContent = "";
        getSelection().setBaseAndExtent(code, 0, code, 0);
        setCodeHighlight(code, "");
        expect(getSelection().anchorNode).toBe(code);
        expect(getSelection().anchorOffset).toBe(0);
    });

    it("strips temporary spans while preserving caret markers and literal markup", () => {
        code.classList.add("hljs");
        code.setAttribute("data-code-highlight", "true");
        code.innerHTML = '<span class="hljs-string">"&lt;span&gt;<wbr>&amp;"</span><span class="vditor-wbr"></span>\n';
        const normalized = normalizeCodeHTML(document.body.innerHTML);
        const container = document.createElement("div"); container.innerHTML = normalized;
        expect(container.querySelector("code").innerHTML).toBe('"&lt;span&gt;<wbr>&amp;"<span class="vditor-wbr"></span>\n');
        expect(container.querySelector("code").className).toBe("language-js");
        expect(code.querySelector(".hljs-string")).not.toBeNull();
        normalizeCodeDOM(container);
        expect(container.innerHTML).toBe(normalized);
    });
});

describe("hint dismissal", () => {
    let hint: IVditor["hint"];
    beforeEach(() => {
        jest.useFakeTimers();
        Object.assign(globalThis, {VDITOR_VERSION: "test"});
        const {Hint} = require("../../src/ts/hint");
        hint = new Hint([]);
        document.body.innerHTML = '<p contenteditable="true">@a</p><input>';
        document.body.appendChild(hint.element);
        const text = document.querySelector("p").firstChild;
        getSelection().setBaseAndExtent(text, 2, text, 2);
    });
    afterEach(() => {
        hint.destroy();
        jest.useRealTimers();
    });

    it.each(["pointerdown", "focusin"])("dismisses on outside %s", type => {
        hint.element.style.display = "block";
        document.querySelector("input").dispatchEvent(new Event(type, {bubbles: true}));
        expect(hint.element.style.display).toBe("none");
    });

    it("keeps candidate clicks open until selection and unregisters on destroy", () => {
        hint.element.innerHTML = "<button>javascript</button>";
        hint.element.style.display = "block";
        hint.element.firstChild.dispatchEvent(new Event("pointerdown", {bubbles: true, cancelable: true}));
        expect(hint.element.style.display).toBe("block");
        hint.destroy();
        hint.element.style.display = "block";
        document.querySelector("input").dispatchEvent(new Event("pointerdown", {bubbles: true}));
        expect(hint.element.style.display).toBe("block");
    });

    it("ignores an asynchronous hint result after dismissal", async () => {
        let resolve: (data: IHintData[]) => void;
        const pending = new Promise<IHintData[]>(done => resolve = done);
        const render = jest.spyOn(hint, "genHTML").mockImplementation(() => {});
        const state = {currentMode: "ir", options: {hint: {delay: 10,
            extend: [{key: "@", hint: () => pending}]}}} as unknown as IVditor;
        hint.render(state);
        jest.advanceTimersByTime(10);
        hint.hide();
        resolve([{html: "answer", value: "answer"}]);
        await pending;
        expect(render).not.toHaveBeenCalled();
    });
});
