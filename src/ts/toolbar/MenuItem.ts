import {Constants} from "../constants";
import {i18n} from "../i18n/index";
import {insertText} from "../sv/insertText";
import {getEventName} from "../util/compatibility";
import {updateHotkeyTip} from "../util/compatibility";
import {toolbarEvent} from "../wysiwyg/toolbarEvent";

export class MenuItem {
    public element: HTMLElement;
    public menuItem: IMenuItem;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        this.menuItem = menuItem;
        this.element = document.createElement("div");
        this.element.className = "vditor-toolbar__item";
        const iconElement = document.createElement(menuItem.name === "upload" ? "div" : "button");
        iconElement.setAttribute("data-type", menuItem.name);
        iconElement.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;

        const hotkey = this.menuItem.hotkey ? ` <${updateHotkeyTip(this.menuItem.hotkey)}>` : "";
        iconElement.setAttribute("aria-label",
            this.menuItem.tip ? this.menuItem.tip + hotkey : i18n[vditor.options.lang][this.menuItem.name] + hotkey);
        this.element.appendChild(iconElement);
    }

    public bindEvent(vditor: IVditor, replace: boolean = false) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }
            if (vditor.currentMode === "wysiwyg") {
                toolbarEvent(vditor, this.element.children[0]);
            } else {
                insertText(vditor, this.menuItem.prefix || "", this.menuItem.suffix || "",
                    replace, true);
            }
            event.preventDefault();
        });
    }
}
