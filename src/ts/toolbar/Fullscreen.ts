import fullscreenSVG from "../../assets/icons/fullscreen.svg";
import contractSVG from "../../assets/icons/contract.svg";
import {MenuItemClass} from "./MenuItemClass";

export class Fullscreen extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || fullscreenSVG
        this._bindEvent(vditor, menuItem)
    }

    _bindEvent(vditor: Vditor, menuItem:MenuItem) {
        this.element.children[0].addEventListener('click', function() {
            const vditorElement = document.getElementById(vditor.id)
            if (vditorElement.className.indexOf('vditor--fullscreen') > -1) {
                this.innerHTML = menuItem.icon || fullscreenSVG
                vditorElement.className = vditorElement.className.replace(' vditor--fullscreen', '')
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace('__s', '__n')
                    }
                })
            } else {
                this.innerHTML = menuItem.icon || contractSVG
                vditorElement.className = vditorElement.className + ' vditor--fullscreen'
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace('__n', '__s')
                    }
                })
            }
        })
    }
}