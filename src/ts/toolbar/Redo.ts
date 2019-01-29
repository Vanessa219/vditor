import redoSVG from "../../assets/icons/redo.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Redo extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || redoSVG
        this.bindEvent()
    }

    bindEvent() {
        this.element.children[0].addEventListener('click', () => {
            document.execCommand('redo')
        })
    }
}