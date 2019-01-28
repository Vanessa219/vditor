import boldSVG from "../../assets/icons/bold.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Bold extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || boldSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}