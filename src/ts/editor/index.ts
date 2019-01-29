import {commandable} from '../util/commandable'

class Editor {
    element: HTMLTextAreaElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('textarea')
        this.element.className = 'vditor-textarea'
        this.element.setAttribute('placeholder', vditor.options.placeholder)

        this.bindEvent(vditor)
    }

    private bindEvent(vditor: Vditor) {
        this.element.addEventListener('input', () => {

            if (vditor.options.counter > 0) {
                vditor.counter.render(this.element.value.length, vditor.options.counter)
            }
        })
        this.element.addEventListener('focus', () => {
            if (vditor.options.counter > 0) {
                vditor.counter.render(this.element.value.length, vditor.options.counter)
            }
        })
    }
}

const insertText = (textarea: HTMLTextAreaElement, prefix: string, suffix: string, replace?: boolean) => {
    if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
        const startPos = textarea.selectionStart
        const endPos = textarea.selectionEnd
        const tmpStr = textarea.value
        textarea.focus()
        if (!commandable()) {
            if (startPos === endPos) {
                // no selection
                textarea.value = tmpStr.substring(0, startPos) + prefix + suffix +
                    tmpStr.substring(endPos, tmpStr.length)
                textarea.selectionEnd = textarea.selectionStart = endPos + prefix.length
            } else {
                if (replace) {
                    textarea.value = tmpStr.substring(0, startPos) + prefix + suffix +
                        tmpStr.substring(endPos, tmpStr.length)
                    textarea.selectionEnd = startPos + prefix.length + suffix.length
                } else {
                    if (tmpStr.substring(startPos - prefix.length, startPos) === prefix &&
                        tmpStr.substring(endPos, endPos + suffix.length) === suffix) {
                        // broke circle, avoid repeat
                        textarea.value = tmpStr.substring(0, startPos - prefix.length) +
                            tmpStr.substring(startPos, endPos) +
                            tmpStr.substring(endPos + suffix.length, tmpStr.length)
                        textarea.selectionStart = startPos - prefix.length
                        textarea.selectionEnd = endPos - prefix.length
                    } else {
                        // insert
                        textarea.value = tmpStr.substring(0, startPos) + prefix +
                            tmpStr.substring(startPos, endPos) +
                            suffix + tmpStr.substring(endPos, tmpStr.length)
                        textarea.selectionStart = startPos + prefix.length
                        textarea.selectionEnd = endPos + prefix.length
                    }
                }
            }
        } else {
            if (startPos === endPos) {
                // no selection
                document.execCommand('insertText', false, prefix + suffix)
                textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart - suffix.length
            } else {
                if (replace) {
                    document.execCommand('insertText', false, prefix + suffix)
                } else {
                    if (tmpStr.substring(startPos - prefix.length, startPos) === prefix &&
                        tmpStr.substring(endPos, endPos + suffix.length) === suffix) {
                        // broke circle, avoid repeat
                        document.execCommand('delete', false)
                        for (let i = 0, iMax = prefix.length; i < iMax; i++) {
                            document.execCommand('delete', false)
                        }
                        for (let j = 0, jMax = suffix.length; j < jMax; j++) {
                            document.execCommand('forwardDelete', false)
                        }
                        document.execCommand('insertText', false,
                            tmpStr.substring(startPos, endPos))
                        textarea.selectionStart = startPos - prefix.length
                        textarea.selectionEnd = endPos - prefix.length
                    } else {
                        // insert
                        document.execCommand('insertText', false,
                            prefix + tmpStr.substring(startPos, endPos) + suffix)
                        textarea.selectionStart = startPos + prefix.length
                        textarea.selectionEnd = endPos + prefix.length
                    }
                }
            }
        }
    }
}

// const debounceChange = (timerId: number, change: ChangeFunction, $editor) => {
//     if (timerId !== undefined) {
//         clearTimeout(timerId)
//     }
//     return setTimeout(() => {
//         change && change($editor.find('textarea').val(),
//             $editor.find('.b3log-editor__icon--current').length === 0
//                 ? undefined
//                 : $editor.find('.b3log-editor__markdown'))
//     }, 500)
// }

export {Editor, insertText}