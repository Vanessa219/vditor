export class Tip {
    public element: HTMLElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "vditor-tip";
    }

    public show(text: string, time: number = 6000) {
        this.element.className = "vditor-tip vditor-tip--show";

        if (time === 0) {
            this.element.innerHTML = `<div class="vditor-tip__content">${text}
<div class="vditor-tip__close">X</div></div>`;
            this.element.querySelector(".vditor-tip__close").addEventListener("click", () => {
                this.hide();
            });
            return;
        }

        this.element.innerHTML = `<div class="vditor-tip__content">${text}</div>`;
        setTimeout(() => {
            this.hide();
        }, time);
    }

    public hide() {
        this.element.className = "vditor-messageElementtip";
        this.element.innerHTML = "";
    }
}
