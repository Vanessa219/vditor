import strikekSVG from "../../assets/icons/strike.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Strike extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || strikekSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}