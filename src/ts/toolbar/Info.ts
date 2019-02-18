import infoSVG from "../../assets/icons/info.svg";
import {MenuItem} from "./MenuItem";

export class Info extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || infoSVG;
        this.bindEvent();
    }

    public bindEvent() {
        this.element.children[0].addEventListener("click", () => {
            window.open("https://github.com/b3log/vditor");
        });
    }
}
