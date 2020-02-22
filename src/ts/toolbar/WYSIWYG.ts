import editSVG from "../../assets/icons/edit.svg";
import {formatRender} from "../editor/formatRender";
import {getEventName} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {enableToolbar} from "./enableToolbar";
import {MenuItem} from "./MenuItem";
import {removeCurrentToolbar} from "./removeCurrentToolbar";

export class WYSIWYG extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        this.element.children[0].innerHTML = menuItem.icon || editSVG;
        if (vditor.currentMode === "markdown") {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition}`;
        } else {
            this.element.children[0].className =
                `vditor-tooltipped vditor-tooltipped__${menuItem.tipPosition} vditor-menu--current`;
        }

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), function(event) {
            if (this.classList.contains("vditor-menu--current")) {
                this.classList.remove("vditor-menu--current");
                vditor.wysiwyg.element.parentElement.style.display = "none";
                if (vditor.currentPreviewMode === "both") {
                    vditor.editor.element.style.display = "block";
                    vditor.preview.element.style.display = "block";
                } else if (vditor.currentPreviewMode === "preview") {
                    vditor.preview.element.style.display = "block";
                } else if (vditor.currentPreviewMode === "editor") {
                    vditor.editor.element.style.display = "block";
                }
                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "block";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "block";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "block";
                }
                const wysiwygMD = getMarkdown(vditor);
                vditor.currentMode = "markdown";
                formatRender(vditor, wysiwygMD, undefined);
                vditor.editor.element.focus();

                removeCurrentToolbar(vditor.toolbar.elements,  ["headings", "bold", "italic", "strike", "line", "quote",
                    "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
                enableToolbar(vditor.toolbar.elements,
                    ["headings", "bold", "italic", "strike", "line", "quote",
                        "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
            } else {
                this.classList.add("vditor-menu--current");
                vditor.editor.element.style.display = "none";
                vditor.preview.element.style.display = "none";
                vditor.wysiwyg.element.parentElement.style.display = "block";

                if (vditor.toolbar.elements.format) {
                    vditor.toolbar.elements.format.style.display = "none";
                }
                if (vditor.toolbar.elements.both) {
                    vditor.toolbar.elements.both.style.display = "none";
                }
                if (vditor.toolbar.elements.preview) {
                    vditor.toolbar.elements.preview.style.display = "none";
                }
                const editorMD = getMarkdown(vditor);
                vditor.currentMode = "wysiwyg";
                renderDomByMd(vditor, editorMD);
                vditor.wysiwyg.element.focus();
                vditor.wysiwyg.popover.style.display = "none";
            }

            if (vditor.hint) {
                vditor.hint.element.style.display = "none";
            }
            if (vditor.toolbar.elements.headings) {
                (vditor.toolbar.elements.headings.children[1] as HTMLElement).style.display = "none";
            }
            if (vditor.toolbar.elements.emoji) {
                (vditor.toolbar.elements.emoji.children[1] as HTMLElement).style.display = "none";
            }
            if (vditor.devtools && vditor.devtools.ASTChart && vditor.devtools.element.style.display === "block") {
                vditor.devtools.ASTChart.resize();
            }

            event.preventDefault();
        });
    }
}
