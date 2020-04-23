import {Constants} from "../constants";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {disableToolbar, enableToolbar, hidePanel} from "./setToolbar";

export class Preview extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            const btnElement = this.element.firstElementChild;
            if (btnElement.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }

            const toolbars = Constants.EDIT_TOOLBARS.concat(["both", "format", "edit-mode", "outline", "devtools"]);
            if (btnElement.classList.contains("vditor-menu--current")) {
                vditor.preview.element.classList.remove("vditor-preview--only");
                btnElement.classList.remove("vditor-menu--current");
                if (vditor.currentMode !== "sv" ||
                    (vditor.currentMode === "sv" && vditor.options.preview.mode !== "both")) {
                    vditor.preview.element.style.display = "none";
                }
                enableToolbar(vditor.toolbar.elements, toolbars);
            } else {
                disableToolbar(vditor.toolbar.elements, toolbars);
                vditor.preview.element.style.display = "block";
                vditor.preview.render(vditor);
                vditor.preview.element.classList.add("vditor-preview--only");
                btnElement.classList.add("vditor-menu--current");
                hidePanel(vditor, ["subToolbar", "hint", "popover"]);
            }
        });
    }
}
