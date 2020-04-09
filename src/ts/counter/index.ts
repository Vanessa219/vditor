export class Counter {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-counter";

        this.render("", vditor.options.counter);

    }

    public render(text: string, counter: number) {
        const length = text.endsWith("\n") ? text.length - 1 : text.length;
        if (length > counter) {
            this.element.className = "vditor-counter vditor-counter--error";
        } else {
            this.element.className = "vditor-counter";
        }
        this.element.innerHTML = `md ${length}/${counter}`;
    }
}
