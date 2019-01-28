import {i18n} from "../i18n/index";
import {insertTextAtCaret} from "../editor/index";


export class MenuItemClass {
    element: HTMLElement
    menuItem: MenuItem
    editorElement: HTMLTextAreaElement

    genElement(menuItem: MenuItem, lang: string, editorElement: HTMLTextAreaElement): HTMLElement {
        this.menuItem = menuItem
        this.editorElement = editorElement
        this.element = document.createElement('div')

        this.element.className = 'vditor-tooltipped vditor-tooltipped__e'
        this.element.setAttribute('aria-label', this.menuItem.tip || i18n[lang][this.menuItem.name])
        this.element.innerHTML = this.menuItem.icon

        this.bindEvent()
        return this.element
    }

    private bindEvent() {
        this.element.addEventListener('click', () => {
            insertTextAtCaret(this.editorElement, this.menuItem.prefix || '', this.menuItem.suffix || '')
        })
    }
}