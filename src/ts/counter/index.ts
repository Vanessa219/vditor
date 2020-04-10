export class Counter {
    public element: HTMLElement;

    constructor(vditor: IVditor) {
        this.element = document.createElement("div");
        this.element.className = "vditor-counter";

        this.render("", vditor.options.counter);

    }

    public render(text: string, counter: number | boolean, type: string = "md") {
        const length = text.endsWith("\n") ? text.length - 1 : text.length;
        if (typeof counter === "number") {
            if (length > counter) {
                this.element.className = "vditor-counter vditor-counter--error";
            } else {
                this.element.className = "vditor-counter";
            }
            this.element.innerHTML = `${type} ${length}/${counter}`;
        } else {
            this.element.innerHTML = `${type} ${length}`;
        }
    }
}
