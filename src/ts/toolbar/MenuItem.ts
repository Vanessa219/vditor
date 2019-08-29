import {insertText} from "../editor/insertText";
import {i18n} from "../i18n/index";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;
    public vditor: IVditor;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.vditor = vditor;

        this.element = document.createElement("div");
        const iconElement = document.createElement("div");
        iconElement.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;

        let hotkey = this.menuItem.hotkey ? ` <${this.menuItem.hotkey}>` : "";
        if (/Mac/.test(navigator.platform)) {
            hotkey = hotkey.replace("ctrl", "⌘");
        } else {
            hotkey = hotkey.replace("⌘", "ctrl");
        }
        iconElement.setAttribute("aria-label",
            this.menuItem.tip + hotkey || i18n[vditor.options.lang][this.menuItem.name] + hotkey);
        this.element.appendChild(iconElement);
    }

    public bindEvent(replace: boolean = false) {
        this.element.children[0].addEventListener("click", () => {
            insertText(this.vditor, this.menuItem.prefix || "", this.menuItem.suffix || "",
                replace, true);
        });
    }
}
