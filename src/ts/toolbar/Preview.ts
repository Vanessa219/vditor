import previewSVG from "../../assets/icons/preview.svg";
import {getEventName} from "../util/getEventName";
import {setPreviewMode} from "../util/setPreviewMode";
import {MenuItem} from "./MenuItem";

export class Preview extends MenuItem {
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
        this.element.children[0].innerHTML = menuItem.icon || previewSVG;
        if (vditor.currentPreviewMode === "preview") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentPreviewMode === "preview") {
                setPreviewMode("editor", vditor);
            } else {
                setPreviewMode("preview", vditor);
            }
            event.preventDefault();
        });
    }
}
