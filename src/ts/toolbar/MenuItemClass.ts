import {i18n} from "../i18n/index";


export class MenuItemClass {
    element: HTMLElement
    menuItem: MenuItem
    editorElement: HTMLTextAreaElement

    genElement(menuItem: MenuItem, lang: string, editorElement: HTMLTextAreaElement): HTMLElement {
        this.menuItem = menuItem
        this.editorElement = editorElement
        this.element = document.createElement('div')

        const tip = this.menuItem.tip || i18n[lang][this.menuItem.name]
        this.element.innerHTML = `<span class="tooltipped tooltipped__e" aria-label="${tip}">${this.menuItem.icon}</span>`

        this.bindEvent()
        return this.element
    }

    private bindEvent() {
        this.element.addEventListener('click', () => {
            this.editorElement.value = JSON.stringify(this.menuItem)
        })
    }
}