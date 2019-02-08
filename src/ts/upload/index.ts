import {insertText} from "../editor/index";
import {i18n} from "../i18n/index";

class UploadClass {
    element: HTMLElement
    isUploading: boolean

    constructor() {
        this.isUploading = false
        this.element = document.createElement('div')
        this.element.className = 'vditor-upload'
        this.element.innerHTML = '<div class="vditor-upload__progress"></div><div class="vditor-upload__close">x</div>'

        this.element.children[1].addEventListener('click', function () {
            this.parentElement.style.opacity = 0
            this.parentElement.className = 'vditor-upload'
        })
    }
}

const genUploadingLabel = (vditor: Vditor, files: any): string => {
    let uploadingStr = ''
    for (let iMax = files.length, i = 0; i < iMax; i++) {
        const file = files[i].getAsFile ? files[i].getAsFile() : files[i]
        const tag = file.type.indexOf('image') === -1 ? '' : '!'
        if (!file.name) {
            return ''
        }
        if (file.size > vditor.options.upload.max) {
            uploadingStr += `${tag}[${file.name.replace(/\W/g,
                '')}](${i18n[vditor.options.lang].over} ${vditor.options.upload.max / 1024 / 1024}M)\n`
        } else {
            uploadingStr += `${tag}[${file.name.replace(/\W/g, '')}](${i18n[vditor.options.lang].uploading})\n`
        }
    }
    return uploadingStr
}

const genUploadedLabel = (editorElement: HTMLTextAreaElement, responseText: string, lang: string, uploadElement: HTMLElement) => {
    editorElement.focus()
    const response = JSON.parse(responseText)

    if (response.code === 1) {
        uploadElement.className = 'vditor-upload vditor-upload--tip'
        uploadElement.children[0].innerHTML = response.msg
    }

    response.data.errFiles.forEach((data: string) => {
        const original = `[${data.replace(/\W/g, '')}](${i18n[lang].uploading})`
        editorElement.selectionStart = editorElement.value.split(original)[0].length
        editorElement.selectionEnd = editorElement.selectionStart + original.length
        insertText(editorElement, `[${data.replace(/\W/g, '')}](${i18n[lang].uploadError})`, '', true)
    })

    Object.keys(response.data.succMap).forEach((key) => {
        const path = response.data.succMap[key]
        if (path.indexOf('.weba') > -1) {
            insertText(editorElement, `<audio controls="controls" src="${path}"></audio>\n`, '')
            return
        }
        const original = `[${key.replace(/\W/g, '')}](${i18n[lang].uploading})`
        editorElement.selectionStart = editorElement.value.split(original)[0].length
        editorElement.selectionEnd = editorElement.selectionStart + original.length
        insertText(editorElement, `[${key.replace(/\W/g, '')}](${path})`, '', true)
    })
}

const uploadFiles = (vditor: Vditor, files: any, element?: HTMLInputElement) => {
    const formData = new FormData()
    const uploadFiles = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i].getAsFile ? files[i].getAsFile() : files[i]
        if (file.size <= vditor.options.upload.max) {
            formData.append('file[]', file)
            uploadFiles.push(file)
        }
    }

    insertText(vditor.editor.element, genUploadingLabel(vditor, files), '')


    if (uploadFiles.length === 0) {
        element ? element.value = '' : ''
        return
    }

    if (!vditor.options.upload.url || !vditor.upload) {
        element ? element.value = '' : ''
        alert('please config: options.upload.url')
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', vditor.options.upload.url)
    if (vditor.options.upload.token) {
        xhr.setRequestHeader("X-Upload-Token", vditor.options.upload.token);
    }
    vditor.upload.isUploading = true
    vditor.editor.element.setAttribute('disabled', 'disabled')

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            vditor.upload.isUploading = false
            element ? element.value = '' : ''
            vditor.editor.element.removeAttribute('disabled')

            if (xhr.status === 200) {
                if (vditor.options.upload.success) {
                    vditor.options.upload.success(vditor.editor.element, xhr.responseText)
                } else {
                    genUploadedLabel(vditor.editor.element, xhr.responseText, vditor.options.lang, vditor.upload.element)
                }

                vditor.upload.element.style.opacity = 0
            } else {
                if (vditor.options.upload.error) {
                    vditor.options.upload.error(xhr.responseText)
                } else {
                    vditor.upload.element.className = 'vditor-upload vditor-upload--tip'
                    vditor.upload.element.children[0].innerHTML = xhr.responseText || '401'
                }
            }
        }
    }
    xhr.upload.onprogress = (event: ProgressEvent) => {
        if (!event.lengthComputable) {
            return
        }
        const progress = event.loaded / event.total * 100
        vditor.upload.element.style.opacity = 1
        vditor.upload.element.children[0].style.width = progress + '%'
    }
    xhr.send(formData)
}

export {UploadClass, uploadFiles}