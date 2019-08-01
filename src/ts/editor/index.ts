import {uploadFiles} from "../upload/index";
import {getSelectText} from "./getSelectText";
import {html2md} from "./html2md";
import {inputEvent} from "./inputEvent";
import {code160to32, quickInsertText} from "./insertText";

class Editor {
    public element: HTMLDivElement;
    public range: Range;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-textarea";
        this.element.setAttribute("placeholder", vditor.options.placeholder);
        this.element.setAttribute("contenteditable", "true");
        if (vditor.options.editorName) {
            this.element.setAttribute("name", vditor.options.editorName);
        }
        if (vditor.options.cache) {
            const localValue = localStorage.getItem("vditor" + vditor.id);
            if (localValue) {
                this.element.innerText = localValue;
            } else {
                this.setOriginal(vditor);
            }
            if (vditor.options.counter > 0) {
                vditor.counter.render(this.element.innerText.length, vditor.options.counter);
            }
        } else {
            this.setOriginal(vditor);
        }
        this.bindEvent(vditor);
    }

    private async setOriginal(vditor: IVditor) {
        if (!vditor.originalInnerHTML.trim()) {
            return;
        }
        const mdValue = await html2md(vditor, vditor.originalInnerHTML);
        this.element.focus();
        quickInsertText(mdValue);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("input", () => {
            inputEvent(vditor);
        });

        this.element.addEventListener("focus", () => {
            if (vditor.options.focus) {
                vditor.options.focus(code160to32(this.element.innerText));
            }
            if (vditor.toolbar.elements.emoji && vditor.toolbar.elements.emoji.children[1]) {
                const emojiPanel = vditor.toolbar.elements.emoji.children[1] as HTMLElement;
                emojiPanel.style.display = "none";
            }
            if (vditor.toolbar.elements.headings && vditor.toolbar.elements.headings.children[1]) {
                const headingsPanel = vditor.toolbar.elements.headings.children[1] as HTMLElement;
                headingsPanel.style.display = "none";
            }
        });

        this.element.addEventListener("blur", () => {
            this.range = window.getSelection().getRangeAt(0).cloneRange();
            if (vditor.options.blur) {
                vditor.options.blur(code160to32(this.element.innerText));
            }
        });

        if (vditor.options.select) {
            this.element.addEventListener("mouseup", () => {
                vditor.options.select(getSelectText(window.getSelection().getRangeAt(0), this.element));
            });
        }

        this.element.addEventListener("scroll", () => {
            if (vditor.preview.element.style.display === "none" && !vditor.preview) {
                return;
            }
            const textScrollTop = this.element.scrollTop;
            const textHeight = this.element.clientHeight;
            const textScrollHeight = this.element.scrollHeight;
            const preview = vditor.preview.element;
            if ((textScrollTop / textHeight > 0.5)) {
                preview.scrollTop = (textScrollTop + textHeight) *
                    preview.scrollHeight / textScrollHeight - textHeight;
            } else {
                preview.scrollTop = textScrollTop *
                    preview.scrollHeight / textScrollHeight;
            }
        });

        if (vditor.options.upload.url || vditor.options.upload.handler) {
            this.element.addEventListener("drop", (event: CustomEvent & { dataTransfer?: DataTransfer }) => {
                event.stopPropagation();
                event.preventDefault();

                const files = event.dataTransfer.items;
                if (files.length === 0) {
                    return;
                }

                uploadFiles(vditor, files);
            });
        }

        this.element.addEventListener("paste", async (event: Event) => {
            const clipboardEvent: ClipboardEvent = event as ClipboardEvent;
            if (clipboardEvent.clipboardData.getData("text/html").trim() !== "") {
                const textHTML = clipboardEvent.clipboardData.getData("text/html");
                const textPlain = clipboardEvent.clipboardData.getData("text/plain");
                if (textHTML.length < 106496) {
                    if (textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                        `<a href="${textPlain}">${textPlain}</a>` ||
                        textHTML.replace(/<(|\/)(html|body|meta)[^>]*?>/ig, "").trim() ===
                        `<!--StartFragment--><a href="${textPlain}">${textPlain}</a><!--EndFragment-->`) {
                        // https://github.com/b3log/vditor/issues/37
                    } else {
                        event.stopPropagation();
                        event.preventDefault();
                        // https://github.com/b3log/vditor/issues/51
                        const mdValue = await html2md(vditor, textHTML, textPlain);
                        quickInsertText(mdValue);
                    }
                }
            } else if (clipboardEvent.clipboardData.getData("text/plain").trim() !== "" &&
                clipboardEvent.clipboardData.files.length === 0) {
                // textarea 粘贴的默认内容为 clipboardEvent.clipboardData.getData("text/plain")
                // https://github.com/b3log/vditor/issues/67
            } else if (clipboardEvent.clipboardData.files.length > 0) {
                // upload file
                if (!(vditor.options.upload.url || vditor.options.upload.handler)) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                // NOTE: not work in Safari.
                // maybe the browser considered local filesystem as the same domain as the pasted data
                uploadFiles(vditor, clipboardEvent.clipboardData.files);
            }
        });
    }
}

export {Editor};
