import previewSVG from "../../assets/icons/preview.svg";
import {setPreviewMode} from "../ui/setPreviewMode";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Preview extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || previewSVG;
        if (vditor.currentPreviewMode === "preview") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentMode === "wysiwyg") {
                return;
            }
            if (vditor.currentPreviewMode === "preview") {
                setPreviewMode("editor", vditor);
            } else {
                setPreviewMode("preview", vditor);
            }
            event.preventDefault();
        });
    }
}
