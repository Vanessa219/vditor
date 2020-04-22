import {Constants} from "../constants";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";

export const setContentTheme = (vditor: IVditor, contentTheme: string) => {
    if (contentTheme === "dark") {
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.add("vditor-reset--dark");
        }
        vditor.wysiwyg.element.classList.add("vditor-reset--dark");
        vditor.ir.element.classList.add("vditor-reset--dark");
    } else {
        if (vditor.preview) {
            vditor.preview.element.firstElementChild.classList.remove("vditor-reset--dark");
        }
        vditor.wysiwyg.element.classList.remove("vditor-reset--dark");
        vditor.ir.element.classList.remove("vditor-reset--dark");
    }
}

export class ContentTheme extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const actionBtn = this.element.children[0] as HTMLElement;

        const panelElement = document.createElement("div");
        panelElement.className = `vditor-hint vditor-panel--${menuItem.level === 2 ? "side" : "arrow"}`;
        let innerHTML = "";
        Constants.CONTENT_THEME.forEach((theme) => {
            innerHTML += `<button>${theme}</button>`;
        });
        panelElement.innerHTML =
            `<div style="overflow: auto;max-height:${window.innerHeight / 2}px">${innerHTML}</div>`;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            if (event.target.tagName === "BUTTON") {
                hidePanel(vditor, ["subToolbar"]);
                setContentTheme(vditor, event.target.textContent);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.appendChild(panelElement);

        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
    }
}
