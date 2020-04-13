import alignCenterSVG from "../../assets/icons/align-center.svg";
import {Constants} from "../constants";
import {outlineRender} from "../markdown/outlineRender";
import {setPadding} from "../ui/initUI";
import {getEventName} from "../util/compatibility";
import {MenuItem} from "./MenuItem";

export class Outline extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || alignCenterSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            const btnElement = this.element.firstElementChild;
            if (btnElement.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }

            const outlineElement = vditor.element.querySelector(".vditor-outline") as HTMLElement;
            if (btnElement.classList.contains("vditor-menu--current")) {
                outlineElement.style.display = "none";
                btnElement.classList.remove("vditor-menu--current");
            } else {
                outlineRender(vditor[vditor.currentMode].element, vditor.element.querySelector(".vditor-outline"));
                outlineElement.style.display = "block";
                btnElement.classList.add("vditor-menu--current");
            }
            setPadding(vditor);
            event.preventDefault();
        });
    }
}
