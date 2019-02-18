import {insertText} from "../editor/index";
import {i18n} from "../i18n/index";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;
    public editorElement: HTMLTextAreaElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.editorElement = vditor.editor.element;

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
            this.menuItem.tip || i18n[vditor.options.lang][this.menuItem.name] + hotkey);
        this.element.appendChild(iconElement);
    }

    public bindEvent() {
        this.element.children[0].addEventListener("click", () => {
            insertText(this.editorElement, this.menuItem.prefix || "", this.menuItem.suffix || "");
        });
    }
}
