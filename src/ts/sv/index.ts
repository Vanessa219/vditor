import {isCtrl, isFirefox} from "../util/compatibility";
import {blurEvent, dropEvent, focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommonEvent";
import {getSelectText} from "../util/getSelectText";
import {highlightToolbarSV} from "./highlightToolbarSV";
import {inputEvent} from "./inputEvent";
import {paste} from "../util/fixBrowserBehavior";

class Editor {
    public element: HTMLPreElement;
    public composingLock: boolean = false;
    public processTimeoutId: number;
    public hlToolbarTimeoutId: number;
    public preventInput: boolean;

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
        dropEvent(vditor, this.element);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("copy", (event: ClipboardEvent) => {
            event.stopPropagation();
            event.preventDefault();
            event.clipboardData.setData("text/plain", getSelectText(this.element));
        });

        this.element.addEventListener("paste", (event: ClipboardEvent & { target: HTMLElement }) => {
            paste(vditor, event, {
                pasteCode: (code: string) => {
                    document.execCommand("insertHTML", false, code);
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
            if (!isFirefox()) {
                inputEvent(vditor, event);
            }
            this.composingLock = false;
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (this.composingLock) {
                return;
            }
            if (this.preventInput) {
                this.preventInput = false;
                return;
            }
            inputEvent(vditor, event);
        });

        this.element.addEventListener("click", (event: InputEvent) => {
            highlightToolbarSV(vditor);
        });

        this.element.addEventListener("keyup", (event) => {
            if (event.isComposing || isCtrl(event)) {
                return;
            }
            highlightToolbarSV(vditor);
            if ((event.key === "Backspace" || event.key === "Delete") &&
                vditor.sv.element.innerHTML !== "" && vditor.sv.element.childNodes.length === 1 &&
                vditor.sv.element.firstElementChild && vditor.sv.element.firstElementChild.tagName === "DIV"
                && vditor.sv.element.firstElementChild.childElementCount === 2
                && (vditor.sv.element.firstElementChild.textContent === "" || vditor.sv.element.textContent === "\n")) {
                // 为空时显示 placeholder
                vditor.sv.element.innerHTML = "";
                return;
            }
        });
    }
}

export {Editor};
