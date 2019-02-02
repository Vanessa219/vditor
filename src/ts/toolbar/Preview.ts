import previewSVG from "../../assets/icons/preview.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Preview extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || previewSVG
        if (vditor.options.preview.show) {
            this.element.children[0].className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`
        }
        this._bindEvent(vditor, menuItem)
    }

    _bindEvent(vditor: Vditor, menuItem: MenuItem) {
        this.element.children[0].addEventListener('click', function () {
            if (vditor.markdown.element.style.display === 'block') {
                vditor.markdown.element.style.display = 'none'
                this.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`
            } else {
                vditor.markdown.element.style.display = 'block'
                this.className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`
                vditor.markdown.render(vditor)
            }
        })
    }
}