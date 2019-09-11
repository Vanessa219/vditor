import {setSelectionFocus} from "../editor/setSelection";

class WYSISYG {
    public element: HTMLElement;
    public range: Range;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        if (vditor.options.mode === "markdown-show") {
            this.element.style.display = "none";
        }

        this.bindEvent();
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

    private bindEvent() {
        this.element.addEventListener("mouseup", () => {
            this.setExpend();
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent) => {
            this.setExpend();
        });

    }
}

export {WYSISYG};
