import lineSVG from "../../assets/icons/line.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Line extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || lineSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}