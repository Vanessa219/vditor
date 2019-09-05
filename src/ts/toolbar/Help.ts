import helpSVG from "../../assets/icons/help.svg";
import {MenuItem} from "./MenuItem";
import {getEventName} from "../util/getEventName";

export class Help extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || helpSVG;
        this.bindEvent();
    }

    public bindEvent() {
        this.element.children[0].addEventListener(getEventName(), () => {
            window.open("https://hacpai.com/guide/markdown");
        });
    }
}
