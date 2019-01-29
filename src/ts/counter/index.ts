export class Counter {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-counter'

        this.render(0, vditor.options.counter)

    }

    render(length: number, counter: number) {
        this.element.innerHTML = `${length}/${counter}`
    }
}