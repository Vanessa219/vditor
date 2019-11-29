import helpSVG from "../../assets/icons/help.svg";
import {getEventName} from "../util/getEventName";
import {openURL} from "../util/openURL";
import {MenuItem} from "./MenuItem";

export class Help extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || helpSVG;
        this.element.children[0].addEventListener(getEventName(), () => {
            openURL("https://hacpai.com/guide/markdown");
        });
    }
}
