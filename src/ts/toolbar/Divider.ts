export class Divider {
    element: HTMLElement

    constructor() {
        this.element = document.createElement('div')
        this.element.className = 'vditor-menu__divider'
    }
}