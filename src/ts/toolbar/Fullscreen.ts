import contractSVG from "../../assets/icons/contract.svg";
import fullscreenSVG from "../../assets/icons/fullscreen.svg";
import {MenuItem} from "./MenuItem";

export class Fullscreen extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || fullscreenSVG;
        this._bindEvent(vditor, menuItem);
    }

    public _bindEvent(vditor: IVditor, menuItem: IMenuItem) {
        this.element.children[0].addEventListener("click", function() {
            const vditorElement = document.getElementById(vditor.id);
            if (vditorElement.className.indexOf("vditor--fullscreen") > -1) {
                this.innerHTML = menuItem.icon || fullscreenSVG;
                vditorElement.className = vditorElement.className.replace(" vditor--fullscreen", "");
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement  = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__s", "__n");
                    }
                });
            } else {
                this.innerHTML = menuItem.icon || contractSVG;
                vditorElement.className = vditorElement.className + " vditor--fullscreen";
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__n", "__s");
                    }
                });
            }
        });
    }
}
