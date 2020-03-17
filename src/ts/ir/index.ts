import {isCtrl} from "../util/compatibility";
import {focusEvent, hotkeyEvent, selectEvent} from "../util/editorCommenEvent";
import {expandMarker} from "./expandMarker";
import {input} from "./input";

class IR {
    public element: HTMLPreElement;
    public composingLock: boolean = false;

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
        this.element.addEventListener("compositionend", (event: InputEvent) => {
            input(vditor, getSelection().getRangeAt(0).cloneRange());
        });

        this.element.addEventListener("compositionstart", (event: InputEvent) => {
            this.composingLock = true;
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (this.composingLock) {
                return;
            }
            input(vditor, getSelection().getRangeAt(0).cloneRange());
        });

        this.element.addEventListener("click", (event) => {
            // TODO input, image, code
            expandMarker(getSelection().getRangeAt(0), vditor);
        });

        this.element.addEventListener("keyup", (event) => {
            if (event.isComposing || isCtrl(event)) {
                return;
            }
            if (event.key.indexOf("Arrow") > -1) {
                expandMarker(getSelection().getRangeAt(0), vditor);
            }
        });
    }
}

export {IR};
