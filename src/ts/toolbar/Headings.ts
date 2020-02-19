import headingsSVG from "../../assets/icons/headings.svg";
import {insertText} from "../editor/insertText";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {removeHeading, setHeading} from "../wysiwyg/setHeading";
import {MenuItem} from "./MenuItem";

export class Headings extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || headingsSVG;

        const headingsPanelElement = document.createElement("div");
        headingsPanelElement.className = "vditor-hint vditor-arrow";
        headingsPanelElement.innerHTML = `<button data-tag="h1" data-value="# ">Heading 1 ${updateHotkeyTip("&lt;⌘-⌥-1>")}</button>
<button data-tag="h2" data-value="## ">Heading 2 ${updateHotkeyTip("&lt;⌘-⌥-2>")}</button>
<button data-tag="h3" data-value="### ">Heading 3 ${updateHotkeyTip("&lt;⌘-⌥-3>")}</button>
<button data-tag="h4" data-value="#### ">Heading 4 ${updateHotkeyTip("&lt;⌘-⌥-4>")}</button>
<button data-tag="h5" data-value="##### ">Heading 5 ${updateHotkeyTip("&lt;⌘-⌥-5>")}</button>
<button data-tag="h6" data-value="###### ">Heading 6 ${updateHotkeyTip("&lt;⌘-⌥-6>")}</button>`;

        this.element.appendChild(headingsPanelElement);

        this._bindEvent(headingsPanelElement, vditor);
    }

    public _bindEvent(headingsPanelElement: HTMLElement, vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            const actionBtn = this.element.children[0];
            if (vditor.currentMode === "wysiwyg" && actionBtn.classList.contains("vditor-menu--current")) {
                removeHeading(vditor);
                afterRenderEvent(vditor);
            } else {
                if (headingsPanelElement.style.display === "block") {
                    headingsPanelElement.style.display = "none";
                } else {
                    headingsPanelElement.style.display = "block";
                    if (vditor.toolbar.elements.emoji) {
                        const panel = vditor.toolbar.elements.emoji.children[1] as HTMLElement;
                        panel.style.display = "none";
                    }
                }
            }
            if (vditor.hint) {
                vditor.hint.element.style.display = "none";
            }
            event.preventDefault();
        });

        for (let i = 0; i < 6; i++) {
            headingsPanelElement.children.item(i).addEventListener(getEventName(), (event: Event) => {
                if (vditor.currentMode === "wysiwyg") {
                    setHeading(vditor, (event.target as HTMLElement).getAttribute("data-tag"));
                    afterRenderEvent(vditor);
                } else {
                    insertText(vditor, (event.target as HTMLElement).getAttribute("data-value"), "",
                        false, true);
                }
                headingsPanelElement.style.display = "none";
                event.preventDefault();
            });
        }
    }
}
