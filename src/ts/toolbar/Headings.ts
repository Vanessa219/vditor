import {Constants} from "../constants";
import {processHeading} from "../ir/process";
import {processHeading as processHeadingSV} from "../sv/process";
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
        panelElement.innerHTML = Array.from({length: 6}, (_, index) => {
            const level = index + 1;
            return `<button data-tag="h${level}" data-value="${"#".repeat(level)} ">${window.VditorI18n[`heading${level}`]}<span class="vditor-hint__hotkey"> &lt;${updateHotkeyTip(`⌥⌘${level}`)}></span></button>`;
        }).join("");

        this.element.appendChild(panelElement);

        this._bindEvent(vditor, panelElement);
    }

    public _bindEvent(vditor: IVditor, panelElement: HTMLElement) {
        const actionBtn = this.element.children[0] as HTMLElement;
        actionBtn.addEventListener(getEventName(), (event) => {
            event.preventDefault();
            // https://github.com/Vanessa219/vditor/issues/1391
            clearTimeout(vditor.wysiwyg.afterRenderTimeoutId);
            clearTimeout(vditor.ir.processTimeoutId);
            clearTimeout(vditor.sv.processTimeoutId);
            if (actionBtn.classList.contains(Constants.CLASS_MENU_DISABLED)) {
                return;
            }
            actionBtn.blur();
            if (actionBtn.classList.contains("vditor-menu--current")) {
                if (vditor.currentMode === "wysiwyg") {
                    removeHeading(vditor);
                    afterRenderEvent(vditor);
                } else if (vditor.currentMode === "ir") {
                    processHeading(vditor, "");
                }
                actionBtn.classList.remove("vditor-menu--current");
            } else {
                hidePanel(vditor, ["subToolbar"]);
                panelElement.style.display = "block";
            }
        });

        for (let i = 0; i < 6; i++) {
            panelElement.children.item(i).addEventListener(getEventName(), (event: Event) => {
                event.preventDefault();
                if (vditor.currentMode === "wysiwyg") {
                    setHeading(vditor, (event.target as HTMLElement).getAttribute("data-tag"));
                    afterRenderEvent(vditor);
                    actionBtn.classList.add("vditor-menu--current");
                } else if (vditor.currentMode === "ir") {
                    processHeading(vditor, (event.target as HTMLElement).getAttribute("data-value"));
                    actionBtn.classList.add("vditor-menu--current");
                } else {
                    processHeadingSV(vditor, (event.target as HTMLElement).getAttribute("data-value"));
                }
                panelElement.style.display = "none";
            });
        }
    }
}
