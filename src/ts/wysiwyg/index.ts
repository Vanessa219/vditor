import {getSelectPosition} from "../editor/getSelectPosition";
import {getSelectText} from "../editor/getSelectText";
import {setSelectionFocus} from "../editor/setSelection";
import {copyEvent, focusEvent, hotkeyEvent, scrollCenter} from "../util/editorCommenEvent";
import {getParentBlock} from "./getParentBlock";

class WYSIWYG {
    public element: HTMLPreElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        if (vditor.currentMode === "markdown") {
            this.element.style.display = "none";
        }

        this.bindEvent(vditor);

        focusEvent(vditor, this.element);
        copyEvent(this.element);
        hotkeyEvent(vditor, this.element);
    }

    public setExpand() {
        const range = getSelection().getRangeAt(0);

        // Test: __123__**456** **789*
        const startNodeElement = range.startContainer.parentElement.closest(".node");
        const endNodeElement = range.endContainer.parentElement.closest(".node");
        this.element.querySelectorAll(".node--expand").forEach((e) => {
            if (!e.isEqualNode(startNodeElement) || !e.isEqualNode(endNodeElement)) {
                e.className = e.className.replace(" node--expand", "");
            }
        });
        if (!startNodeElement) {
            if (range.collapsed && range.startContainer.nodeType === 3 &&
                range.startContainer.textContent.length === range.startOffset &&
                range.startContainer.parentElement.nextElementSibling &&
                range.startContainer.parentElement.nextElementSibling.className.indexOf("node") > -1) {
                // 光标在普通文本和节点前，**789*
                range.startContainer.parentElement.nextElementSibling.className += " node--expand";
            }
        } else {
            if (startNodeElement.className.indexOf("node--expand") === -1) {
                // 光标在节点内
                startNodeElement.className += " node--expand";
            }
            if (range.startContainer.nodeType === 3 &&
                range.startContainer.textContent.length === range.startOffset &&
                range.startContainer.parentElement.className.indexOf("marker") > -1 &&
                startNodeElement.nextSibling &&
                startNodeElement.nextSibling.isEqualNode(startNodeElement.nextElementSibling) &&
                !range.startContainer.parentElement.nextElementSibling &&
                startNodeElement.nextElementSibling &&
                startNodeElement.nextElementSibling.className.indexOf("node") > -1) {
                // 光标在两个节点中间，__123__**456**
                startNodeElement.nextElementSibling.className += " node--expand";
            }
        }
        if (!range.collapsed) {
            // 展开多选中的节点
            const ancestorElement = range.commonAncestorContainer as HTMLElement;
            if (ancestorElement.nodeType !== 3 && ancestorElement.tagName !== "SPAN") {
                ancestorElement.querySelectorAll(".node").forEach((e) => {
                    if (getSelection().containsNode(e, true)) {
                        e.className += " node--expand";
                    }
                });
            }
        }
    }

    private luteRender(vditor: IVditor, range: Range) {
        const caret = getSelectPosition(this.element, range);
        const formatHTML = vditor.lute.RenderVditorDOM(this.element.textContent, caret.start, caret.end);
        console.log(this.element.textContent, caret.start, caret.end, formatHTML[0]);
        this.element.innerHTML = formatHTML[0] || formatHTML[1];
        const startElement = this.element.querySelector("[data-cso]");
        const endElement = this.element.querySelector("[data-ceo]");
        range.setStart(startElement.childNodes[0] || startElement,
            parseInt(startElement.getAttribute("data-cso"), 10));
        range.setEnd(endElement.childNodes[0] || endElement, parseInt(endElement.getAttribute("data-ceo"), 10));
        setSelectionFocus(range);

        if (vditor.hint) {
            vditor.hint.render(vditor);
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }
    }

    private bindEvent(vditor: IVditor) {
        // TODO drap upload file & paste
        this.element.addEventListener("mouseup", () => {
            this.setExpand();

            if (vditor.options.select) {
                const selectText = getSelectText(this.element);
                if (selectText === "") {
                    return;
                }
                vditor.options.select(selectText);
            }
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent) => {
            this.setExpand();
        });

        this.element.addEventListener("input", (event: IHTMLInputEvent) => {
            if (event.isComposing) {
                return;
            }
            const range = getSelection().getRangeAt(0).cloneRange();
            const blockElement = getParentBlock(range.startContainer as HTMLElement);
            const startOffset = getSelectPosition(blockElement, range).start;

            // 开始可以输入空格
            let startSpace = true;
            for (let i = startOffset - 1; i >= 0; i--) {
                if (blockElement.textContent.charAt(i) !== " ") {
                    startSpace = false;
                    break;
                }
            }
            if (startOffset === 0) {
                startSpace = false;
            }

            // 结尾可以输入空格
            let endSpace = true;
            for (let i = startOffset - 1; i < blockElement.textContent.length; i++) {
                if (blockElement.textContent.charAt(i) !== " " && blockElement.textContent.charAt(i) !== "\n") {
                    endSpace = false;
                    break;
                }
            }

            if (!startSpace && !endSpace) {
                if (blockElement.lastElementChild.className !== "newline") {
                    blockElement.insertAdjacentHTML("beforeend", "<span class='newline'>\n\n</span>");
                }
                this.luteRender(vditor, range);
            }
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key === "Enter") {
                const range = getSelection().getRangeAt(0).cloneRange();
                const brNode = document.createElement("span");
                if (event.shiftKey) {
                    // 软换行
                    brNode.innerHTML = "\n";
                    range.insertNode(brNode.childNodes[0]);
                    range.collapse(false);
                    setSelectionFocus(range);
                } else {
                    const blockElement = getParentBlock(range.startContainer as HTMLElement);
                    const caret = getSelectPosition(blockElement, range);
                    const newlineHTML = vditor.lute.VditorNewline(blockElement.getAttribute("data-ntype"));
                    if (caret.start === 0) {
                        // 段前换行
                        blockElement.insertAdjacentHTML("beforebegin", newlineHTML[0] || newlineHTML[1]);
                    } else if (caret.end === blockElement.textContent.replace(/\n\n$/, "").length) {
                        // 段末换行
                        blockElement.insertAdjacentHTML("afterend", newlineHTML[0] || newlineHTML[1]);
                        range.setEnd(blockElement.nextSibling, 0);
                        range.collapse(false);
                        setSelectionFocus(range);
                    } else {
                        // 分段
                        brNode.innerHTML = "\n\n";
                        range.insertNode(brNode.childNodes[0]);
                        range.collapse(false);
                        this.luteRender(vditor, range);
                    }
                }
                scrollCenter(this.element);
                event.preventDefault();
            }
        });
    }
}

export {WYSIWYG};
