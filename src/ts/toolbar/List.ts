import listSVG from "../../assets/icons/list.svg";
import {MenuItem} from "./MenuItem";

export class List extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || listSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
