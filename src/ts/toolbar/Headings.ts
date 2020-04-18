import {Constants} from "../constants";
import {processHeading} from "../ir/process";
import {insertText} from "../sv/insertText";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {removeHeading, setHeading} from "../wysiwyg/setHeading";
import {MenuItem} from "./MenuItem";
import {hidePanel} from "./setToolbar";

export class Headings extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const panelElement = document.createElement("div");
        panelElement.className = "vditor-hint vditor-panel--arrow";
        panelElement.innerHTML = `<button data-tag="h1" data-value="# ">Heading 1 ${updateHotkeyTip("&lt;⌘-⌥-1>")}</button>
<button data-tag="h2" data-value="## ">Heading 2 &lt;${updateHotkeyTip("⌘-⌥-2")}></button>
<button data-tag="h3" data-value="### ">Heading 3 &lt;${updateHotkeyTip("⌘-⌥-3")}></button>
<button data-tag="h4" data-value="#### ">Heading 4 &lt;${updateHotkeyTip("⌘-⌥-4")}></button>
<button data-tag="h5" data-value="##### ">Heading 5 &lt;${updateHotkeyTip("⌘-⌥-5")}></button>
<button data-tag="h6" data-value="###### ">Heading 6 &lt;${updateHotkeyTip("⌘-⌥-6")}></button>`;

        this.element.appendChild(panelElement);

        this._bindEvent(vditor, panelElement);
    }

    public _bindEvent(vditor: IVditor, panelElement: HTMLElement) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }
            (this.element.firstElementChild as HTMLElement).blur();
            const actionBtn = this.element.children[0];
            if (vditor.currentMode === "wysiwyg" && actionBtn.classList.contains("vditor-menu--current")) {
                removeHeading(vditor);
                afterRenderEvent(vditor);
            } else if (vditor.currentMode === "ir" && actionBtn.classList.contains("vditor-menu--current")) {
                processHeading(vditor, "");
            } else {
                if (panelElement.style.display === "block") {
                    panelElement.style.display = "none";
                } else {
                    panelElement.style.display = "block";
                }
            }
            hidePanel(vditor, ["hint", "emoji", "popover", "submenu"]);
        });

        for (let i = 0; i < 6; i++) {
            panelElement.children.item(i).addEventListener(getEventName(), (event: Event) => {
                event.preventDefault();
                if (vditor.currentMode === "wysiwyg") {
                    setHeading(vditor, (event.target as HTMLElement).getAttribute("data-tag"));
                    afterRenderEvent(vditor);
                } else if (vditor.currentMode === "ir") {
                    processHeading(vditor, (event.target as HTMLElement).getAttribute("data-value"));
                } else {
                    insertText(vditor, (event.target as HTMLElement).getAttribute("data-value"), "",
                        false, true);
                }
                panelElement.style.display = "none";
            });
        }
    }
}
