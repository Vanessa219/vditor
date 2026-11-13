import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Find extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, {...menuItem, tip: menuItem.tip || window.VditorI18n.find || "Find"});
        this.element.firstElementChild.addEventListener(getEventName(), event => {
            event.preventDefault();
            vditor.find.open();
        });
    }
}
