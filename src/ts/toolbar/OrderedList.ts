import orderedListVG from "../../assets/icons/ordered-list.svg";
import {MenuItem} from "./MenuItem";

export class OrderedList extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || orderedListVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
