import helpSVG from "../../assets/icons/help.svg";
import {MenuItem} from "./MenuItem";

export class Help extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || helpSVG;
        this.bindEvent();
    }

    public bindEvent() {
        this.element.children[0].addEventListener("click", () => {
            window.open("https://hacpai.com/guide/markdown");
        });
    }
}
