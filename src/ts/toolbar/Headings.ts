import headingsSVG from "../../assets/icons/headings.svg";
import {insertText} from "../editor/index";
import {MenuItem} from "./MenuItem";

export class Headings extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || headingsSVG;

        const headingsPanelElement = document.createElement("div");
        headingsPanelElement.className = "vditor-panel";
        headingsPanelElement.innerHTML = `<h1 data-value="# ">Heading 1</h1>
<h2 data-value="## ">Heading 2</h2>
<h3 data-value="### ">Heading 3</h3>
<h4 data-value="#### ">Heading 4</h4>
<h5 data-value="##### ">Heading 5</h5>
<h6 data-value="###### ">Heading 6</h6>`;

        this.element.appendChild(headingsPanelElement);

        this._bindEvent(headingsPanelElement, vditor);
    }

    public _bindEvent(headingsPanelElement: HTMLElement, vditor: IVditor) {
        this.element.children[0].addEventListener("click", () => {
            if (headingsPanelElement.style.display === "block") {
                headingsPanelElement.style.display = "none";
            } else {
                headingsPanelElement.style.display = "block";
                if (vditor.toolbar.elements.emoji) {
                    const panel = vditor.toolbar.elements.emoji.children[1] as HTMLElement;
                    panel.style.display = "none";
                }
            }
        });

        for (let i = 0; i < 6; i++) {
            headingsPanelElement.children.item(i).addEventListener("click", (event: Event) => {
                insertText(vditor.editor.element, (event.target as HTMLElement).getAttribute("data-value"), "");
                headingsPanelElement.style.display = "none";
            });
        }
    }
}
