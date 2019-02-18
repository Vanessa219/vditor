import boldSVG from "../../assets/icons/bold.svg";
import {MenuItem} from "./MenuItem";

export class Bold extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || boldSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
