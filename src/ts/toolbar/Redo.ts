import redoSVG from "../../assets/icons/redo.svg";
import {getEventName} from "../util/compatibility";
import {disableToolbar} from "./disableToolbar";
import {MenuItem} from "./MenuItem";

export class Redo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || redoSVG;
        disableToolbar({redo: this.element}, ["redo"]);
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (vditor.currentMode === "markdown") {
                vditor.undo.redo(vditor);
            } else {
                vditor.wysiwygUndo.redo(vditor);
            }
            event.preventDefault();
        });
    }
}
