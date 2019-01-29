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
        Object.keys(vditor.options.commonEmoji).forEach((key) => {
            const emojiValue = vditor.options.commonEmoji[key]
            if (emojiValue.indexOf('.') > -1) {
                commonEmojiHTML += `<span data-value=":${key}: "><img data-value=":${key}: " src="${emojiValue}"/></span>`
            } else {
                commonEmojiHTML += `<span data-value="${emojiValue} ">${emojiValue}</span>`
            }
        })

        const tailHTML = menuItem.tail ? `<div>${menuItem.tail}</div>` : ''

        emojiPanelElement.innerHTML = `<div class="vditor-emojis">${commonEmojiHTML}</div>${tailHTML}`

        this.element.appendChild(emojiPanelElement)

        this._bindEvent(emojiPanelElement, vditor)
    }

    _bindEvent(emojiPanelElement: HTMLElement, vditor: Vditor) {
        this.element.children[0].addEventListener('click', () => {
            emojiPanelElement.style.display = emojiPanelElement.style.display === 'block' ? 'none' : 'block'
        })

        emojiPanelElement.querySelectorAll('.vditor-emojis span').forEach((element) => {
            element.addEventListener('click', (event: any) => {
                insertText(vditor.editor.element, event.target.getAttribute('data-value'), '', true)
                emojiPanelElement.style.display = 'none'
            })
        })
    }
}