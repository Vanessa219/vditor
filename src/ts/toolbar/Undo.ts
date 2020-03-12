import undoSVG from "../../assets/icons/undo.svg";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {disableToolbar} from "./setToolbar";

export class Undo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || undoSVG;
        disableToolbar({undo: this.element}, ["undo"]);
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains("vditor-menu--disabled")) {
                return;
            }
            if (vditor.currentMode === "markdown") {
                vditor.undo.undo(vditor);
            } else {
                vditor.wysiwygUndo.undo(vditor);
            }
            event.preventDefault();
        });
    }
}
