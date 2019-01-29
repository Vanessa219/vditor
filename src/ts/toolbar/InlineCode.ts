import inlineCodeSVG from "../../assets/icons/inline-code.svg";
import {MenuItemClass} from "./MenuItemClass";

export class InlineCode extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || inlineCodeSVG
        this.bindEvent()
    }

    bindEvent() {
        super.bindEvent()
    }
}