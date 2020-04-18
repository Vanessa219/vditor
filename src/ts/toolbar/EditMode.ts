import {Constants} from "../constants";
import {i18n} from "../i18n";
import {highlightToolbar as IRHighlightToolbar} from "../ir/highlightToolbar";
import {processAfterRender} from "../ir/process";
import {formatRender} from "../sv/formatRender";
import {setPadding, setTypewriterPosition} from "../ui/initUI";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {renderOutline} from "../util/fixBrowserBehavior";
import {getMarkdown} from "../util/getMarkdown";
import {processCodeRender} from "../util/processCode";
import {highlightToolbar} from "../wysiwyg/highlightToolbar";
import {renderDomByMd} from "../wysiwyg/renderDomByMd";
import {MenuItem} from "./MenuItem";
import {disableToolbar, enableToolbar, hidePanel, hideToolbar, removeCurrentToolbar, showToolbar} from "./setToolbar";

export const setEditMode = (vditor: IVditor, type: string, event: Event | string) => {
    let markdownText;
    if (typeof event !== "string") {
        hidePanel(vditor, ["hint", "headings", "emoji", "submenu"]);
        event.preventDefault();
        markdownText = getMarkdown(vditor);
    } else {
        markdownText = event;
    }
    if (vditor.currentMode === type && typeof event !== "string") {
        return;
    }
    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
    if (vditor.preview) {
        if ((vditor.currentPreviewMode === "both" || vditor.currentPreviewMode === "preview") && type === "sv") {
            vditor.preview.element.style.display = "block";
        } else {
            vditor.preview.element.style.display = "none";
        }
    }

    enableToolbar(vditor.toolbar.elements, Constants.TOOLBARS);
    removeCurrentToolbar(vditor.toolbar.elements, Constants.TOOLBARS);
    disableToolbar(vditor.toolbar.elements, ["outdent", "indent"]);

    if (type === "ir") {
        hideToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        showToolbar(vditor.toolbar.elements, ["outdent", "indent", "outline", "insert-before", "insert-after"]);
        vditor.irUndo.resetIcon(vditor);
        vditor.sv.element.style.display = "none";
        vditor.wysiwyg.element.parentElement.style.display = "none";
        vditor.ir.element.parentElement.style.display = "block";

        vditor.currentMode = "ir";
        vditor.ir.element.innerHTML = vditor.lute.Md2VditorIRDOM(markdownText);
        processAfterRender(vditor, {
            enableAddUndoStack: true,
            enableHint: false,
            enableInput: false,
        });

        if (typeof event !== "string") {
            // 初始化不 focus
            vditor.ir.element.focus();
            IRHighlightToolbar(vditor);
        }

        if (vditor.toolbar.elements.outline && vditor.toolbar.elements.outline.firstElementChild.classList.contains("vditor-menu--current")) {
            vditor.element.querySelector(".vditor-outline").setAttribute("style", "display:block");
            renderOutline(vditor);
        }

        setPadding(vditor);

        vditor.ir.element.querySelectorAll(".vditor-ir__preview[data-render='2']").forEach((item: HTMLElement) => {
            processCodeRender(item, vditor);
        });
    } else if (type === "wysiwyg") {
        hideToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        showToolbar(vditor.toolbar.elements, ["outdent", "indent", "outline", "insert-before", "insert-after"]);
        vditor.wysiwygUndo.resetIcon(vditor);
        vditor.sv.element.style.display = "none";
        vditor.wysiwyg.element.parentElement.style.display = "block";
        vditor.ir.element.parentElement.style.display = "none";

        vditor.currentMode = "wysiwyg";

        if (vditor.toolbar.elements.outline && vditor.toolbar.elements.outline.firstElementChild.classList.contains("vditor-menu--current")) {
            vditor.element.querySelector(".vditor-outline").setAttribute("style", "display:block");
            renderOutline(vditor);
        }

        setPadding(vditor);
        renderDomByMd(vditor, markdownText, false);

        if (typeof event !== "string") {
            // 初始化不 focus
            vditor.wysiwyg.element.focus();
            highlightToolbar(vditor);
        }
        vditor.wysiwyg.popover.style.display = "none";
    } else if (type === "sv") {
        showToolbar(vditor.toolbar.elements, ["format", "both", "preview"]);
        hideToolbar(vditor.toolbar.elements, ["outdent", "indent", "outline", "insert-before", "insert-after"]);
        vditor.undo.resetIcon(vditor);
        vditor.wysiwyg.element.parentElement.style.display = "none";
        vditor.ir.element.parentElement.style.display = "none";
        if (vditor.currentPreviewMode === "both") {
            vditor.sv.element.style.display = "block";
        } else if (vditor.currentPreviewMode === "preview") {
            vditor.sv.element.style.display = "none";
        } else if (vditor.currentPreviewMode === "editor") {
            vditor.sv.element.style.display = "block";
        }
        vditor.currentMode = "sv";
        formatRender(vditor, markdownText, undefined, {
            enableAddUndoStack: true,
            enableHint: false,
            enableInput: false,
        });
        if (vditor.toolbar.elements.outline && type === "sv") {
            vditor.element.querySelector(".vditor-outline").setAttribute("style", "display:none");
        }
        if (typeof event !== "string") {
            // 初始化不 focus
            vditor.sv.element.focus();
        }
        setPadding(vditor);
    }
    setTypewriterPosition(vditor);
};

export class EditMode extends MenuItem {
    public element: HTMLElement;
    public panelElement: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        this.panelElement = document.createElement("div");
        this.panelElement.className = "vditor-hint vditor-panel--side";
        this.panelElement.innerHTML = `<button>${i18n[vditor.options.lang].wysiwyg} &lt;${updateHotkeyTip("⌘-⌥-7")}></button>
<button>${i18n[vditor.options.lang].instantRendering} &lt;${updateHotkeyTip("⌘-⌥-8")}></button>
<button>${i18n[vditor.options.lang].splitView} &lt;${updateHotkeyTip("⌘-⌥-9")}></button>`;

        this.element.appendChild(this.panelElement);

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.addEventListener("mouseover", (event) => {
            this.panelElement.style.display = "block";
        });
        this.element.addEventListener("mouseout", (event) => {
            this.panelElement.style.display = "none";
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
