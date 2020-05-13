import {Constants} from "../constants";
import {setPadding} from "../ui/initUI";
import {getEventName} from "../util/compatibility";
import {renderOutline} from "../util/fixBrowserBehavior";
import {MenuItem} from "./MenuItem";

export const toggleOutline = (vditor: IVditor, show = true) => {
    const btnElement = vditor.toolbar.elements.outline.firstElementChild;
    if (btnElement.classList.contains(Constants.CLASS_MENU_DISABLED)) {
        return;
    }

    const outlineElement = vditor.element.querySelector(".vditor-outline") as HTMLElement;
    if (show) {
        outlineElement.style.display = "block";
        renderOutline(vditor);
        btnElement.classList.add("vditor-menu--current");
    } else {
        outlineElement.style.display = "none";
        btnElement.classList.remove("vditor-menu--current");
    }
    setPadding(vditor);
};

export class Outline extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        if (vditor.options.outline) {
            this.element.firstElementChild.classList.add("vditor-menu--current");
        }
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            vditor.options.outline = !this.element.firstElementChild.classList.contains("vditor-menu--current");
            toggleOutline(vditor, vditor.options.outline);
        });
    }
}
