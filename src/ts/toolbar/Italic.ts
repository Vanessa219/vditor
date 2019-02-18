import italicSVG from "../../assets/icons/italic.svg";
import {MenuItem} from "./MenuItem";

export class Italic extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || italicSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
