import editSVG from "../../assets/icons/edit.svg";
import {formatRender} from "../editor/formatRender";
import {getText} from "../editor/getText";
import {getEventName} from "../util/getEventName";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {MenuItem} from "./MenuItem";

export class WYSIWYG extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        this.element.children[0].innerHTML = menuItem.icon || editSVG;
        if (vditor.options.mode === "markdown-show") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;
        } else {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }

        this._bindEvent(vditor, menuItem);
    }

    public _bindEvent(vditor: IVditor, menuItem: IMenuItem) {
        this.element.children[0].addEventListener(getEventName(), function(event) {
            if (this.className.indexOf("vditor-menu--current") > -1) {
                this.className = this.className.replace(" vditor-menu--current", "");
                vditor.wysiwyg.element.style.display = "none";
                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "block";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "block";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "block";
                }
                const wysiwygHTML = vditor.lute.VditorDOMMarkdown(vditor.wysiwyg.element.innerHTML);
                formatRender(vditor, wysiwygHTML[0] || wysiwygHTML[1], undefined, false);
            } else {
                this.className = this.className + " vditor-menu--current";
                vditor.wysiwyg.element.style.display = "block";
                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "none";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "none";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "none";
                }

                renderDomByMd(vditor, getText(vditor.editor.element));
            }
            event.preventDefault();
        });
    }
}
