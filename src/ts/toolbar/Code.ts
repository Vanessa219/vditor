import codeSVG from "../../assets/icons/code.svg";
import {MenuItem} from "./MenuItem";

export class Code extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || codeSVG;
        super.bindEvent(vditor);
    }
}
