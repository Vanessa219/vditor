export class Ui {
    constructor(id: string, toolbar: Array<HTMLElement>, editor: HTMLElement) {
        const vditorElement = document.getElementById(id)
        toolbar.forEach((element) => {
            vditorElement.appendChild(element)
        })
        vditorElement.appendChild(editor)
    }
}