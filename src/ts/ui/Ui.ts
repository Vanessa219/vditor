export class Ui {
    constructor(id: string, toolbar: Array<HTMLElement>, editor: string) {
        const vditorElement = document.getElementById(id)
        toolbar.forEach((element) => {
            vditorElement.appendChild(element)
        })
    }
}