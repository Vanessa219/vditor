import formatSVG from "../../assets/icons/format.svg";
import {formatRender} from "../editor/formatRender";
import {getSelectPosition} from "../editor/getSelectPosition";
import {getText} from "../editor/getText";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Format extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        if (vditor.options.mode === "wysiwyg") {
            this.element.style.display = 'none'
        }
        this.element.children[0].innerHTML = menuItem.icon || formatSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            const formatResult = vditor.lute.FormatStr("", getText(vditor.editor.element));
            formatRender(vditor, formatResult[0] || formatResult[1],
                getSelectPosition(vditor.editor.element, vditor.editor.range));
            event.preventDefault();
        });
    }
}
