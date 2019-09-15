import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionFocus} from "../editor/setSelection";
import {expandByOffset} from "./expandByOffset";
import {getParentBlock} from "./getParentBlock";

class WYSIWYG {
    public element: HTMLPreElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        if (vditor.options.mode === "markdown-show") {
            this.element.style.display = "none";
        }

        this.bindEvent(vditor);
    }

    private setExpand() {
        const range = getSelection().getRangeAt(0);

        const caretRenderElement = this.element.querySelector('[data-caret="RenderVditorDOM"]');
        if (caretRenderElement) {
            // 渲染后不需要对元素展开
            caretRenderElement.remove();
        } else {
            // Test: __123__**456** **789*
            const startNodeElement = range.startContainer.parentElement.closest(".node");
            const endNodeElement = range.endContainer.parentElement.closest(".node");
            this.element.querySelectorAll(".node--expand").forEach((e) => {
                if (!e.isEqualNode(startNodeElement) || !e.isEqualNode(endNodeElement)) {
                    e.className = "node";
                }
            });
            if (!startNodeElement) {
                if (range.collapsed && range.startContainer.nodeType === 3 &&
                    range.startOffset === range.startContainer.textContent.length &&
                    range.startContainer.parentElement.nextElementSibling &&
                    range.startContainer.parentElement.nextElementSibling.className === "node") {
                    // 光标在普通文本和节点前，**789*
                    range.startContainer.parentElement.nextElementSibling.className = "node node--expand";
                    range.setStart(range.startContainer.parentElement.nextElementSibling.firstChild.childNodes[0], 0);
                    setSelectionFocus(range);
                }
            } else if (startNodeElement.className.indexOf("node--expand") === -1) {
                startNodeElement.className = "node node--expand";
            }
            if (range.startContainer.nodeType === 3 &&
                range.startContainer.textContent.length === range.startOffset &&
                range.startContainer.parentElement.className.indexOf("marker") > -1 &&
                !range.startContainer.parentElement.nextElementSibling &&
                startNodeElement.nextElementSibling && startNodeElement.nextElementSibling.className === "node") {
                // 光标在两个节点中间，__123__**456**
                startNodeElement.nextElementSibling.className = "node node--expand";
            }
            if (!range.collapsed) {
                // 展开多选中的节点
                const ancestorElement = range.commonAncestorContainer as HTMLElement;
                if (ancestorElement.nodeType !== 3 && ancestorElement.tagName !== "SPAN") {
                    ancestorElement.querySelectorAll(".node").forEach((e) => {
                        if (getSelection().containsNode(e, true)) {
                            e.className = "node node--expand";
                        }
                    });
                }
            }
        }

        // 记录光标位置
        this.element.querySelectorAll('[data-caret="start"]').forEach((e) => {
            e.removeAttribute("data-caret");
            e.removeAttribute("data-caretoffset");
        });
        let caretElement = range.startContainer as HTMLElement;
        if (range.startContainer.nodeType === 3) {
            caretElement = range.startContainer.parentElement;
            caretElement.setAttribute("data-caret", "startText");
        } else {
            caretElement.setAttribute("data-caret", "start");
        }
        caretElement.setAttribute("data-caretoffset", range.startOffset.toString());
        if (!range.collapsed) {
            if (range.endContainer.nodeType === 3) {
                caretElement = range.endContainer.parentElement;
                caretElement.setAttribute("data-caret", "endText");
            } else {
                caretElement.setAttribute("data-caret", "end");
            }
            caretElement.setAttribute("data-caretoffset", range.endOffset.toString());
        }
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("mouseup", () => {
            this.setExpand();
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent) => {
            this.setExpand();
        });

        this.element.addEventListener("input", (event: KeyboardEvent) => {
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

            // 结尾可以输入空格
            let endSpace = true;
            for (let i = startOffset - 1; i < blockElement.textContent.length; i++) {
                if (blockElement.textContent.charAt(i) !== " ") {
                    endSpace = false;
                    break;
                }
            }

            if (!startSpace && !endSpace) {
                range.insertNode(document.createTextNode(String.fromCharCode(7)));
                const formatHTML = vditor.lute.RenderVditorDOM(this.element.textContent.replace(String.fromCharCode(7),
                    '<span data-caret="RenderVditorDOM"></span>'));
                const newElement = document.createElement("div");
                newElement.innerHTML = formatHTML[0] || formatHTML[1];
                expandByOffset(newElement);
                this.element.innerHTML = newElement.innerHTML;

                range.setStartBefore(this.element.querySelector('[data-caret="RenderVditorDOM"]'));
                setSelectionFocus(range);
            }
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key === "Enter" && event.shiftKey) {
                // 软换行
                const brNode = document.createElement("span");
                brNode.innerHTML = '<br><span class="newline">\n</span>';

                const range = getSelection().getRangeAt(0);

                // 末尾需两个换行
                const blockElement = getParentBlock(range.startContainer as HTMLElement);
                const startOffset = getSelectPosition(blockElement, range).start;
                if (startOffset === blockElement.textContent.length - 2) {
                    brNode.innerHTML = '<br><span class="newline">\n</span><br><span class="newline">\n</span>';
                }

                range.insertNode(brNode);
                range.collapse(false);
                setSelectionFocus(getSelection().getRangeAt(0));
                event.preventDefault();
            }

            if (!event.metaKey && !event.ctrlKey && event.key === "Enter" && !event.shiftKey) {
                // newline
            }
        });
    }
}

export {WYSIWYG};
