import helpSVG from "../../assets/icons/help.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Help extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || helpSVG
        this.bindEvent()
    }

    bindEvent() {
        this.element.children[0].addEventListener('click', () => {
            window.open('https://github.com/b3log/vditor')
        })
    }
}