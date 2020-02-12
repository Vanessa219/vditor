import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Custom extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            menuItem.click();
            event.preventDefault();
        });
    }
}
