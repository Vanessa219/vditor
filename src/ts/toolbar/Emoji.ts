import emojiSVG from "../../assets/icons/emoji.svg";
import {MenuItemClass} from "./MenuItemClass";
import {insertText} from "../editor/index";

export class Emoji extends MenuItemClass {
    element: HTMLElement

    constructor(vditor: Vditor, menuItem: MenuItem) {
        super(vditor, menuItem)
        this.element.children[0].innerHTML = menuItem.icon || emojiSVG

        const emojiPanelElement = document.createElement('div')
        emojiPanelElement.className = 'vditor-panel'

        let commonEmojiHTML = ''
        Object.keys(vditor.options.hint.emoji).forEach((key) => {
            const emojiValue = vditor.options.hint.emoji[key]
            if (emojiValue.indexOf('.') > -1) {
                commonEmojiHTML += `<span data-value=":${key}: " title=":${key}:"><img data-value=":${key}: " src="${emojiValue}"/></span>`
            } else {
                commonEmojiHTML += `<span data-value="${emojiValue} " title="${key}">${emojiValue}</span>`
            }
        })

        const tailHTML = vditor.options.hint.emojiTail ? `<div class="vditor-emojis__tail">${vditor.options.hint.emojiTail}</div>` : ''

        emojiPanelElement.innerHTML = `<div class="vditor-emojis">${commonEmojiHTML}</div>${tailHTML}`

        this.element.appendChild(emojiPanelElement)

        this._bindEvent(emojiPanelElement, vditor)
    }

    _bindEvent(emojiPanelElement: HTMLElement, vditor: Vditor) {
        this.element.children[0].addEventListener('click', () => {
            if (emojiPanelElement.style.display === 'block') {
                emojiPanelElement.style.display = 'none'
            } else {
                emojiPanelElement.style.display = 'block'
                if (vditor.toolbar.elements.headings) {
                    vditor.toolbar.elements.headings.children[1].style.display = 'none'
                }
            }
        })

        emojiPanelElement.querySelectorAll('.vditor-emojis span').forEach((element) => {
            element.addEventListener('click', (event: any) => {
                insertText(vditor.editor.element, event.target.getAttribute('data-value'), '', true)
                emojiPanelElement.style.display = 'none'
            })
        })
    }
}