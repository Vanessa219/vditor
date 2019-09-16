import bothSVG from "../../assets/icons/both.svg";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Both extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        const hasWYSIWYG = vditor.options.toolbar.find((item: IMenuItem) => {
            if (item.name === "wysiwyg") {
                return true;
            }
        });
        if (vditor.currentMode === "wysiwyg" && hasWYSIWYG) {
            this.element.style.display = "none";
        }
        this.element.children[0].innerHTML = menuItem.icon || bothSVG;
        if (vditor.options.preview.mode === "both") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), function() {
            vditor.editor.element.style.display = "block";
            if (vditor.currentPreviewMode === "both") {
                vditor.preview.element.style.display = "none";
                this.className =  this.className.replace(" vditor-menu--current", "");
                vditor.currentPreviewMode = "editor";
            } else {
                this.className = this.className + " vditor-menu--current";
                vditor.preview.element.style.display = "block";
                vditor.preview.render(vditor);
                vditor.currentPreviewMode = "both";
            }
            if (vditor.toolbar.elements.preview &&
                vditor.toolbar.elements.preview.children[0].className.indexOf("vditor-menu--current") > -1) {
                vditor.toolbar.elements.preview.children[0].className =
                    vditor.toolbar.elements.preview.children[0].className.replace(" vditor-menu--current", "");
            }
        });
    }
}
