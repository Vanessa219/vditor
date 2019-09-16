import lineSVG from "../../assets/icons/line.svg";
import {MenuItem} from "./MenuItem";

export class Line extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || lineSVG;
        super.bindEvent(vditor);
    }
}
