import uploadSVG from "../../assets/icons/upload.svg";
import {MenuItemClass} from "./MenuItemClass";
import {uploadFiles} from "../upload/index"

export class Upload extends MenuItemClass {
    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = '<label>' + (menuItem.icon || uploadSVG) +
            '<input multiple="multiple" type="file"></label>'
        this._bindEvent(vditor)
    }

    _bindEvent(vditor: Vditor) {
        this.element.querySelector('input').addEventListener('change', (event: HTMLInputEvent) => {
            if (event.target.files.length === 0) {
                return
            }
            uploadFiles(vditor, event.target.files, event.target)
        })
    }
}