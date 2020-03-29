import {uploadFiles} from "../upload";
import {setHeaders} from "../upload/setHeaders";
import {isCtrl, isFirefox} from "../util/compatibility";
import {focusEvent, hotkeyEvent, scrollCenter, selectEvent} from "../util/editorCommenEvent";
import {hasClosestByClassName, hasClosestByMatchTag} from "../util/hasClosest";
import {processPasteCode} from "../util/processPasteCode";
import {
    getSelectPosition,
    insertHTML,
    setSelectionByPosition,
    setSelectionFocus,
} from "../util/selection";
import {expandMarker} from "./expandMarker";
import {highlightToolbar} from "./highlightToolbar";
import {input} from "./input";
import {processAfterRender, processCodeRender} from "./process";

class IR {
    public element: HTMLPreElement;
    public processTimeoutId: number;
    public hlToolbarTimeoutId: number;
    public composingLock: boolean = false;
    public preventInput: boolean;

    constructor(vditor: IVditor) {
        const divElement = document.createElement("div");
        divElement.className = "vditor-ir";

        divElement.innerHTML = `<pre class="vditor-reset" placeholder="${vditor.options.placeholder}"
 contenteditable="true" spellcheck="false"></pre>`;

        this.element = divElement.firstElementChild as HTMLPreElement;

        this.bindEvent(vditor);

        document.execCommand("DefaultParagraphSeparator", false, "p");

        focusEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("scroll", () => {
            vditor.hint.element.style.display = "none";
        });

        this.element.addEventListener("copy", (event: ClipboardEvent & { target: HTMLElement }) => {
            const range = getSelection().getRangeAt(0);
            if (range.toString() === "") {
                return;
            }
            event.stopPropagation();
            event.preventDefault();

            const tempElement = document.createElement("div");
            tempElement.appendChild(range.cloneContents());

            event.clipboardData.setData("text/plain", vditor.lute.VditorIRDOM2Md(tempElement.innerHTML).trim());
            event.clipboardData.setData("text/html", "");
        });

        this.element.addEventListener("paste", (event: ClipboardEvent & { target: HTMLElement }) => {
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
            const code = processPasteCode(textHTML, textPlain, "ir");
            const codeElement = hasClosestByMatchTag(event.target, "CODE");
            if (codeElement) {
                // 粘贴在代码位置
                const position = getSelectPosition(event.target);
                codeElement.textContent = codeElement.textContent.substring(0, position.start)
                    + textPlain + codeElement.textContent.substring(position.end);
                setSelectionByPosition(position.start + textPlain.length, position.start + textPlain.length,
                    codeElement.parentElement);
                const previewElement =
                    codeElement.parentElement.parentElement.querySelector(".vditor-ir__preview") as HTMLElement;
                previewElement.innerHTML = codeElement.outerHTML;
                processCodeRender(previewElement, vditor);
            } else if (code) {
                document.execCommand("insertHTML", false, code);
            } else {
                if (textHTML.trim() !== "") {
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = textHTML;
                    tempElement.querySelectorAll("[style]").forEach((e) => {
                        e.removeAttribute("style");
                    });
                    vditor.lute.SetJSRenderers({
                        renderers: {
                            HTML2VditorIRDOM: {
                                renderLinkDest: (node) => {
                                    const src = node.TokensStr();
                                    if (node.__internal_object__.Parent.Type === 34 && src
                                        && src.indexOf("file://") === -1 && vditor.options.upload.linkToImgUrl) {
                                        const xhr = new XMLHttpRequest();
                                        xhr.open("POST", vditor.options.upload.linkToImgUrl);
                                        setHeaders(vditor, xhr);
                                        xhr.onreadystatechange = () => {
                                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                                const responseJSON = JSON.parse(xhr.responseText);
                                                if (xhr.status === 200) {
                                                    if (responseJSON.code !== 0) {
                                                        vditor.tip.show(responseJSON.msg);
                                                        return;
                                                    }
                                                    // TODO
                                                    const original = responseJSON.data.originalURL;
                                                    const imgElement: HTMLImageElement =
                                                        this.element.querySelector(`img[src="${original}"]`);
                                                    imgElement.src = responseJSON.data.url;
                                                    processAfterRender(vditor);
                                                } else {
                                                    vditor.tip.show(responseJSON.msg);
                                                }
                                            }
                                        };
                                        xhr.send(JSON.stringify({url: src}));
                                    }
                                    return ["", Lute.WalkStop];
                                },
                            },
                        },
                    });
                    insertHTML(vditor.lute.HTML2VditorIRDOM(tempElement.innerHTML), vditor);
                    vditor.ir.element.querySelectorAll(".vditor-ir__preview").forEach((item: HTMLElement) => {
                        processCodeRender(item, vditor);
                    });
                } else if (event.clipboardData.files.length > 0 && vditor.options.upload.url) {
                    uploadFiles(vditor, event.clipboardData.files);
                } else if (textPlain.trim() !== "" && event.clipboardData.files.length === 0) {
                    insertHTML(vditor.lute.Md2VditorIRDOM(textPlain), vditor);
                    vditor.ir.element.querySelectorAll(".vditor-ir__preview").forEach((item: HTMLElement) => {
                        processCodeRender(item, vditor);
                    });
                }
            }

            processAfterRender(vditor);
        });

