import {setSelectionByPosition, setSelectionFocus} from "../editor/setSelection";
import {getCursorPosition} from "../hint/getCursorPosition";
import {getParentBlock} from "./getParentBlock";
import {getSelectPosition} from "../editor/getSelectPosition";

class WYSIWYG {
    public element: HTMLPreElement;
    public range: IWYSIWYGRange;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
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
                range.startContainer.parentElement.nextElementSibling &&
                range.startContainer.parentElement.nextElementSibling.className === "node") {
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
            startNodeElement.nextElementSibling.className = "node node--expand";
        }
        if (!range.collapsed) {
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

        this.element.addEventListener("input", () => {
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
                const formatHTML = vditor.lute.SpinVditorDOM(blockElement.innerHTML)
                blockElement.innerHTML = formatHTML[0] || formatHTML[1]
                blockElement.querySelectorAll(".node").forEach((e) => {
                    e.className = "node node--expand";
                });
            })

            setSelectionByPosition(this.range.startIndex, this.range.startIndex, this.range.startElement)
            if (!range.collapsed) {
                // setSelectionByEnd(this.range)
            }
            console.log(this.range)
            // setSelectionFocus(range)
            // const position = getCursorPosition(this.element);
        });

    }
}

export {WYSIWYG};
