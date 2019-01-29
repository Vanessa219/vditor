import codeSVG from "../../assets/icons/code.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Code extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || codeSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}