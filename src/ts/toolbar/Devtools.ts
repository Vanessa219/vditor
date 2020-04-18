import {setPadding} from "../ui/initUI";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Devtools extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.addEventListener(getEventName(), (event) => {
            event.preventDefault();
            if (this.element.children[0].classList.contains("vditor-menu--current")) {
                this.element.children[0].classList.remove("vditor-menu--current");
                vditor.devtools.element.style.display = "none";
                setPadding(vditor);
            } else {
                this.element.children[0].classList.add("vditor-menu--current");
                vditor.devtools.element.style.display = "block";
                setPadding(vditor);
                vditor.devtools.renderEchart(vditor);
            }
        });
    }
}
