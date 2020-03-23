import emojiSVG from "../../assets/icons/emoji.svg";
import {Constants} from "../constants";
import {insertText} from "../sv/insertText";
import {getEventName} from "../util/compatibility";
import {getEditorRange, insertHTML, setSelectionFocus} from "../util/selection";
import {MenuItem} from "./MenuItem";
import {hidePanel} from "./setToolbar";

export class Emoji extends MenuItem {
    public element: HTMLElement;
    public panelElement: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || emojiSVG;

        this.panelElement = document.createElement("div");
        this.panelElement.className = "vditor-panel vditor-arrow";

        let commonEmojiHTML = "";
        Object.keys(vditor.options.hint.emoji).forEach((key) => {
            const emojiValue = vditor.options.hint.emoji[key];
            if (emojiValue.indexOf(".") > -1) {
                commonEmojiHTML += `<button data-value=":${key}: " data-key=":${key}:"><img
data-value=":${key}: " data-key=":${key}:" class="vditor-emojis__icon" src="${emojiValue}"/></button>`;
            } else {
                commonEmojiHTML += `<button data-value="${emojiValue} "
 data-key="${key}"><span class="vditor-emojis__icon">${emojiValue}</span></button>`;
            }
        });

        const tailHTML = `<div class="vditor-emojis__tail">
    <span class="vditor-emojis__tip"></span><span>${vditor.options.hint.emojiTail || ""}</span>
</div>`;

        this.panelElement.innerHTML = `<div class="vditor-emojis" style="max-height: ${
            vditor.options.height === "auto" ? "auto" : vditor.options.height as number - 80
        }px">${commonEmojiHTML}</div>${tailHTML}`;

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
            hidePanel(vditor, ["hint", "headings", "edit-mode"]);
            event.preventDefault();
        });

        this.panelElement.querySelectorAll(".vditor-emojis button").forEach((element) => {
            element.addEventListener(getEventName(), (event: Event) => {
                event.preventDefault();
                const value = element.getAttribute("data-value");
                if (vditor.currentMode === "wysiwyg") {
                    const range = getEditorRange(vditor.wysiwyg.element);
                    if (value.indexOf(":") > -1) {
                        insertHTML(vditor.lute.SpinVditorDOM(value), vditor);
                        range.insertNode(document.createTextNode(" "));
                    } else {
                        range.insertNode(document.createTextNode(value));
                    }
                    range.collapse(false);
                    setSelectionFocus(range);
                } else {
                    insertText(vditor, value, "", true);
                }
                this.panelElement.style.display = "none";
            });
            element.addEventListener("mouseover", (event: Event) => {
                if ((event.target as HTMLElement).tagName === "BUTTON") {
                    this.panelElement.querySelector(".vditor-emojis__tip").innerHTML =
                        (event.target as HTMLElement).getAttribute("data-key");
                }
            });
        });
    }
}
