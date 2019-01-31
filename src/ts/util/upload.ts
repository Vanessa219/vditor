import {insertText} from "../editor/index";

export const uploadFile = (vditor: Vditor, files: any, element?: HTMLInputElement) => {
    const formData = new FormData()
    const uploadFiles = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i].getAsFile ? files[i].getAsFile() : files[i]
        if (file.size <= vditor.options.upload.max) {
            formData.append('file[]', file)
            uploadFiles.push(file)
        }
    }

    insertText(vditor.editor.element, uploading(vditor, files), '')

    if (uploadFiles.length === 0) {
        element ? element.value = '' : ''
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', vditor.options.upload.url)

    vditor.isUploading = true

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            vditor.isUploading = false
            if (xhr.status === 200) {
                element ? element.value = '' : ''
                // uploaded(response, textarea, config.label.loading,
                //     config.label.error)
            } else {
                console.log(xhr.responseText)
            }
        }
    }
    xhr.upload.onprogress = (event: any) => {
        if (event.lengthComputable) {
            var loaded = event.loaded / event.total * 100;
            console.log("upload progress: " + loaded);
        }
    }
    xhr.send(formData)
}

const uploading = (vditor: Vditor, files: any): string => {
    let uploadingStr = ''
    for (let iMax = files.length, i = 0; i < iMax; i++) {
        const file = files[i].getAsFile ? files[i].getAsFile() : files[i]
        const tag = file.type.indexOf('image') === -1 ? '' : '!'
        if (file.size > vditor.options.upload.max) {
            uploadingStr += `\n${tag}[${file.name.replace(/\W/g,
                '')}](over ${vditor.options.upload.max / 1024 / 1024}M)\n`
        } else {
            uploadingStr += `\n${tag}[${file.name.replace(/\W/g, '')}](loading)\n`
        }
    }
    return uploadingStr
}
//
// const uploaded = (
//     response, textarea, loadingLabel = 'Uploading', errorLabel = 'Error') => {
//     textarea.focus()
//     if (response.code === 1) {
//         alertMsg(response.msg)
//     }
//     response.data.errFiles.forEach((data) => {
//         replaceTextareaValue(textarea,
//             `[${data.replace(/\W/g, '')}](${loadingLabel})\n`,
//             `[${data.replace(/\W/g, '')}](${errorLabel})\n`)
//     })
//
//     Object.keys(response.data.succMap).forEach((key) => {
//         replaceTextareaValue(textarea,
//             `[${key.replace(/\W/g, '')}](${loadingLabel})\n`,
//             `[${key.replace(/\W/g, '')}](${response.data.succMap[key]})\n`)
//     })
// }