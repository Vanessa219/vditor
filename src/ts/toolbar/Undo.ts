import undoSVG from "../../assets/icons/undo.svg";
import {Constants} from "../constants";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {disableToolbar} from "./setToolbar";

export class Undo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || undoSVG;
        disableToolbar({undo: this.element}, ["undo"]);
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }
            if (vditor.currentMode === "sv") {
                vditor.undo.undo(vditor);
            } else if (vditor.currentMode === "wysiwyg") {
                vditor.wysiwygUndo.undo(vditor);
            } else if (vditor.currentMode === "ir") {
                vditor.irUndo.undo(vditor);
            }
            event.preventDefault();
        });
    }
}
