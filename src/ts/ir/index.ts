import {focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommenEvent";

class IR {
    public element: HTMLElement;
    public composingLock: boolean = false;

    constructor(vditor: IVditor) {
        const divElement = document.createElement("div");
        divElement.className = "vditor-ir";

        divElement.innerHTML = `<pre class="vditor-reset" placeholder="${vditor.options.placeholder}"
 contenteditable="true" spellcheck="false"></pre>`;

        this.element = divElement.firstElementChild as HTMLPreElement;

        if (vditor.currentMode !== "ir") {
            this.element.parentElement.style.display = "none";
        }

        this.bindEvent(vditor);

        document.execCommand("DefaultParagraphSeparator", false, "p");

        focusEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
    }

    private input(vditor: IVditor, range: Range, event: InputEvent) {
        this.element.innerHTML = vditor.lute.SpinVditorIRDOM(this.element.innerHTML);
    }

    private bindEvent(vditor: IVditor) {
        this.element.addEventListener("compositionend", (event: InputEvent) => {
            this.input(vditor, getSelection().getRangeAt(0).cloneRange(), event);
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (this.composingLock) {
                return;
            }
            this.input(vditor, getSelection().getRangeAt(0).cloneRange(), event);
        });
    }
}

export {IR};
