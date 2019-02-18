import uploadSVG from "../../assets/icons/upload.svg";
import {uploadFiles} from "../upload/index";
import {MenuItem} from "./MenuItem";

export class Upload extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = "<label>" + (menuItem.icon || uploadSVG) +
            '<input multiple="multiple" type="file"></label>';
        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.querySelector("input").addEventListener("change", (event: IHTMLInputEvent) => {
            if (event.target.files.length === 0) {
                return;
            }
            uploadFiles(vditor, event.target.files, event.target);
        });
    }
}
