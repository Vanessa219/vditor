import emojiSVG from "../../assets/icons/emoji.svg";
import {insertText} from "../editor/insertText";
import {setSelectionFocus} from "../editor/setSelection";
import {getEventName} from "../util/compatibility";
import {insertHTML} from "../wysiwyg/insertHTML";
import {MenuItem} from "./MenuItem";

export class Emoji extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || emojiSVG;

        const emojiPanelElement = document.createElement("div");
        emojiPanelElement.className = "vditor-panel vditor-arrow";

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

        emojiPanelElement.innerHTML = `<div class="vditor-emojis" style="max-height: ${
            vditor.options.height === "auto" ? "auto" : vditor.options.height as number - 80
            }px">${commonEmojiHTML}</div>${tailHTML}`;

        this.element.appendChild(emojiPanelElement);

        this._bindEvent(emojiPanelElement, vditor);
    }

    public _bindEvent(emojiPanelElement: HTMLElement, vditor: IVditor) {
        this.element.children[0].addEventListener(getEventName(), (event) => {
            if (emojiPanelElement.style.display === "block") {
                emojiPanelElement.style.display = "none";
            } else {
                emojiPanelElement.style.display = "block";
                if (vditor.toolbar.elements.headings) {
                    const headingsPanel = vditor.toolbar.elements.headings.children[1] as HTMLElement;
                    headingsPanel.style.display = "none";
                }
            }

            if (vditor.hint) {
                vditor.hint.element.style.display = "none";
            }
            event.preventDefault();
        });

        emojiPanelElement.querySelectorAll(".vditor-emojis button").forEach((element) => {
            element.addEventListener(getEventName(), (event: Event) => {
                event.preventDefault();
                const value = element.getAttribute("data-value");
                if (vditor.currentMode === "wysiwyg") {
                    if (!vditor.wysiwyg.element.contains(getSelection().getRangeAt(0).startContainer)) {
                        vditor.wysiwyg.element.focus();
                    }
                    const range = getSelection().getRangeAt(0);
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
                emojiPanelElement.style.display = "none";
            });
            element.addEventListener("mouseover", (event: Event) => {
                if ((event.target as HTMLElement).tagName === "BUTTON") {
                    emojiPanelElement.querySelector(".vditor-emojis__tip").innerHTML =
                        (event.target as HTMLElement).getAttribute("data-key");
                }
            });
        });
    }
}
