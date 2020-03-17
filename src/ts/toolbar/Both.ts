import bothSVG from "../../assets/icons/both.svg";
import {setPreviewMode} from "../ui/setPreviewMode";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Both extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || bothSVG;
        if (vditor.options.preview.mode === "both") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentMode !== "sv") {
                return;
            }
            if (vditor.currentPreviewMode === "both") {
                setPreviewMode("editor", vditor);
            } else {
                setPreviewMode("both", vditor);
            }
            event.preventDefault();
        });
    }
}
