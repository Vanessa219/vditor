import {Constants} from "../constants";
import {outlineRender} from "../markdown/outlineRender";
import {setPadding} from "../ui/initUI";

export class Outline {
    public element: HTMLElement;

    constructor(outlineLabel: string) {
        this.element = document.createElement("div");
        this.element.className = "vditor-outline";
        this.element.innerHTML = `<div class="vditor-outline__title">${outlineLabel}</div>
<div class="vditor-outline__content"></div>`;
    }

    public render(vditor: IVditor) {
        if (this.element.style.display === "block") {
            if (vditor.preview.element.style.display === "block") {
                outlineRender(vditor.preview.element.lastElementChild as HTMLElement,
                    this.element.lastElementChild, vditor);
            } else {
                outlineRender(vditor[vditor.currentMode].element, this.element.lastElementChild, vditor);
            }
        }
    }

    public toggle(vditor: IVditor, show = true) {
        const btnElement = vditor.toolbar.elements.outline?.firstElementChild;
        if (show && window.innerWidth >= Constants.MOBILE_WIDTH) {
            this.element.style.display = "block";
            this.render(vditor);
            btnElement?.classList.add("vditor-menu--current");
        } else {
            this.element.style.display = "none";
            btnElement?.classList.remove("vditor-menu--current");
        }
        setPadding(vditor);
    }
}
