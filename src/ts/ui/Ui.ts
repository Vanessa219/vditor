export class Ui {
    constructor(vditor:Vditor) {
        const vditorElement = document.getElementById(vditor.id)

        const toolbarElement = document.createElement('div')
        // toolbarElement.className = 'vditor-toolbar'
        Object.keys(vditor.toolbar.elements).forEach((key) => {
            toolbarElement.appendChild(vditor.toolbar.elements[key])
        })

        vditorElement.appendChild(toolbarElement)
        vditorElement.appendChild(vditor.editor.element)
    }
}