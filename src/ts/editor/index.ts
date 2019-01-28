import {commandable} from '../util/commandable'

class Editor {
    element: HTMLTextAreaElement

    constructor() {
        this.element = document.createElement('textarea')
    }

    genElement(): HTMLTextAreaElement {
        return this.element
    }
}

const insertTextAtCaret = (textarea: HTMLTextAreaElement, prefix: string, suffix: string, replace?: string) => {
    if (typeof textarea.selectionStart === 'number' &&
        typeof textarea.selectionEnd === 'number') {
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
            return
        }
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

export {Editor, insertTextAtCaret}