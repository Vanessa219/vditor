import formatSVG from "../../assets/icons/format.svg";
import {MenuItem} from "./MenuItem";
import {getText} from "../editor/getText";
import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";

export class Format extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || formatSVG;
        this.element.children[0].addEventListener("click", () => {
            formatRender(vditor, lute.format(getText(vditor.editor.element)), getSelectPosition(vditor.editor.element, vditor.editor.range))
        });
    }
}
