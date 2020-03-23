import editSVG from "../../assets/icons/edit.svg";
import {Constants} from "../constants";
import {i18n} from "../i18n";
import {processAfterRender} from "../ir/process";
import {formatRender} from "../sv/formatRender";
import {setPadding} from "../ui/initUI";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {MenuItem} from "./MenuItem";
import {disableToolbar, enableToolbar, hidePanel, hideToolbar, removeCurrentToolbar, showToolbar} from "./setToolbar";

export const setEditMode = (vditor: IVditor, type: string, event?: Event) => {
    if (event) {
        event.preventDefault();
    }
    // wysiwyg
    hidePanel(vditor, ["hint", "headings", "emoji", "edit-mode"]);
    if (vditor.currentMode === type && event) {
        return;
    }
    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
    const allToolbar = ["emoji", "headings", "bold", "italic", "strike", "link", "list", "ordered-list", "check",
        "line", "quote", "code", "inline-code", "upload", "record", "table"];

    if (type === "ir") {
        hideToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        disableToolbar(vditor.toolbar.elements, allToolbar);
        vditor.irUndo.resetIcon(vditor);
        vditor.sv.element.style.display = "none";
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

        if (event) {
            // 初始化不 focus
           vditor.ir.element.focus();
        }
        setPadding(vditor);
    } else if (type === "wysiwyg") {
        hideToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        enableToolbar(vditor.toolbar.elements, allToolbar);
        vditor.wysiwygUndo.resetIcon(vditor);
        vditor.sv.element.style.display = "none";
        vditor.preview.element.style.display = "none";
        vditor.wysiwyg.element.parentElement.style.display = "block";
        vditor.ir.element.parentElement.style.display = "none";

        const editorMD = getMarkdown(vditor);
        vditor.currentMode = "wysiwyg";
        renderDomByMd(vditor, editorMD);
        if (event) {
            // 初始化不 focus
            vditor.wysiwyg.element.focus();
        }
        vditor.wysiwyg.popover.style.display = "none";
        setPadding(vditor);
    } else if (type === "sv") {
        showToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        enableToolbar(vditor.toolbar.elements, allToolbar);
        removeCurrentToolbar(vditor.toolbar.elements, allToolbar);
        vditor.undo.resetIcon(vditor);
        vditor.wysiwyg.element.parentElement.style.display = "none";
        vditor.ir.element.parentElement.style.display = "none";
        if (vditor.currentPreviewMode === "both") {
            vditor.sv.element.style.display = "block";
            vditor.preview.element.style.display = "block";
        } else if (vditor.currentPreviewMode === "preview") {
            vditor.sv.element.style.display = "none";
            vditor.preview.element.style.display = "block";
        } else if (vditor.currentPreviewMode === "editor") {
            vditor.sv.element.style.display = "block";
            vditor.preview.element.style.display = "none";
        }

        const wysiwygMD = getMarkdown(vditor);
        vditor.currentMode = "sv";
        formatRender(vditor, wysiwygMD, undefined);
        if (event) {
            // 初始化不 focus
            vditor.sv.element.focus();
        }
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
        this.panelElement.innerHTML = `<button>${i18n[vditor.options.lang].wysiwyg} &lt;${updateHotkeyTip("⌘-⌥-7")}></button>
<button>${i18n[vditor.options.lang].instantRendering} &lt;${updateHotkeyTip("⌘-⌥-8")}></button>
<button>${i18n[vditor.options.lang].splitView} &lt;${updateHotkeyTip("⌘-⌥-9")}></button>`;

        this.element.appendChild(this.panelElement);

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
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
            setEditMode(vditor, "wysiwyg", event);
        });

        this.panelElement.children.item(1).addEventListener(getEventName(), (event: Event) => {
            // ir
            setEditMode(vditor, "ir", event);
        });

        this.panelElement.children.item(2).addEventListener(getEventName(), (event: Event) => {
            // markdown
            setEditMode(vditor, "sv", event);
        });
    }
}
