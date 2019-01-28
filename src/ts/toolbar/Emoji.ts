import emojiSVG from "../../assets/icons/emoji.svg";
import {MenuItemClass} from "./MenuItemClass";
import {i18n} from "../i18n/index";

export class Emoji extends MenuItemClass {
    element: HTMLElement

    genElement(menuItem: MenuItem, lang: string, editorElement: HTMLTextAreaElement): HTMLElement {
        this.element = document.createElement('div')

        this.element.className = 'vditor-tooltipped vditor-tooltipped__e'
        this.element.setAttribute('aria-label', menuItem.tip || i18n[lang][menuItem.name])
        this.element.innerHTML = menuItem.icon || emojiSVG
        const emojiPanelElement = document.createElement('div')
        emojiPanelElement.className = 'vditor-panel'

        if (menuItem.tail) {
            emojiPanelElement.innerHTML = `<div>${menuItem.tail}</div>`
            this.element.appendChild(emojiPanelElement)
        }

        this.element.addEventListener('click', () => {
            emojiPanelElement.style.display = emojiPanelElement.style.display === 'block' ? 'none' : 'block'
        })

        return this.element
    }
}