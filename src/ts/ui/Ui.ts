export class Ui {
    constructor(id: string, toolbar: any, editor: HTMLElement) {
        const vditorElement = document.getElementById(id)

        const toolbarElement = document.createElement('div')
        // toolbarElement.className = 'vditor-toolbar'
        Object.keys(toolbar).forEach((key) => {
            toolbarElement.appendChild(toolbar[key])
        })

        vditorElement.appendChild(toolbarElement)
        vditorElement.appendChild(editor)
    }
}