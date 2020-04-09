import indentSVG from "../../assets/icons/indent.svg";
import {MenuItem} from "./MenuItem";
import {getEventName} from "../util/compatibility";
import {Constants} from "../constants";
import {getEditorRange} from "../util/selection";
import {listIndent} from "../util/fixBrowserBehavior";
import {hasClosestByMatchTag} from "../util/hasClosest";

export class Indent extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || indentSVG;

        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED) ||
                vditor.currentMode === "sv") {
                return;
            }
            const range = getEditorRange(vditor[vditor.currentMode].element);
            const liElement = hasClosestByMatchTag(range.startContainer, "LI")
            if (liElement) {
                listIndent(vditor, liElement, range, liElement.parentElement);
            }
            event.preventDefault();
        });
    }
}