        if (vditor.options.upload.url || vditor.options.upload.handler) {
            this.element.addEventListener("drop",
                (event: CustomEvent & { dataTransfer?: DataTransfer, target: HTMLElement }) => {
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

        this.element.addEventListener("compositionend", (event: InputEvent) => {
            input(vditor, getSelection().getRangeAt(0).cloneRange());
        });

        this.element.addEventListener("compositionstart", (event: InputEvent) => {
            this.composingLock = true;
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (this.preventInput) {
                this.preventInput = false;
                return;
            }
            if (this.composingLock) {
                return;
            }
            input(vditor, getSelection().getRangeAt(0).cloneRange());
        });

        this.element.addEventListener("click", (event: MouseEvent & { target: HTMLInputElement }) => {
            if (event.target.tagName === "INPUT") {
                if (event.target.checked) {
                    event.target.setAttribute("checked", "checked");
                } else {
                    event.target.removeAttribute("checked");
                }
                this.preventInput = true;
                processAfterRender(vditor);
                return;
            }

            expandMarker(getSelection().getRangeAt(0), vditor);
            highlightToolbar(vditor);

            // 点击后光标落于预览区
            const range = getSelection().getRangeAt(0);
            let previewElement = hasClosestByClassName(event.target, "vditor-ir__preview");
            if (!previewElement) {
                previewElement = hasClosestByClassName(
                    range.startContainer, "vditor-ir__preview");
            }
            if (previewElement) {
                if (previewElement.previousElementSibling.firstElementChild) {
                    range.selectNodeContents(previewElement.previousElementSibling.firstElementChild);
                } else {
                    // 行内数学公式
                    range.selectNodeContents(previewElement.previousElementSibling);
                }
                range.collapse(true);
                setSelectionFocus(range);
                scrollCenter(this.element);
            }
        });

        this.element.addEventListener("keyup", (event) => {
            if (event.isComposing || isCtrl(event)) {
                return;
            }
            highlightToolbar(vditor);
            if ((event.key === "Backspace" || event.key === "Delete") &&
                vditor.ir.element.innerHTML !== "" && vditor.ir.element.childNodes.length === 1 &&
                vditor.ir.element.firstElementChild && vditor.ir.element.firstElementChild.tagName === "P"
                && (vditor.ir.element.textContent === "" || vditor.ir.element.textContent === "\n")) {
                // 为空时显示 placeholder
                vditor.ir.element.innerHTML = "";
                return;
            }
            const range = getSelection().getRangeAt(0);
            if (event.key === "Backspace") {
                // firefox headings https://github.com/Vanessa219/vditor/issues/211
                if (isFirefox() && range.startContainer.textContent === "\n" && range.startOffset === 1) {
                    range.startContainer.textContent = "";
                }
                // 数学公式前是空块，空块前是 table，在空块前删除，数学公式会多一个 br
                this.element.querySelectorAll(".language-math").forEach((item) => {
                    const brElement = item.querySelector("br");
                    if (brElement) {
                        brElement.remove();
                    }
                });
            }

            if (event.key.indexOf("Arrow") > -1 || event.key === "Backspace") {
                expandMarker(range, vditor);
            }

            const previewRenderElement = hasClosestByClassName(range.startContainer, "vditor-ir__preview");

            if (previewRenderElement) {
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    if (previewRenderElement.previousElementSibling.firstElementChild) {
                        range.selectNodeContents(previewRenderElement.previousElementSibling.firstElementChild);
                    } else {
                        // 行内数学公式
                        range.selectNodeContents(previewRenderElement.previousElementSibling);
                    }
                    range.collapse(false);
                    event.preventDefault();
                    return true;
                }
                // 行内数学公式
                if (previewRenderElement.tagName === "SPAN" &&
                    (event.key === "ArrowDown" || event.key === "ArrowRight")) {
                    range.selectNodeContents(previewRenderElement.parentElement.lastElementChild);
                    range.collapse(false);
                    event.preventDefault();
                    return true;
                }
            }
        });
    }
}

export {IR};
