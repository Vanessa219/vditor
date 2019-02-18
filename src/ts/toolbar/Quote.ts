import quoteSVG from "../../assets/icons/quote.svg";
import {MenuItem} from "./MenuItem";

export class Quote extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || quoteSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
