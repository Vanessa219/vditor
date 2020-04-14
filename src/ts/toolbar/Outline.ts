import alignCenterSVG from "../../assets/icons/align-center.svg";
import {Constants} from "../constants";
import {setPadding} from "../ui/initUI";
import {getEventName} from "../util/compatibility";
import {renderOutline} from "../util/fixBrowserBehavior";
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
                outlineElement.style.display = "block";
                renderOutline(vditor);
                btnElement.classList.add("vditor-menu--current");
            }
            vditor[vditor.currentMode].element.parentElement.style.overflow = 'auto'
            setPadding(vditor);
            vditor[vditor.currentMode].element.parentElement.style.overflow = 'visible'
            event.preventDefault();
        });
    }
}
