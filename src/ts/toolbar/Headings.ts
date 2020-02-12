import headingsSVG from "../../assets/icons/headings.svg";
import {insertText} from "../editor/insertText";
import {getEventName} from "../util/compatibility";
import {highlightToolbar} from "../wysiwyg/highlightToolbar";
import {setHeading} from "../wysiwyg/setHeading";
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
        this.element.children[0].addEventListener(getEventName(), (event) => {
            const actionBtn = this.element.children[0];
            if (vditor.currentMode === "wysiwyg" && actionBtn.classList.contains("vditor-menu--current")) {
                if (vditor.wysiwyg.element.querySelector("wbr")) {
                    vditor.wysiwyg.element.querySelector("wbr").remove();
                }
                document.execCommand("formatBlock", false, "p");
                // https://github.com/Vanessa219/vditor/issues/50
                const range = getSelection().getRangeAt(0);
                if (!range.collapsed && !range.startContainer.isEqualNode(range.endContainer)) {
                    range.setStart(range.endContainer, 0);
                }
                highlightToolbar(vditor);
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
                    setHeading(vditor, (event.target as HTMLElement).tagName.toLowerCase());
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
