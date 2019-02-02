import {getTextareaPosition} from "../util/textareaPosition";
import {insertText} from "../editor/index";

export class Hint {
    timeId: number
    editorElement: HTMLTextAreaElement
    element: HTMLUListElement
    atUser: { (value: string): Array<any> }
    commonEmoji: any
    hintDelay: number

    constructor(vditor: Vditor) {
        this.timeId = -1
        this.hintDelay = vditor.options.hintDelay
        this.editorElement = vditor.editor.element
        this.atUser = vditor.options.atUser
        this.commonEmoji = vditor.options.commonEmoji

        this.element = document.createElement('ul')
        this.element.className = 'vditor-hint'

        this.editorElement.parentElement.appendChild(this.element);
    }

    render() {
        const valueArray = this.editorElement.value.substr(0, this.editorElement.selectionStart).split('\n')
        const currentLineValue = valueArray.slice(-1).pop()
        const atKey = this.getKey(currentLineValue, '@')
        const emojiKey = this.getKey(currentLineValue, ':')

        if (atKey === undefined && emojiKey === undefined) {
            this.element.style.display = 'none'
            clearTimeout(this.timeId)
        } else {
            if (atKey !== undefined && this.atUser) {
                clearTimeout(this.timeId)
                this.timeId = setTimeout(() => {
                    this.genHTML(this.atUser(atKey))
                }, this.hintDelay)
            }
            if (emojiKey !== undefined) {
                import(/* webpackChunkName: "allEmoji" */ '../emoji/allEmoji.js')
                    .then(allEmoji => {
                        let emojiHint = emojiKey === '' ? this.commonEmoji : allEmoji.default
                        let matchEmojiData: Array<any> = []
                        Object.keys(emojiHint).forEach((key) => {
                            if (key.indexOf(emojiKey.toLowerCase()) === 0) {
                                if (emojiHint[key].indexOf('.') > -1) {
                                    matchEmojiData.push({
                                        value: `:${key}:`,
                                        html: `<img src="${emojiHint[key]}" title=":${key}:"/> :${key}:`
                                    })
                                } else {
                                    matchEmojiData.push({
                                        value: emojiHint[key],
                                        html: `${emojiHint[key]} ${key}`
                                    })
                                }
                            }
                        })
                        this.genHTML(matchEmojiData)
                    })
                    .catch(err => {
                        console.log('Failed to load emoji', err)
                    })
            }
        }
    }

    private getKey(currentLineValue: string, splitChar: string) {
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }

        const lineArray = currentLineValue.split(splitChar)

        let key = undefined
        if (lineArray.length > 1) {
            if (lineArray.length === 2 && lineArray[0] === '') {
                if ((lineArray[1] === '' || lineArray[1].trim() !== '') &&
                    lineArray[1].indexOf(' ') === -1 &&
                    lineArray[1].length < 33) {
                    key = lineArray[1]
                }
            } else {
                const prefAt = lineArray[lineArray.length - 2]
                const currentAt = lineArray.slice(-1).pop()
                if (prefAt.slice(-1) === ' ' && currentAt.indexOf(' ') === -1 &&
                    ((currentAt === '' || currentAt.trim() !== '') &&
                        currentAt.length < 33)) {
                    key = currentAt
                }
            }
        }
        return key
    }

    private genHTML(data: Array<any>) {
        if (data.length === 0) {
            this.element.style.display = 'none'
            return
        }
        const textareaPosition = getTextareaPosition(this.editorElement)
        const x = textareaPosition.left
        const y = textareaPosition.top - 4
        let hintsHTML = ''

        data.forEach((hintData, i) => {
            if (i > 7) {
                return
            }
            hintsHTML += `<li data-value="${hintData.value} " class="${i || 'vditor-hint--current'}"> ${hintData.html}</li>`
        })

        this.element.innerHTML = hintsHTML
        this.element.style.top = `${y}px`
        this.element.style.left = `${x}px`
        this.element.style.display = 'block'

        this.element.querySelectorAll('li').forEach((element) => {
            element.addEventListener('click', () => {
                this.element.style.display = 'none'

                const value = element.getAttribute('data-value')
                const splitChar = value.indexOf('@') === 0 ? '@' : ':'

                this.editorElement.selectionStart = this.editorElement.value.substr(0, this.editorElement.selectionEnd).lastIndexOf(splitChar)
                insertText(this.editorElement, value, '', true)
            })
        })
        // hint 展现在上部
        if (y + this.element.offsetHeight - this.editorElement.offsetHeight >
            window.innerHeight - (this.editorElement.parentElement.offsetHeight + this.editorElement.parentElement.offsetTop - document.documentElement.scrollTop)) {
            this.element.style.top = `${y - this.element.offsetHeight}px`
        }
    }
}