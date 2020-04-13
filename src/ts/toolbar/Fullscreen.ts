import contractSVG from "../../assets/icons/contract.svg";
import fullscreenSVG from "../../assets/icons/fullscreen.svg";
import {setPadding, setTypewriterPosition} from "../ui/initUI";
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
            if (vditor.element.className.includes("vditor--fullscreen")) {
                this.innerHTML = menuItem.icon || fullscreenSVG;
                vditor.element.classList.remove("vditor--fullscreen");
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__s", "__n");
                    }
                });
                vditor.counter.element.className = vditor.counter.element.className.replace("__s", "__n");
            } else {
                this.innerHTML = menuItem.icon || contractSVG;
                vditor.element.classList.add("vditor--fullscreen");
                Object.keys(vditor.toolbar.elements).forEach((key) => {
                    const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
                    if (svgElement) {
                        svgElement.className = svgElement.className.replace("__n", "__s");
                    }
                });
                vditor.counter.element.className = vditor.counter.element.className.replace("__n", "__s");
            }

            if (vditor.devtools) {
                vditor.devtools.renderEchart(vditor);
            }

            if (menuItem.click) {
                menuItem.click(vditor.element.classList.contains("vditor--fullscreen"));
            }

            setPadding(vditor);

            setTypewriterPosition(vditor);
        });
    }
}
