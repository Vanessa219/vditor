import inlineCodeSVG from "../../assets/icons/inline-code.svg";
import {MenuItem} from "./MenuItem";

export class InlineCode extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || inlineCodeSVG;
        this.bindEvent();
    }

    public bindEvent() {
        super.bindEvent();
    }
}
