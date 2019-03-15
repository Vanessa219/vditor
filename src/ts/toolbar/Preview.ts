import previewSVG from "../../assets/icons/preview.svg";
import {MenuItem} from "./MenuItem";

export class Preview extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || previewSVG;
        if (vditor.options.preview.show) {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor, menuItem);
    }

    public _bindEvent(vditor: IVditor, menuItem: IMenuItem) {
        this.element.children[0].addEventListener("click", function() {
            const vditorElement = document.getElementById(vditor.id);
            let className;
            if (vditor.preview.element.style.display === "block" || vditor.preview.element.style.display === "") {
                vditor.preview.element.style.display = "none";
                className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;
            } else {
                vditor.preview.element.style.display = "block";
                className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
                vditor.preview.render(vditor);
            }
            if (vditorElement.className.indexOf("vditor--fullscreen") > -1) {
                className = className.replace("__n", "__s");
            }
            this.className = className;
        });
    }
}
