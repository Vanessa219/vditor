export class Counter {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-counter";

        this.render(vditor, "");

    }

    public render(vditor: IVditor, mdText: string) {
        let length = mdText.endsWith("\n") ? mdText.length - 1 : mdText.length;
        if (vditor.options.counter.type === "text" && vditor[vditor.currentMode]) {
            const tempElement = vditor[vditor.currentMode].element.cloneNode(true) as HTMLElement;
            tempElement.querySelectorAll(".vditor-wysiwyg__preview").forEach((item) => {
                item.remove();
            });
            length = tempElement.textContent.length;
        }
        if (typeof vditor.options.counter.max === "number") {
            if (length > vditor.options.counter.max) {
                this.element.className = "vditor-counter vditor-counter--error";
            } else {
                this.element.className = "vditor-counter";
            }
            this.element.innerHTML = `${vditor.options.counter.type} ${length}/${vditor.options.counter.max}`;
        } else {
            this.element.innerHTML = `${vditor.options.counter.type} ${length}`;
        }
    }
}
