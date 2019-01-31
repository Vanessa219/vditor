import uploadSVG from "../../assets/icons/upload.svg";
import {MenuItemClass} from "./MenuItemClass";
import {uploadFile} from "../util/upload";

export class Upload extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = '<label>' + (menuItem.icon || uploadSVG) +
            '<input multiple="multiple" type="file"></label>'
        this._bindEvent(vditor)
    }

    _bindEvent(vditor: Vditor) {
        this.element.querySelector('input').addEventListener('change', (event: any) => {
            if (event.target.files.length === 0) {
                return
            }
            uploadFile(vditor, event.target.files, event.target)
        })
    }
}