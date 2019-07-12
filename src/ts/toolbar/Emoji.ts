import emojiSVG from "../../assets/icons/emoji.svg";
import {insertText} from "../editor/index";
import {MenuItem} from "./MenuItem";

export class Emoji extends MenuItem {
    public element: HTMLElement;

    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || emojiSVG;

        const emojiPanelElement = document.createElement("div");
        emojiPanelElement.className = "vditor-panel";

        let commonEmojiHTML = `<span data-value="👍 " data-key="+1">👍</span>
<span data-value="👎 " data-key="-1">👎</span>
<span data-value="😰 " data-key="cold_sweat">😰</span>
<span data-value="❤️ " data-key="heart">❤️</span>`;
        Object.keys(vditor.options.hint.emoji).forEach((key) => {
            const emojiValue = vditor.options.hint.emoji[key];
            if (emojiValue.indexOf(".") > -1) {
                commonEmojiHTML += `<span data-value=":${key}: " data-key=":${key}:"><img
data-value=":${key}: " data-key=":${key}:" src="${emojiValue}"/></span>`;
            } else {
                commonEmojiHTML += `<span data-value="${emojiValue} " data-key="${key}">${emojiValue}</span>`;
            }
        });

        const tailHTML = `<div class="vditor-emojis__tail">
    <span class="vditor-emojis__tip"></span><span>${vditor.options.hint.emojiTail || ''}</span>
</div>`;

        emojiPanelElement.innerHTML = `<div class="vditor-emojis" style="max-height: ${
            vditor.options.height === "auto" ? "auto" : vditor.options.height as number - 80
            }px">${commonEmojiHTML}</div>${tailHTML}`;

        this.element.appendChild(emojiPanelElement);

        this._bindEvent(emojiPanelElement, vditor);
    }

    public _bindEvent(emojiPanelElement: HTMLElement, vditor: IVditor) {
        this.element.children[0].addEventListener("click", () => {
            if (emojiPanelElement.style.display === "block") {
                emojiPanelElement.style.display = "none";
            } else {
                emojiPanelElement.style.display = "block";
                if (vditor.toolbar.elements.headings) {
                    const headingsPanel = vditor.toolbar.elements.headings.children[1] as HTMLElement;
                    headingsPanel.style.display = "none";
                }
            }
        });

        emojiPanelElement.querySelectorAll(".vditor-emojis span").forEach((element) => {
            element.addEventListener("click", (event: Event) => {
                insertText(vditor.editor.element, (event.target as HTMLElement).getAttribute("data-value"), "", true);
                emojiPanelElement.style.display = "none";
            });
            element.addEventListener("mouseover", (event: Event) => {
                emojiPanelElement.querySelector(".vditor-emojis__tip").innerHTML =
                    (event.target as HTMLElement).getAttribute("data-key");
            });
        });
    }
}
