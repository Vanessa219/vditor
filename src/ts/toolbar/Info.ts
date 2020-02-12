import infoSVG from "../../assets/icons/info.svg";
import {getEventName} from "../util/compatibility";
import {openURL} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Info extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || infoSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            openURL("https://github.com/Vanessa219/vditor");
        });
    }
}
