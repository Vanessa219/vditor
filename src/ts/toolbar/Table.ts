import tableSVG from "../../assets/icons/table.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Table extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || tableSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}