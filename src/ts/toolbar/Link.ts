import linkSVG from "../../assets/icons/link.svg";
import {MenuItem} from "./MenuItem";

export class Link extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || linkSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
