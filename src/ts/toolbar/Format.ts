import formatSVG from "../../assets/icons/format.svg";
import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {getEventName} from "../util/getEventName";
import {getText} from "../util/getText";
import {MenuItem} from "./MenuItem";

export class Format extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        const hasWYSIWYG = vditor.options.toolbar.find((item: IMenuItem) => {
            if (item.name === "wysiwyg") {
                return true;
            }
        });
        if (vditor.currentMode === "wysiwyg" && hasWYSIWYG) {
            this.element.style.display = "none";
        }
        this.element.children[0].innerHTML = menuItem.icon || formatSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            const formatResult = vditor.lute.FormatStr("", getText(vditor.editor.element, vditor.currentMode));
            formatRender(vditor, formatResult[0] || formatResult[1],
                getSelectPosition(vditor.editor.element, vditor.editor.range));
            event.preventDefault();
        });
    }
}
