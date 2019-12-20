import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionFocus} from "../editor/setSelection";
import {uploadFiles} from "../upload";
import {copyEvent, focusEvent, hotkeyEvent, scrollCenter, selectEvent} from "../util/editorCommenEvent";
import {hasClosestByClassName, hasClosestByTag} from "../util/hasClosest";
import {processPasteCode} from "../util/processPasteCode";
import {afterRenderEvent} from "./afterRenderEvent";
import {getParentBlock} from "./getParentBlock";
import {highlightToolbar} from "./highlightToolbar";
import {setRangeByWbr} from "./setRangeByWbr";

class WYSIWYG {
    public element: HTMLPreElement;
    public popover: HTMLDivElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        this.element.setAttribute("contenteditable", "true");
        if (vditor.currentMode === "markdown") {
            this.element.style.display = "none";
        }

        const popover = document.createElement("div");
        popover.className = "vditor-panel vditor-panel--none";
        popover.setAttribute("contenteditable", "false");
        popover.setAttribute("data-render", "false");
        this.popover = popover;
        this.element.insertAdjacentElement("beforeend", popover);

        this.bindEvent(vditor);

        document.execCommand("DefaultParagraphSeparator", false, "p");

        focusEvent(vditor, this.element);
        copyEvent(this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {

        if (vditor.options.upload.url || vditor.options.upload.handler) {
            this.element.addEventListener("drop", (event: CustomEvent & { dataTransfer?: DataTransfer }) => {
                event.stopPropagation();
                event.preventDefault();
                const files = event.dataTransfer.items;
                if (files.length > 0) {
                    uploadFiles(vditor, files);
                }
            });
        }

        this.element.addEventListener("paste", async (event: ClipboardEvent) => {
            event.stopPropagation();
            event.preventDefault();
            let textHTML = event.clipboardData.getData("text/html");
            const textPlain = event.clipboardData.getData("text/plain");

            // process word
            const doc = new DOMParser().parseFromString(textHTML, "text/html");
            if (doc.body) {
                textHTML = doc.body.innerHTML;
            }
            const code = processPasteCode(textHTML, textPlain, "wysiwyg");
            if (code) {
                const codeNode = document.createElement("div");
                codeNode.innerHTML = "<pre><code></code></pre>";
                codeNode.querySelector("code").innerText = code;
                const range = getSelection().getRangeAt(0);
                range.insertNode(codeNode.firstElementChild);
                range.collapse(false);
                return;
            }

            if (textHTML.trim() !== "") {
                console.log(`HTML2VditorDOM-argument[${textHTML}]`);
                document.execCommand("insertHTML", false, vditor.lute.HTML2VditorDOM(textHTML));
                console.log(`HTML2VditorDOM-result[${vditor.lute.HTML2VditorDOM(textHTML)}]`);
            } else if (event.clipboardData.files.length > 0 && vditor.options.upload.url) {
                uploadFiles(vditor, event.clipboardData.files);
            } else if (textPlain.trim() !== "" && event.clipboardData.files.length === 0) {
                const textNode = document.createTextNode(textPlain);
                const range = getSelection().getRangeAt(0);
                range.insertNode(textNode);
                range.collapse(false);
            }
        });

        this.element.addEventListener("input", (event: IHTMLInputEvent) => {
            const range = getSelection().getRangeAt(0).cloneRange();

            if (range.commonAncestorContainer.nodeType !== 3
                && (range.commonAncestorContainer as HTMLElement).classList.contains("vditor-panel--none")) {
                event.preventDefault();
                return;
            }

            if (event.isComposing) {
                return;
            }

            // 前后空格处理
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

            let htmlElement = hasClosestByClassName(range.startContainer as HTMLElement, "vditor-wysiwyg__block");
            if (!htmlElement || htmlElement.getAttribute("data-type") !== "html") {
                htmlElement = undefined;
            }

            if (!startSpace && !endSpace
                && !htmlElement
                && event.inputType !== "formatItalic"
                && event.inputType !== "formatBold"
                && event.inputType !== "formatRemove"
                && event.inputType !== "formatStrikeThrough"
                && event.inputType !== "insertUnorderedList"
                && event.inputType !== "insertOrderedList"
                && event.inputType !== "formatOutdent"
                && event.inputType !== "formatIndent"
                && event.inputType !== ""   // document.execCommand('unlink', false)
            ) {
                // 保存光标
                this.element.querySelectorAll("wbr").forEach((wbr) => {
                    wbr.remove();
                });
                const wbrNode = document.createElement("wbr");
                range.insertNode(wbrNode);

                // markdown 纠正
                console.log(`SpinVditorDOM-argument:[${this.element.innerHTML}]`);
                this.element.innerHTML = vditor.lute.SpinVditorDOM(this.element.innerHTML);
                console.log(`SpinVditorDOM-result:[${this.element.innerHTML}]`);
                this.element.insertAdjacentElement("beforeend", this.popover);

                // 设置光标
                setRangeByWbr(this.element, range);

                if (vditor.hint) {
                    vditor.hint.render(vditor);
                }
            }

            afterRenderEvent(vditor);
        });

        this.element.addEventListener("click", (event: IHTMLInputEvent) => {
            if (hasClosestByClassName(event.target, "vditor-panel") || hasClosestByTag(event.target, "svg")) {
                return;
            }

            highlightToolbar(vditor);
            if (event.target.tagName === "INPUT") {
                if (event.target.checked) {
                    event.target.setAttribute("checked", "checked");
                } else {
                    event.target.removeAttribute("checked");
                }
            }
        });

        this.element.addEventListener("keyup", () => {
            highlightToolbar(vditor);
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent) => {
            if (event.key !== "Enter") {
                return;
            }
            if (!event.metaKey && !event.ctrlKey && event.shiftKey) {
                // 软换行
                const range = getSelection().getRangeAt(0).cloneRange();
                range.insertNode(document.createTextNode("\n\n"));
                range.collapse(false);
                setSelectionFocus(range);

                afterRenderEvent(vditor);

                event.preventDefault();
            }
            scrollCenter(this.element);
        });
    }
}

export {WYSIWYG};
