import quoteSVG from "../../assets/icons/quote.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Quote extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || quoteSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}