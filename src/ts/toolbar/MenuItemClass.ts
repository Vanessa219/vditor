import {i18n} from "../i18n/index";
import {insertText} from "../editor/index";


export class MenuItemClass {
    element: HTMLElement
    menuItem: MenuItem
    editorElement: HTMLTextAreaElement

    constructor(vditor: Vditor, menuItem: MenuItem) {
        this.menuItem = menuItem
        this.editorElement = vditor.editor.element

        this.element = document.createElement('div')
        const iconElement = document.createElement('div')
        iconElement.className = 'vditor-tooltipped vditor-tooltipped__e'
        iconElement.setAttribute('aria-label', this.menuItem.tip || i18n[vditor.options.lang][this.menuItem.name])
        this.element.appendChild(iconElement)
    }

    bindEvent() {
        this.element.children[0].addEventListener('click', () => {
            insertText(this.editorElement, this.menuItem.prefix || '', this.menuItem.suffix || '')
        })
    }
}