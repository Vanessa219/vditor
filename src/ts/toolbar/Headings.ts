import headingsSVG from "../../assets/icons/headings.svg";
import {Constants} from "../constants";
import {insertText} from "../sv/insertText";
import {getEventName, updateHotkeyTip} from "../util/compatibility";
import {afterRenderEvent} from "../wysiwyg/afterRenderEvent";
import {removeHeading, setHeading} from "../wysiwyg/setHeading";
import {MenuItem} from "./MenuItem";
import {hidePanel} from "./setToolbar";

export class Headings extends MenuItem {
    public element: HTMLElement;
    public panelElement: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || headingsSVG;

        this.panelElement = document.createElement("div");
        this.panelElement.className = "vditor-hint vditor-arrow";
        this.panelElement.innerHTML = `<button data-tag="h1" data-value="# ">Heading 1 ${updateHotkeyTip("&lt;⌘-⌥-1>")}</button>
<button data-tag="h2" data-value="## ">Heading 2 &lt;${updateHotkeyTip("⌘-⌥-2")}></button>
<button data-tag="h3" data-value="### ">Heading 3 &lt;${updateHotkeyTip("⌘-⌥-3")}></button>
<button data-tag="h4" data-value="#### ">Heading 4 &lt;${updateHotkeyTip("⌘-⌥-4")}></button>
<button data-tag="h5" data-value="##### ">Heading 5 &lt;${updateHotkeyTip("⌘-⌥-5")}></button>
<button data-tag="h6" data-value="###### ">Heading 6 &lt;${updateHotkeyTip("⌘-⌥-6")}></button>`;

        this.element.appendChild(this.panelElement);

        this._bindEvent(vditor);
    }

    public _bindEvent(vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }

            const actionBtn = this.element.children[0];
            if (vditor.currentMode === "wysiwyg" && actionBtn.classList.contains("vditor-menu--current")) {
                removeHeading(vditor);
                afterRenderEvent(vditor);
            } else {
                if (this.panelElement.style.display === "block") {
                    this.panelElement.style.display = "none";
                } else {
                    this.panelElement.style.display = "block";
                }
            }
            hidePanel(vditor, ["hint", "emoji", "edit-mode"]);
            event.preventDefault();
        });

        for (let i = 0; i < 6; i++) {
            this.panelElement.children.item(i).addEventListener(getEventName(), (event: Event) => {
                if (vditor.currentMode === "wysiwyg") {
                    setHeading(vditor, (event.target as HTMLElement).getAttribute("data-tag"));
                    afterRenderEvent(vditor);
                } else {
                    insertText(vditor, (event.target as HTMLElement).getAttribute("data-value"), "",
                        false, true);
                }
                this.panelElement.style.display = "none";
                event.preventDefault();
            });
        }
    }
}
