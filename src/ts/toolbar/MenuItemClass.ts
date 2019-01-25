import {i18n} from "../i18n/index";


export class MenuItemClass {
    genElement(menuItem: MenuItem, lang: string): HTMLElement {
        const tip = menuItem.tip || i18n[lang][menuItem.name]
        const element = document.createElement('div')
        element.innerHTML = `<span class="tooltipped tooltipped__e" aria-label="${tip}">${menuItem.icon}</span>`

        this.bindEvent(element, menuItem)
        return element
    }

    private bindEvent(element: HTMLElement, menuItem: MenuItem) {
        element.addEventListener('click', () => {
            console.log(menuItem)
        })
    }
}