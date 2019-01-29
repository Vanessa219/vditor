import italicSVG from "../../assets/icons/italic.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Italic extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || italicSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}