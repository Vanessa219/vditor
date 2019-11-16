import {insertText} from "../editor/insertText";
import {i18n} from "../i18n/index";
import {getEventName} from "../util/getEventName";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.element = document.createElement("div");
        const iconElement = document.createElement("button");
        iconElement.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;

        let hotkey = this.menuItem.hotkey ? ` <${this.menuItem.hotkey}>` : "";
        if (/Mac/.test(navigator.platform)) {
            hotkey = hotkey.replace("ctrl", "⌘");
        } else {
            hotkey = hotkey.replace("⌘", "ctrl");
        }
        iconElement.setAttribute("aria-label",
            this.menuItem.tip ? this.menuItem.tip + hotkey : i18n[vditor.options.lang][this.menuItem.name] + hotkey);
        this.element.appendChild(iconElement);
    }

    public bindEvent(vditor: IVditor, replace: boolean = false) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentMode === "wysiwyg") {
                // TODO: document.execCommand('italic', false);
                // vditor.wysiwyg.element.focus()
            } else {
                insertText(vditor, this.menuItem.prefix || "", this.menuItem.suffix || "",
                    replace, true);
            }
            event.preventDefault();
        });
    }
}
