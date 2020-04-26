import {exportMarkdown} from "../export/markdown";
import {getEventName} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {MenuItem} from "./MenuItem";
import {hidePanel, toggleSubMenu} from "./setToolbar";

export class Export extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);

        const actionBtn = this.element.children[0] as HTMLElement;

        const panelElement = document.createElement("div");
        panelElement.className = `vditor-hint${menuItem.level === 2 ? "" : " vditor-panel--arrow"}`;
        panelElement.innerHTML = `<button data-type="markdown">Markdown</button>`;
        panelElement.addEventListener(getEventName(), (event: MouseEvent & { target: HTMLElement }) => {
            const btnElement = event.target;
            if (btnElement.tagName === "BUTTON") {
                switch (btnElement.getAttribute("data-type")) {
                    case "markdown":
                        exportMarkdown(getMarkdown(vditor));
                        break;
                    default:
                        break;
                }
                hidePanel(vditor, ["subToolbar"]);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.appendChild(panelElement);
        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level);
    }
}
