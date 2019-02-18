import tableSVG from "../../assets/icons/table.svg";
import {MenuItem} from "./MenuItem";

export class Table extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || tableSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
