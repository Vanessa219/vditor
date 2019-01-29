import checkSVG from "../../assets/icons/check.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Check extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || checkSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}