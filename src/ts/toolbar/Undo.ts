import undoSVG from "../../assets/icons/undo.svg";
import {MenuItem} from "./MenuItem";

export class Undo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || undoSVG;
        this.bindEvent();
    }

    public bindEvent() {
        this.element.children[0].addEventListener("click", () => {
            document.execCommand("undo");
        });
    }
}
