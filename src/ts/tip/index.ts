export class Tip {
    public element: HTMLElement;
    private timeoutId: number;
    private positionTimeoutId: number;
    private visible = false;

    constructor(private tips?: ICustomTips) {
        this.element = document.createElement("div");
        this.element.className = "vditor-tip";
    }

    public show(text: string, time: number = 6000) {
        clearTimeout(this.timeoutId);
        clearTimeout(this.positionTimeoutId);
        this.visible = true;
        if (time !== 0) {
            this.timeoutId = window.setTimeout(() => this.hide(), time);
        }
        if (this.tips) {
            this.tips.show(text, time);
            return;
        }
        this.element.className = "vditor-tip vditor-tip--show";
        if (time === 0) {
            this.element.innerHTML = `<div class="vditor-tip__content">${text}
<div class="vditor-tip__close">X</div></div>`;
            this.element.querySelector(".vditor-tip__close").addEventListener("click", () => {
                this.hide();
            });
        } else {
            this.element.innerHTML = `<div class="vditor-tip__content">${text}</div>`;
        }

        // 需在动画结束后才能确定位置
        this.element.removeAttribute("style");
        this.positionTimeoutId = window.setTimeout(() => {
            const rect = this.element.getBoundingClientRect();
            if (rect.top < 46) {
                this.element.style.position = "fixed";
                this.element.style.top = "46px";
            }
        }, 150);
    }

    public hide() {
        clearTimeout(this.timeoutId);
        clearTimeout(this.positionTimeoutId);
        if (this.visible) {
            this.tips?.hide();
        }
        this.visible = false;
        this.element.className = "vditor-tip";
        this.element.innerHTML = "";
    }
}
