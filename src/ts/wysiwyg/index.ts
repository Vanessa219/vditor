import {Constants} from "../constants";
import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionByPosition, setSelectionFocus} from "../editor/setSelection";
import {uploadFiles} from "../upload";
import {isCtrl} from "../util/compatibility";
import {focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommenEvent";
import {
    hasClosestBlock, hasClosestByAttribute,
    hasClosestByClassName,
    hasClosestByTag,
} from "../util/hasClosest";
import {log} from "../util/log";
import {processPasteCode} from "../util/processPasteCode";
import {addP2Li} from "./addP2Li";
import {afterRenderEvent} from "./afterRenderEvent";
import {highlightToolbar} from "./highlightToolbar";
import {getRenderElementNextNode} from "./inlineTag";
import {input} from "./input";
import {insertHTML} from "./insertHTML";
import {processCodeRender, showCode} from "./processCodeRender";
import {isHeadingMD, isHrMD} from "./processMD";
import {setRangeByWbr} from "./setRangeByWbr";

class WYSIWYG {
    public element: HTMLPreElement;
    public popover: HTMLDivElement;
    public afterRenderTimeoutId: number;
    public hlToolbarTimeoutId: number;
    public preventInput: boolean;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        if (vditor.options.theme === "dark") {
            this.element.classList.add("vditor-reset--dark");
        }
        // TODO: placeholder
        this.element.setAttribute("contenteditable", "true");
        this.element.setAttribute("spellcheck", "false");
        if (vditor.currentMode === "markdown") {
            this.element.style.display = "none";
        }

        this.element.innerHTML = Constants.WYSIWYG_EMPTY_P;
        const popover = document.createElement("div");
        popover.className = "vditor-panel vditor-panel--none";
        popover.setAttribute("contenteditable", "false");
        popover.setAttribute("data-render", "false");
        this.popover = popover;
        this.element.insertAdjacentElement("beforeend", popover);

        this.bindEvent(vditor);

        document.execCommand("DefaultParagraphSeparator", false, "p");

        focusEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {

        if (vditor.options.upload.url || vditor.options.upload.handler) {
            this.element.addEventListener("drop",
                (event: CustomEvent & { dataTransfer?: DataTransfer, target: HTMLElement }) => {
                    if (event.target.tagName === "INPUT") {
                        return;
                    }
                    if (event.dataTransfer.types[0] !== "Files") {
                        return;
                    }
                    const files = event.dataTransfer.items;
                    if (files.length > 0) {
                        uploadFiles(vditor, files);
                    }
                    event.preventDefault();
                });
        }

        this.element.addEventListener("copy", (event: ClipboardEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            const range = getSelection().getRangeAt(0);
            if (range.collapsed) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();

            if (range.commonAncestorContainer.parentElement.tagName === "CODE" &&
                range.commonAncestorContainer.parentElement.parentElement.tagName !== "PRE") {
                event.clipboardData.setData("text/plain", "`" +
                    getSelection().getRangeAt(0).toString() + "`");
                event.clipboardData.setData("text/html", "");
                return;
            }

            const tempElement = document.createElement("div");
            tempElement.appendChild(getSelection().getRangeAt(0).cloneContents());

            addP2Li(tempElement);

            event.clipboardData.setData("text/plain", vditor.lute.VditorDOM2Md(tempElement.innerHTML).trim());
            event.clipboardData.setData("text/html", "");
        });

        this.element.addEventListener("paste", (event: ClipboardEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            let textHTML = event.clipboardData.getData("text/html");
            const textPlain = event.clipboardData.getData("text/plain");

            // 浏览器地址栏拷贝处理
            if (textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                `<a href="${textPlain}">${textPlain}</a>` ||
                textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                `<!--StartFragment--><a href="${textPlain}">${textPlain}</a><!--EndFragment-->`) {
                textHTML = "";
            }

            // process word
            const doc = new DOMParser().parseFromString(textHTML, "text/html");
            if (doc.body) {
                textHTML = doc.body.innerHTML;
            }

            // process code
            const code = processPasteCode(textHTML, textPlain, "wysiwyg");
            const range = getSelection().getRangeAt(0);
            if (event.target.tagName === "CODE") {
                // 粘贴在代码位置
                const position = getSelectPosition(event.target);
                event.target.textContent = event.target.textContent.substring(0, position.start)
                    + textPlain + event.target.textContent.substring(position.end);
                setSelectionByPosition(position.start + textPlain.length, position.start + textPlain.length,
                    event.target.parentElement);
            } else if (code) {
                const node = document.createElement("div");
                node.innerHTML = `<div class="vditor-wysiwyg__block" data-block="0" data-type="code-block"><pre><code>${
                    code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}<wbr></code></pre></div>`;
                range.insertNode(node.firstChild);
                const blockElement = hasClosestByAttribute(range.startContainer, "data-block", "0");
                if (blockElement) {
                    blockElement.outerHTML = vditor.lute.SpinVditorDOM(blockElement.outerHTML);
                }
                vditor.wysiwyg.element.querySelectorAll(".vditor-wysiwyg__block").forEach(
                    (blockRenderItem: HTMLElement) => {
                        processCodeRender(blockRenderItem, vditor);
                    });
                setRangeByWbr(vditor.wysiwyg.element, range);
            } else {
                if (textHTML.trim() !== "") {
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = textHTML;
                    tempElement.querySelectorAll("[style]").forEach((e) => {
                        e.removeAttribute("style");
                    });
                    addP2Li(tempElement);
                    log("HTML2VditorDOM", tempElement.innerHTML, "argument", vditor.options.debugger);
                    const pasteHTML = vditor.lute.HTML2VditorDOM(tempElement.innerHTML);
                    log("HTML2VditorDOM", pasteHTML, "result", vditor.options.debugger);
                    insertHTML(pasteHTML, vditor);
                } else if (event.clipboardData.files.length > 0 && vditor.options.upload.url) {
                    uploadFiles(vditor, event.clipboardData.files);
                } else if (textPlain.trim() !== "" && event.clipboardData.files.length === 0) {
                    log("Md2VditorDOM", textPlain, "argument", vditor.options.debugger);
                    const vditorDomHTML = vditor.lute.Md2VditorDOM(textPlain);
                    log("Md2VditorDOM", vditorDomHTML, "result", vditor.options.debugger);
                    insertHTML(vditorDomHTML, vditor);
                }
            }

            this.element.querySelectorAll(".vditor-wysiwyg__block").forEach((blockElement: HTMLElement) => {
                processCodeRender(blockElement, vditor);
            });

            afterRenderEvent(vditor);
        });

        // 中文处理
        this.element.addEventListener("compositionend", (event: IHTMLInputEvent) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            input(vditor, getSelection().getRangeAt(0).cloneRange(), event);
        });

        this.element.addEventListener("input", (event: IHTMLInputEvent) => {
            if (this.preventInput) {
                this.preventInput = false;
                return;
            }
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
            let blockElement = hasClosestBlock(range.startContainer);

            // 没有被块元素包裹
            if (!blockElement) {
                const pElement = document.createElement("p");
                pElement.setAttribute("data-block", "0");
                if (vditor.wysiwyg.element.childNodes.length === 0) {
                    pElement.textContent = "\n";
                    range.insertNode(pElement);
                } else {
                    Array.from(vditor.wysiwyg.element.childNodes).find((node: HTMLElement) => {
                        if (node.nodeType === 3 || (node.nodeType !== 3 && !node.getAttribute("data-block"))) {
                            if (node.nodeType === 3) {
                                pElement.textContent = node.textContent;
                            } else {
                                pElement.innerHTML = node.outerHTML;
                            }
                            node.parentNode.insertBefore(pElement, node);
                            node.remove();
                            return true;
                        }
                    });
                }
                range.selectNodeContents(pElement);
                range.collapse(false);

                blockElement = hasClosestBlock(range.startContainer);
            }

            if (!blockElement) {
                return;
            }

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

            if (startSpace || endSpace || isHrMD(blockElement.innerHTML) || isHeadingMD(blockElement.innerHTML)) {
                return;
            }

            input(vditor, range, event);
        });

        this.element.addEventListener("click", (event: IHTMLInputEvent) => {
            if (hasClosestByClassName(event.target, "vditor-panel") || hasClosestByTag(event.target, "svg")) {
                return;
            }

            if (event.target.tagName === "INPUT") {
                if (event.target.checked) {
                    event.target.setAttribute("checked", "checked");
                } else {
                    event.target.removeAttribute("checked");
                }
                return;
            }

            if (event.target.tagName === "IMG") {
                const range = this.element.ownerDocument.createRange();
                range.selectNode(event.target);
                range.collapse(true);
                setSelectionFocus(range);
            }

            highlightToolbar(vditor);

            // 点击后光标落于预览区，需展开代码块
            let previewElement = hasClosestByClassName(event.target, "vditor-wysiwyg__preview");
            if (!previewElement) {
                previewElement = hasClosestByClassName(getSelection().getRangeAt(0).startContainer, "vditor-wysiwyg__preview");
            }
            if (previewElement) {
                showCode(previewElement);
            }
        });

        this.element.addEventListener("keyup", (event: KeyboardEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            if (event.isComposing || isCtrl(event)) {
                return;
            }

            highlightToolbar(vditor);

            if (event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "Backspace"
                && event.key !== "ArrowLeft" && event.key !== "ArrowUp") {
                return;
            }

            const range = getSelection().getRangeAt(0);

            // 上下左右遇到块预览的处理
            const previewElement = hasClosestByClassName(range.startContainer, "vditor-wysiwyg__preview");
            if (!previewElement) {
                return;
            }
            const previousElement = previewElement.previousElementSibling as HTMLElement;
            if (previousElement.style.display === "none") {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    showCode(previewElement);
                } else {
                    showCode(previewElement, false);
                }
                return;
            }

            let codeElement = previewElement.previousElementSibling as HTMLElement;
            if (codeElement.tagName === "PRE") {
                codeElement = codeElement.firstElementChild as HTMLElement;
            }

            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                const blockRenderElement = previewElement.parentElement;
                let nextNode = getRenderElementNextNode(blockRenderElement) as HTMLElement;
                if (nextNode && nextNode.nodeType !== 3) {
                    // 下一节点依旧为代码渲染块
                    const nextRenderElement = nextNode.querySelector(".vditor-wysiwyg__preview") as HTMLElement;
                    if (nextRenderElement) {
                        showCode(nextRenderElement);
                        return;
                    }
                }
                // 跳过渲染块，光标移动到下一个节点
                if (nextNode.nodeType === 3) {
                    // inline
                    while (nextNode.textContent.length === 0 && nextNode.nextSibling) {
                        // https://github.com/Vanessa219/vditor/issues/100 2
                        nextNode = nextNode.nextSibling as HTMLElement;
                    }
                    range.setStart(nextNode, 1);
                } else {
                    // block
                    range.setStart(nextNode.firstChild, 0);
                }
            } else {
                range.selectNodeContents(codeElement);
                range.collapse(false);
            }
        });
    }
}

export {WYSIWYG};
