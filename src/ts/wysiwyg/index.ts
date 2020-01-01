import {getSelectPosition} from "../editor/getSelectPosition";
import {setSelectionByPosition, setSelectionFocus} from "../editor/setSelection";
import {uploadFiles} from "../upload";
import {focusEvent, hotkeyEvent, scrollCenter, selectEvent} from "../util/editorCommenEvent";
import {hasClosestBlock, hasClosestByAttribute, hasClosestByClassName, hasClosestByTag} from "../util/hasClosest";
import {log} from "../util/log";
import {processPasteCode} from "../util/processPasteCode";
import {afterRenderEvent} from "./afterRenderEvent";
import {highlightToolbar} from "./highlightToolbar";
import {input} from "./input";
import {insertHTML} from "./insertHTML";
import {processCodeData} from "./processCodeData";
import {processCodeRender} from "./processCodeRender";

class WYSIWYG {
    public element: HTMLPreElement;
    public popover: HTMLDivElement;
    public afterRenderTimeoutId: number;
    public hlToolbarTimeoutId: number;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-reset vditor-wysiwyg";
        // TODO: placeholder
        this.element.setAttribute("contenteditable", "true");
        if (vditor.currentMode === "markdown") {
            this.element.style.display = "none";
        }

        this.element.innerHTML = '<p data-block="0">\n</p>';
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
                    event.stopPropagation();
                    event.preventDefault();
                    if (event.target.tagName === "INPUT") {
                        return;
                    }
                    const files = event.dataTransfer.items;
                    if (files.length > 0) {
                        uploadFiles(vditor, files);
                    }
                });
        }

        this.element.addEventListener("copy", (event: ClipboardEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            const tempElement = document.createElement("div");
            tempElement.appendChild(getSelection().getRangeAt(0).cloneContents());

            tempElement.querySelectorAll("code").forEach((codeElement) => {
                codeElement.setAttribute("data-code",
                    decodeURIComponent(codeElement.getAttribute("data-code") || ""));
            });

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

            // process word
            const doc = new DOMParser().parseFromString(textHTML, "text/html");
            if (doc.body) {
                textHTML = doc.body.innerHTML;
            }

            // process code
            const code = processPasteCode(textHTML, textPlain, "wysiwyg");
            if (event.target.tagName === "CODE") {
                // 粘贴在代码位置
                const position = getSelectPosition(event.target);
                event.target.textContent = event.target.textContent.substring(0, position.start)
                    + textPlain + event.target.textContent.substring(position.end);
                event.target.setAttribute("data-code", encodeURIComponent(event.target.textContent));
                setSelectionByPosition(position.start + textPlain.length, position.start + textPlain.length,
                    event.target.parentElement);
            } else if (code) {
                insertHTML(`<div class="vditor-wysiwyg__block" data-type="code-block"><pre><code data-code="${
                    encodeURIComponent(code)}"></code></pre></div>`);
                processCodeData(this.element);
            } else {
                if (textHTML.trim() !== "") {
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = textHTML;
                    tempElement.querySelectorAll("[style]").forEach((e) => {
                        e.removeAttribute("style");
                    });
                    insertHTML(vditor.lute.HTML2VditorDOM(tempElement.innerHTML));
                    processCodeData(this.element);
                } else if (event.clipboardData.files.length > 0 && vditor.options.upload.url) {
                    uploadFiles(vditor, event.clipboardData.files);
                } else if (textPlain.trim() !== "" && event.clipboardData.files.length === 0) {
                    log("Md2VditorDOM", textPlain, "argument", vditor.options.debugger);
                    let vditorDomHTML = vditor.lute.Md2VditorDOM(textPlain);
                    log("Md2VditorDOM", vditorDomHTML, "result", vditor.options.debugger);
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = vditorDomHTML;
                    const pElements = tempElement.querySelectorAll("p");
                    if (pElements.length === 1) {
                        vditorDomHTML = pElements[0].innerHTML;
                    }
                    insertHTML(vditorDomHTML);
                    processCodeData(this.element);
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
            input(event, vditor, getSelection().getRangeAt(0).cloneRange());
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

            // 没有被块元素包裹
            if (range.startContainer.nodeType === 3 &&
                range.startContainer.parentElement.classList.contains("vditor-wysiwyg")) {
                vditor.wysiwyg.element.childNodes.forEach((node) => {
                    if (node.nodeType === 3) {
                        const pElement = document.createElement("p");
                        pElement.setAttribute("data-block", "0");
                        pElement.textContent = node.textContent;
                        node.parentNode.insertBefore(pElement, node);
                        node.remove();
                    }
                });
            }

            // 前后空格处理
            const blockElement = hasClosestBlock(range.startContainer);
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

            if (startSpace || endSpace) {
                return;
            }

            input(event, vditor, range);
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

        this.element.addEventListener("keyup", (event: IHTMLInputEvent) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            highlightToolbar(vditor);

            if (event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "Backspace"
                && event.key !== "ArrowLeft" && event.key !== "ArrowUp") {
                return;
            }
            // 上下左右遇到块预览的处理
            const range = getSelection().getRangeAt(0);
            const element = range.startContainer.nodeType === 3 ?
                range.startContainer.parentElement : range.startContainer as HTMLElement;
            const previewElement = hasClosestByClassName(element, "vditor-wysiwyg__preview");
            if (!previewElement) {
                return;
            }
            if ((previewElement.previousElementSibling as HTMLElement).style.display === "none") {
                previewElement.click();
            } else {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    const blockRenderElement = previewElement.parentElement;
                    if (blockRenderElement.nextElementSibling &&
                        blockRenderElement.nextElementSibling.classList
                            .contains("vditor-panel")) {
                        // 渲染块处于末尾时，光标重置到该渲染块中的代码尾部
                        range.selectNodeContents(previewElement.previousElementSibling.firstElementChild);
                        range.collapse(false);
                    } else {
                        if (blockRenderElement.nextElementSibling &&
                            blockRenderElement.nextElementSibling.classList.contains("vditor-wysiwyg__block")) {
                            // 下一节点依旧为代码渲染块
                            (blockRenderElement.nextElementSibling
                                .querySelector(".vditor-wysiwyg__preview") as HTMLElement).click();
                            range.setStart(
                                blockRenderElement.nextElementSibling.firstElementChild.firstElementChild.firstChild,
                                0);
                        } else {
                            // 跳过渲染块，光标移动到下一个节点
                            range.setStartAfter(blockRenderElement);
                        }
                    }
                } else {
                    range.selectNodeContents(previewElement.previousElementSibling.firstElementChild);
                    range.collapse(false);
                }
                setSelectionFocus(range);
            }
        });

        this.element.addEventListener("keypress", (event: KeyboardEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "INPUT") {
                return;
            }
            if (event.key !== "Enter") {
                return;
            }
            const range = getSelection().getRangeAt(0).cloneRange();
            let typeElement = range.startContainer as HTMLElement;
            if (range.startContainer.nodeType === 3) {
                typeElement = range.startContainer.parentElement;
            }
            const preCodeElement = hasClosestByClassName(typeElement, "vditor-wysiwyg__block");
            if ((!event.metaKey && !event.ctrlKey && event.shiftKey) ||
                (!event.metaKey && !event.ctrlKey && !event.shiftKey && preCodeElement)) {
                // 软换行
                const blockElement = hasClosestByAttribute(range.startContainer.parentElement, "data-block", "0");
                if (blockElement && blockElement.tagName === "TABLE") {
                    range.insertNode(document.createElement("br"));
                } else {
                    range.insertNode(document.createTextNode("\n"));
                }
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
