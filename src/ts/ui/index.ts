export class Ui {
    constructor(vditor: Vditor) {
        const vditorElement = document.getElementById(vditor.id)
        vditorElement.className = 'vditor' + (vditorElement.className ? ' ' + vditorElement.className : '')
        if (typeof vditor.options.height == 'number') {
            vditorElement.style.height = vditor.options.height + 'px'
        }
        if (typeof vditor.options.width == 'number') {
            vditorElement.style.width = vditor.options.width + 'px'
        } else {
            vditorElement.style.width = vditor.options.width
        }

        const toolbarElement = document.createElement('div')
        toolbarElement.className = 'vditor-toolbar'
        Object.keys(vditor.toolbar.elements).forEach((key) => {
            toolbarElement.appendChild(vditor.toolbar.elements[key])
        })

        vditorElement.appendChild(toolbarElement)

        const contentElement = document.createElement('div')
        contentElement.className = 'vditor-content'
        contentElement.appendChild(vditor.editor.element)

        if (vditor.markdown) {
            if (!vditor.options.preview.show) {
                vditor.markdown.element.style.display = 'none'
            }
            contentElement.appendChild(vditor.markdown.element)
        }

        if (vditor.options.counter > 0) {
            contentElement.appendChild(vditor.counter.element)
        }

        if (vditor.upload) {
            contentElement.appendChild(vditor.upload.element)
        }

        vditorElement.appendChild(contentElement)

        if (vditor.options.draggable) {
            vditorElement.appendChild(vditor.drag.element)
        }
    }
}