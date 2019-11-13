import redoSVG from "../../assets/icons/redo.svg";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Redo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || redoSVG;
        this.element.children[0].classList.add("vditor-menu--disabled");
        this.element.children[0].addEventListener(getEventName(), (event) => {
            vditor.undo.redo(vditor);
            event.preventDefault();
        });
    }
}
