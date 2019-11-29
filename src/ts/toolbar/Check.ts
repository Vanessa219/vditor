import checkSVG from "../../assets/icons/check.svg";
import {MenuItem} from "./MenuItem";

export class Check extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || checkSVG;
        super.bindEvent(vditor);
    }
}
