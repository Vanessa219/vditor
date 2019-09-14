import {setSelectionByPosition, setSelectionByWYSIWYG, setSelectionFocus} from "../editor/setSelection";
import {getCursorPosition} from "../hint/getCursorPosition";
import {getParentBlock} from "./getParentBlock";
import {getSelectPosition} from "../editor/getSelectPosition";
import {insertText} from "../editor/insertText";
import {expandByOffset} from "./expandByOffset";

class WYSIWYG {
    public element: HTMLPreElement;
    public range: IWYSIWYGRange;
    private id:string ='vditorb1';

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        this.element.innerHTML = `<p id="${this.id}" data-mtype="0"></p>`
        if (vditor.options.mode === "markdown-show") {
            this.element.style.display = "none";
        }

        this.range = {
            startElement: undefined,
            startIndex: 0,
            endElement: undefined,
            endIndex: 0
        }

        this.bindEvent(vditor);
    }

    private setExpend() {
        // Test: __123__**456** **789*
        const range = getSelection().getRangeAt(0);
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

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("mouseup", () => {
            this.setExpend();
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent) => {
            this.setExpend();
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey && event.key === "Enter") {
                // this.key = event.key
            }
        });

        this.element.addEventListener("input", (event: KeyboardEvent) => {
            let range = getSelection().getRangeAt(0).cloneRange()
            const blockElements = []
            const ancestorElement = range.commonAncestorContainer as HTMLElement;
            if (!range.collapsed && ancestorElement.nodeType !== 3) {
                ancestorElement.querySelectorAll("[data-mtype='0']").forEach((e: HTMLElement) => {
                    if (getSelection().containsNode(e, true)) {
                        blockElements.push(getParentBlock(e))
                    }
                });
            } else {
                blockElements.push(getParentBlock(range.startContainer as HTMLElement))
            }

            blockElements.forEach((blockElement: HTMLElement, index) => {
                if (index === 0) {
                    this.range.startElement = blockElement
                    this.range.startIndex = getSelectPosition(blockElement, range).start
                } else if (index === blockElements.length - 1) {
                    this.range.endElement = blockElement
                    this.range.endIndex = getSelectPosition(blockElement, range).start
                }
                const formatHTML = vditor.lute.RenderVditorDOM(blockElement.textContent)
                const newElement = document.createElement('div')
                newElement.innerHTML = formatHTML[0] || formatHTML[1]
                expandByOffset(newElement, this.range.startIndex)
                blockElement.innerHTML =  newElement.innerHTML
            })

            setSelectionByWYSIWYG(this.range)
            console.log(this.range)
            // setSelectionFocus(range)
            // const position = getCursorPosition(this.element);
        });
    }
}

export {WYSIWYG};
