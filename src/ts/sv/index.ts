import {uploadFiles} from "../upload/index";
import {isCtrl} from "../util/compatibility";
import {blurEvent, focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommonEvent";
import {getSelectText} from "./getSelectText";
import {highlightToolbar} from "./highlightToolbar";
import {html2md} from "./html2md";
import {inputEvent} from "./inputEvent";
import {insertText} from "./insertText";

class Editor {
    public element: HTMLPreElement;
    public range: Range;
    public composingLock: boolean = false;
    public processTimeoutId: number;
    public hlToolbarTimeoutId: number;

    constructor(vditor: IVditor) {
        this.element = document.createElement("pre");
        this.element.className = "vditor-sv vditor-reset";
        this.element.setAttribute("placeholder", vditor.options.placeholder);
        this.element.setAttribute("contenteditable", "true");
        this.element.setAttribute("spellcheck", "false");

        this.bindEvent(vditor);

        focusEvent(vditor, this.element);
        blurEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("copy", (event: ClipboardEvent) => {
            event.stopPropagation();
            event.preventDefault();
            event.clipboardData.setData("text/plain", getSelectText(this.element));
        });

        this.element.addEventListener("paste", (event: ClipboardEvent) => {
            const textHTML = event.clipboardData.getData("text/html");
            const textPlain = event.clipboardData.getData("text/plain");
            event.stopPropagation();
            event.preventDefault();
            if (textHTML.trim() !== "") {
                if (textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                    `<a href="${textPlain}">${textPlain}</a>` ||
                    textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                    `<!--StartFragment--><a href="${textPlain}">${textPlain}</a><!--EndFragment-->`) {
                    // https://github.com/b3log/vditor/issues/37
                } else {
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = textHTML;
                    tempElement.querySelectorAll("[style]").forEach((e) => {
                        e.removeAttribute("style");
                    });
                    tempElement.querySelectorAll(".vditor-copy").forEach((e) => {
                        e.remove();
                    });
                    tempElement.querySelectorAll(".vditor-anchor").forEach((e) => {
                        e.remove();
                    });
                    const mdValue = html2md(vditor, tempElement.innerHTML, textPlain).trimRight();
                    insertText(vditor, mdValue, "", true);
                    return;
                }
            } else if (textPlain.trim() !== "" && event.clipboardData.files.length === 0) {
                // https://github.com/b3log/vditor/issues/67
            } else if (event.clipboardData.files.length > 0) {
                // upload file
                if (!(vditor.options.upload.url || vditor.options.upload.handler)) {
                    return;
                }
                // NOTE: not work in Safari.
                // maybe the browser considered local filesystem as the same domain as the pasted data
                uploadFiles(vditor, event.clipboardData.files);
                return;
            }
            insertText(vditor, textPlain, "", true);
        });

        if (vditor.options.upload.url || vditor.options.upload.handler) {
            this.element.addEventListener("drop", (event: CustomEvent & { dataTransfer?: DataTransfer }) => {
                if (event.dataTransfer.types[0] !== "Files") {
                    insertText(vditor, getSelection().toString(), "", false);
                    event.preventDefault();
                    return;
                }
                const files = event.dataTransfer.items;
                if (files.length === 0) {
                    return;
                }
                uploadFiles(vditor, files);
                event.preventDefault();
            });
        }

        this.element.addEventListener("scroll", () => {
            if (vditor.preview.element.style.display !== "block") {
                return;
            }
            const textScrollTop = this.element.scrollTop;
            const textHeight = this.element.clientHeight;
            const textScrollHeight = this.element.scrollHeight - parseFloat(this.element.style.paddingBottom || "0");
            const preview = vditor.preview.element;
            if ((textScrollTop / textHeight > 0.5)) {
                preview.scrollTop = (textScrollTop + textHeight) *
                    preview.scrollHeight / textScrollHeight - textHeight;
            } else {
                preview.scrollTop = textScrollTop *
                    preview.scrollHeight / textScrollHeight;
            }
        });

        this.element.addEventListener("compositionstart", (event: InputEvent) => {
            this.composingLock = true;
        });

        this.element.addEventListener("compositionend", (event: InputEvent) => {
            inputEvent(vditor, event);
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (this.composingLock) {
                return;
            }
            inputEvent(vditor, event);
        });

        this.element.addEventListener("click", (event: InputEvent) => {
            highlightToolbar(vditor);
        });

        this.element.addEventListener("keyup", (event) => {
            if (event.isComposing || isCtrl(event)) {
                return;
            }
            highlightToolbar(vditor);
            if ((event.key === "Backspace" || event.key === "Delete") &&
                vditor.sv.element.innerHTML !== "" && vditor.sv.element.childNodes.length === 1 &&
                vditor.sv.element.firstElementChild && vditor.sv.element.firstElementChild.tagName === "P"
                && vditor.sv.element.firstElementChild.childElementCount === 0
                && (vditor.sv.element.textContent === "" || vditor.sv.element.textContent === "\n")) {
                // 为空时显示 placeholder
                vditor.sv.element.innerHTML = "";
                return;
            }
        });
    }
}

export {Editor};
