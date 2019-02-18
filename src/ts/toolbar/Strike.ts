import strikekSVG from "../../assets/icons/strike.svg";
import {MenuItem} from "./MenuItem";

export class Strike extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || strikekSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
