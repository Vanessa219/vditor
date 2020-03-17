import formatSVG from "../../assets/icons/outdent.svg";
import {formatRender} from "../sv/formatRender";
import {getEventName} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {getSelectPosition} from "../util/selection";
import {MenuItem} from "./MenuItem";

export class Format extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || formatSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            formatRender(vditor,  vditor.lute.FormatMd( getMarkdown(vditor)),
                getSelectPosition(vditor.sv.element, getSelection().getRangeAt(0)));
            event.preventDefault();
        });
    }
}
