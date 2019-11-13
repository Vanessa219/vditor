import undoSVG from "../../assets/icons/undo.svg";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Undo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || undoSVG;
        this.element.children[0].classList.add("vditor-menu--disabled");
        this.element.children[0].addEventListener(getEventName(), (event) => {
            vditor.undo.undo(vditor);
            event.preventDefault();
        });
    }
}
