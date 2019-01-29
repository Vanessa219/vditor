import undoSVG from "../../assets/icons/undo.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Undo extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || undoSVG
        this.bindEvent()
    }

    bindEvent() {
        this.element.children[0].addEventListener('click', () => {
            document.execCommand('undo')
        })
    }
}