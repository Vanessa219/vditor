class IR {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        const divElement = document.createElement("div");
        divElement.className = "vditor-ir";

        divElement.innerHTML = `<pre class="vditor-reset" placeholder="${vditor.options.placeholder}"
 contenteditable="true" spellcheck="false"></pre>`;

        this.element = divElement.firstElementChild as HTMLPreElement;

        if (vditor.currentMode !== "ir") {
            this.element.parentElement.style.display = "none";
        }
    }
}

export {IR};
