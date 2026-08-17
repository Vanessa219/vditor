import {getMarkdown} from "../markdown/getMarkdown";
import {isFirefox} from "../util/compatibility";
import {focusEvent, hotkeyEvent} from "../util/editorCommonEvent";
import {paste} from "../util/fixBrowserBehavior";
import {processAfterRender, processPaste} from "./process";

class Editor {
    public element: HTMLTextAreaElement;
    public composingLock: boolean = false;
    public processTimeoutId: number;

    constructor(vditor: IVditor) {
        this.element = document.createElement("textarea");
        this.element.className = "vditor-sv vditor-reset";
        this.element.placeholder = vditor.options.placeholder;
        this.element.spellcheck = false;

        this.bindEvent(vditor);
        focusEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("blur", () => {
            if (vditor.options.blur) {
                vditor.options.blur(getMarkdown(vditor));
            }
        });

        this.element.addEventListener("paste", (event: ClipboardEvent & {target: HTMLElement}) => {
            paste(vditor, event, {
                pasteCode: (code: string) => {
                    processPaste(vditor, code.replace(/&lt;/g, "<").replace(/&amp;/g, "&"));
                },
            });
        });

        this.element.addEventListener("scroll", () => {
            if (vditor.preview.element.style.display !== "block") {
                return;
            }
            const textScrollTop = this.element.scrollTop;
            const textHeight = this.element.clientHeight;
            const textScrollHeight = this.element.scrollHeight - parseFloat(this.element.style.paddingBottom || "0");
            const preview = vditor.preview.element;
            if (textScrollTop / textHeight > 0.5) {
                preview.scrollTop = (textScrollTop + textHeight) * preview.scrollHeight / textScrollHeight - textHeight;
            } else {
                preview.scrollTop = textScrollTop * preview.scrollHeight / textScrollHeight;
            }
        });

        this.element.addEventListener("compositionstart", () => {
            this.composingLock = true;
        });

        this.element.addEventListener("compositionend", () => {
            this.composingLock = false;
            if (!isFirefox()) {
                processAfterRender(vditor);
            }
        });

        this.element.addEventListener("input", () => {
            if (!this.composingLock) {
                processAfterRender(vditor);
            }
        });

        this.element.addEventListener("select", () => {
            const selectedText = this.element.value.substring(this.element.selectionStart, this.element.selectionEnd);
            if (selectedText.trim()) {
                if (vditor.options.select) {
                    vditor.options.select(selectedText);
                }
            } else if (vditor.options.unSelect) {
                vditor.options.unSelect();
            }
        });
    }
}

export {Editor};
