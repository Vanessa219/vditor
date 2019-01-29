import orderedListVG from "../../assets/icons/ordered-list.svg";
import {MenuItemClass} from "./MenuItemClass";

export class OrderedList extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || orderedListVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}