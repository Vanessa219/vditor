import previewSVG from "../../assets/icons/preview.svg";
import {getEventName} from "../util/getEventName";
import {MenuItem} from "./MenuItem";

export class Preview extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        const hasWYSIWYG = vditor.options.toolbar.find((item: IMenuItem) => {
            if (item.name === 'wysiwyg') {
                return true
            }
        })
        if (vditor.options.mode === "wysiwyg" && hasWYSIWYG) {
            this.element.style.display = 'none'
        }
        this.element.children[0].innerHTML = menuItem.icon || previewSVG;
        if (vditor.options.preview.mode === "preview") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }
        this._bindEvent(vditor, menuItem);
    }

    public _bindEvent(vditor: IVditor, menuItem: IMenuItem) {
        this.element.children[0].addEventListener(getEventName(), function () {
            const vditorElement = document.getElementById(vditor.id);
            let className;
            if (vditor.preview.element.className === "vditor-preview vditor-preview--preview") {
                vditor.preview.element.className = "vditor-preview vditor-preview--editor";
                className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;
            } else {
                vditor.preview.element.className = "vditor-preview vditor-preview--preview";
                className = `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
                vditor.preview.render(vditor);
                vditor.editor.element.blur();
            }
            if (vditorElement.className.indexOf("vditor--fullscreen") > -1) {
                className = className.replace("__n", "__s");
            }
            this.className = className;

            if (vditor.toolbar.elements.both &&
                vditor.toolbar.elements.both.children[0].className.indexOf("vditor-menu--current") > -1) {
                vditor.toolbar.elements.both.children[0].className =
                    vditor.toolbar.elements.both.children[0].className.replace(" vditor-menu--current", "");
            }
        });
    }
}
