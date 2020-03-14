import contractSVG from "../../assets/icons/contract.svg";
import fullscreenSVG from "../../assets/icons/fullscreen.svg";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Fullscreen extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || fullscreenSVG;
        this._bindEvent(vditor, menuItem);
    }

    public _bindEvent(vditor: IVditor, menuItem: IMenuItem) {
        this.element.children[0].addEventListener(getEventName(), function(event) {
            event.preventDefault();
            const vditorElement = document.getElementById(vditor.id);
            if (vditorElement.className.indexOf("vditor--fullscreen") > -1) {
                this.innerHTML = menuItem.icon || fullscreenSVG;
                vditorElement.classList.remove("vditor--fullscreen");
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__s", "__n");
                    }
                });
            } else {
                this.innerHTML = menuItem.icon || contractSVG;
                vditorElement.classList.add("vditor--fullscreen");
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__n", "__s");
                    }
                });
            }

            if (vditor.devtools) {
                vditor.devtools.renderEchart(vditor);
            }

            if (menuItem.click) {
                menuItem.click(vditorElement.classList.contains("vditor--fullscreen"));
            }
        });
    }
}
