export class Markdown {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-preview' +
            (vditor.options.classes.preview ? ' ' + vditor.options.classes.preview : '')
    }

    render(vditor: Vditor, value?: string) {
        if (this.element.style.display === 'none') {
            return
        }

        if (value) {
            this.element.innerHTML = value
        } else if (vditor.options.markdownUrl) {
            clearTimeout(vditor.mdTimeoutId)
            vditor.mdTimeoutId = setTimeout(()=> {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', vditor.options.markdownUrl)
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const responseJSON = JSON.parse(xhr.responseText)
                            this.element.innerHTML = responseJSON.html
                            if (vditor.options.parseMarkdown) {
                                vditor.options.parseMarkdown(this.element)
                            }
                        }
                    }
                }

                const formData = new FormData();
                formData.append('markdownText', vditor.editor.element.value);
                xhr.send(formData)
            }, 1000)
        } else {
            this.element.innerHTML = vditor.editor.element.value
        }
    }
}