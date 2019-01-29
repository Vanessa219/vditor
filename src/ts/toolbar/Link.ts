import linkSVG from "../../assets/icons/link.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Link extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || linkSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}