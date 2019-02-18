import redoSVG from "../../assets/icons/redo.svg";
import {MenuItem} from "./MenuItem";

export class Redo extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || redoSVG;
        this.bindEvent();
    }

    public bindEvent() {
        this.element.children[0].addEventListener("click", () => {
            document.execCommand("redo");
        });
    }
}
