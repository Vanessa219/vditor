import {setPreviewMode} from "../ui/setPreviewMode";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Both extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        if (vditor.options.preview.mode === "both") {
            this.element.children[0].classList.add("vditor-menu--current");
        }
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            if (vditor.currentMode !== "sv") {
                return;
            }
            if (vditor.currentPreviewMode === "both") {
                setPreviewMode("editor", vditor);
            } else {
                setPreviewMode("both", vditor);
            }
        });
    }
}
