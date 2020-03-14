import editSVG from "../../assets/icons/edit.svg";
import {formatRender} from "../editor/formatRender";
import {processAfterRender} from "../ir/process";
import {setPadding} from "../ui/initUI";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {MenuItem} from "./MenuItem";
import {enableToolbar, hidePanel, hideToolbar, removeCurrentToolbar, showToolbar} from "./setToolbar";

export const setEditMode = (event: Event, vditor: IVditor, type: string) => {
    event.preventDefault();
    // wysiwyg
    hidePanel(vditor, ["hint", "headings", "emoji", "edit-mode"]);
    if (vditor.currentMode === type) {
        return;
    }
    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
    const allToolbar = ["emoji", "headings", "bold", "italic", "strike", "line", "quote", "undo", "redo",
        "list", "ordered-list", "check", "code", "inline-code", "upload", "link", "table", "record"];

    if (type === "ir") {
        hideToolbar(vditor.toolbar.elements, allToolbar.concat(["format", "both", "preview"]));
        vditor.editor.element.style.display = "none";
        vditor.preview.element.style.display = "none";
        vditor.wysiwyg.element.parentElement.style.display = "none";
        vditor.ir.element.parentElement.style.display = "block";

        const editorMD = getMarkdown(vditor);
        vditor.currentMode = "ir";
        vditor.ir.element.innerHTML = vditor.lute.Md2VditorIRDOM(editorMD);
        processAfterRender(vditor, {
            enableAddUndoStack: true,
            enableHint: false,
            enableInput: false,
        });
        vditor.ir.element.focus();
        setPadding(vditor);
    } else if (type === "wysiwyg") {
        showToolbar(vditor.toolbar.elements, allToolbar)
        hideToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        vditor.editor.element.style.display = "none";
        vditor.preview.element.style.display = "none";
        vditor.wysiwyg.element.parentElement.style.display = "block";
        vditor.ir.element.parentElement.style.display = "none";

        const editorMD = getMarkdown(vditor);
        vditor.currentMode = "wysiwyg";
        renderDomByMd(vditor, editorMD);
        vditor.wysiwyg.element.focus();
        vditor.wysiwyg.popover.style.display = "none";
        setPadding(vditor);
    } else if (type === "markdown") {
        showToolbar(vditor.toolbar.elements, allToolbar.concat(["format", "both", "preview"]));
        removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
        enableToolbar(vditor.toolbar.elements, allToolbar);
        vditor.wysiwyg.element.parentElement.style.display = "none";
        vditor.ir.element.parentElement.style.display = "none";
        if (vditor.currentPreviewMode === "both") {
            vditor.editor.element.style.display = "block";
            vditor.preview.element.style.display = "block";
        } else if (vditor.currentPreviewMode === "preview") {
            vditor.preview.element.style.display = "block";
        } else if (vditor.currentPreviewMode === "editor") {
            vditor.editor.element.style.display = "block";
        }

        const wysiwygMD = getMarkdown(vditor);
        vditor.currentMode = "markdown";
        formatRender(vditor, wysiwygMD, undefined);
        vditor.editor.element.focus();
    }
};

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

        this.panelElement.children.item(0).addEventListener(getEventName(), (event: Event) => {
            // wysiwyg
            setEditMode(event, vditor, "wysiwyg");
        });

        this.panelElement.children.item(1).addEventListener(getEventName(), (event: Event) => {
            // ir
            setEditMode(event, vditor, "ir");
        });

        this.panelElement.children.item(2).addEventListener(getEventName(), (event: Event) => {
            // markdown
            setEditMode(event, vditor, "markdown");
        });
    }
}
