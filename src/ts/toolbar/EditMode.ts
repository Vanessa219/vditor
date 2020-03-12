import editSVG from "../../assets/icons/edit.svg";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {MenuItem} from "./MenuItem";
import {hidePanel} from "./setToolbar";

export class EditMode extends MenuItem {
    public element: HTMLElement;
    public panelElement: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || editSVG;

        this.panelElement = document.createElement("div");
        this.panelElement.className = "vditor-hint vditor-arrow";
        this.panelElement.innerHTML = `<button data-value="wysiwyg">WYSIWYG &lt;${updateHotkeyTip("⌘-⌥-7")}></button>
<button data-value="ir">Instant Rendering &lt;${updateHotkeyTip("⌘-⌥-8")}></button>
<button data-value="markdown">Markdown &lt;${updateHotkeyTip("⌘-⌥-9")}></button>`;

        this.element.appendChild(this.panelElement);

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains("vditor-menu--disabled")) {
                return;
            }

            if (this.panelElement.style.display === "block") {
                this.panelElement.style.display = "none";
            } else {
                this.panelElement.style.display = "block";
            }
            hidePanel(vditor, ["hint", "headings", "emoji"]);
            event.preventDefault();
        });

        // this.element.children[0].addEventListener(getEventName(), function(event) {
        //     if (this.classList.contains("vditor-menu--disabled")) {
        //         return;
        //     }
        //     if (vditor.currentMode === "wysiwyg") {
        //         vditor.toolbar.element.style.display = "block";
        //         vditor.currentMode = "ir";
        //     } else if (vditor.currentMode === "ir") {
        //         vditor.toolbar.element.style.display = "none";
        //         this.classList.remove("vditor-menu--current");
        //         vditor.wysiwyg.element.parentElement.style.display = "none";
        //         if (vditor.currentPreviewMode === "both") {
        //             vditor.editor.element.style.display = "block";
        //             vditor.preview.element.style.display = "block";
        //         } else if (vditor.currentPreviewMode === "preview") {
        //             vditor.preview.element.style.display = "block";
        //         } else if (vditor.currentPreviewMode === "editor") {
        //             vditor.editor.element.style.display = "block";
        //         }
        //         if (vditor.toolbar.elements.format) {
        //             vditor.toolbar.elements.format.style.display = "block";
        //         }
        //         if (vditor.toolbar.elements.both) {
        //             vditor.toolbar.elements.both.style.display = "block";
        //         }
        //         if (vditor.toolbar.elements.preview) {
        //             vditor.toolbar.elements.preview.style.display = "block";
        //         }
        //         const wysiwygMD = getMarkdown(vditor);
        //         vditor.currentMode = "markdown";
        //         formatRender(vditor, wysiwygMD, undefined);
        //         vditor.editor.element.focus();
        //
        //         removeCurrentToolbar(vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
        //             "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
        //         enableToolbar(vditor.toolbar.elements,
        //             ["headings", "bold", "italic", "strike", "line", "quote",
        //                 "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
        //     } else if (vditor.currentMode === "markdown") {
        //         vditor.toolbar.element.style.display = "block";
        //         vditor.currentMode = "wysiwyg";
        //     }

            // if (this.classList.contains("vditor-menu--current")) {
            //     this.classList.remove("vditor-menu--current");
            //     vditor.wysiwyg.element.parentElement.style.display = "none";
            //     if (vditor.currentPreviewMode === "both") {
            //         vditor.editor.element.style.display = "block";
            //         vditor.preview.element.style.display = "block";
            //     } else if (vditor.currentPreviewMode === "preview") {
            //         vditor.preview.element.style.display = "block";
            //     } else if (vditor.currentPreviewMode === "editor") {
            //         vditor.editor.element.style.display = "block";
            //     }
            //     if (vditor.toolbar.elements.format) {
            //         vditor.toolbar.elements.format.style.display = "block";
            //     }
            //     if (vditor.toolbar.elements.both) {
            //         vditor.toolbar.elements.both.style.display = "block";
            //     }
            //     if (vditor.toolbar.elements.preview) {
            //         vditor.toolbar.elements.preview.style.display = "block";
            //     }
            //     const wysiwygMD = getMarkdown(vditor);
            //     vditor.currentMode = "markdown";
            //     formatRender(vditor, wysiwygMD, undefined);
            //     vditor.editor.element.focus();
            //
            //     removeCurrentToolbar
            //     (vditor.toolbar.elements, ["headings", "bold", "italic", "strike", "line", "quote",
            //         "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
            //     enableToolbar(vditor.toolbar.elements,
            //         ["headings", "bold", "italic", "strike", "line", "quote",
            //          "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"]);
            // } else {
            //     this.classList.add("vditor-menu--current");
            //     vditor.editor.element.style.display = "none";
            //     vditor.preview.element.style.display = "none";
            //     vditor.wysiwyg.element.parentElement.style.display = "block";
            //
            //     if (vditor.toolbar.elements.format) {
            //         vditor.toolbar.elements.format.style.display = "none";
            //     }
            //     if (vditor.toolbar.elements.both) {
            //         vditor.toolbar.elements.both.style.display = "none";
            //     }
            //     if (vditor.toolbar.elements.preview) {
            //         vditor.toolbar.elements.preview.style.display = "none";
            //     }
            //     const editorMD = getMarkdown(vditor);
            //     vditor.currentMode = "wysiwyg";
            //     renderDomByMd(vditor, editorMD);
            //     vditor.wysiwyg.element.focus();
            //     vditor.wysiwyg.popover.style.display = "none";
            // }

        //     hidePanel(vditor, ["hint", "headings", "emoji"]);
        //     if (vditor.devtools && vditor.devtools.ASTChart && vditor.devtools.element.style.display === "block") {
        //         vditor.devtools.ASTChart.resize();
        //     }
        //
        //     event.preventDefault();
        // });
    }
}
