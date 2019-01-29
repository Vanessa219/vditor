import listSVG from "../../assets/icons/list.svg";
import {MenuItemClass} from "./MenuItemClass";

export class List extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || listSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}