import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {Constants} from "../constants";

export class Custom extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon;
        this.element.children[0].addEventListener(getEventName(), (event: Event & { currentTarget: HTMLElement }) => {
            event.preventDefault();
            if (event.currentTarget.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }
            menuItem.click(event, vditor);
        });
    }
}
