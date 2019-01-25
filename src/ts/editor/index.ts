export class Editor {
    element: HTMLTextAreaElement

    constructor() {
        this.element = document.createElement('textarea')
    }

    genElement(): HTMLTextAreaElement {
        return this.element
    }
}