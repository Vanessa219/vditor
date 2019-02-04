import infoSVG from "../../assets/icons/info.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Info extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || infoSVG
        this.bindEvent()
    }

    bindEvent() {
        this.element.children[0].addEventListener('click', () => {
            window.open('https://github.com/b3log/vditor')
        })
    }
}