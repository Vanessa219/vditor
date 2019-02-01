import {commandable} from '../util/commandable'
import {Hint} from "../hint/index";
import {uploadFiles} from "../upload/index";

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

            if (vditor.options.input) {
                vditor.options.input(this.element.value, vditor.markdown && vditor.markdown.element)
            }

            vditor.hint && vditor.hint.render()
        })

        this.element.addEventListener('focus', () => {
            if (vditor.options.focus) {
                vditor.options.focus(this.element.value)
            }
            if (vditor.toolbar.elements.emoji && vditor.toolbar.elements.emoji.children[1]) {
                vditor.toolbar.elements.emoji.children[1].style.display = 'none'
            }
            if (vditor.toolbar.elements.headings && vditor.toolbar.elements.headings.children[1]) {
                vditor.toolbar.elements.headings.children[1].style.display = 'none'
            }
        })


        this.element.addEventListener('blur', () => {
            if (vditor.options.blur) {
                vditor.options.blur(this.element.value)
            }
            if (vditor.hint && vditor.hint.element) {
                vditor.hint.element.style.display = 'none'
            }
        })

        if (vditor.options.select) {
            this.element.onselect = () => {
                vditor.options.select(this.element.value.substring(
                    this.element.selectionStart, this.element.selectionEnd))
            }
        }
        if (vditor.markdown) {
            this.element.addEventListener('scroll', () => {
                if (vditor.markdown.element.style.display === 'none') {
                    return
                }
                const textScrollTop = this.element.scrollTop
                const textHeight = this.element.clientHeight
                const textScrollHeight = this.element.scrollHeight
                const preview = vditor.markdown.element
                if ((textScrollTop / textHeight > 0.5)) {
                    preview.scrollTop = (textScrollTop + textHeight) *
                        preview.scrollHeight / textScrollHeight - textHeight
                } else {
                    preview.scrollTop = textScrollTop *
                        preview.scrollHeight / textScrollHeight
                }
            })
        }

        if (vditor.options.upload.url) {
            this.element.addEventListener('drop', (event: any) => {
                event.stopPropagation()
                event.preventDefault()

                const files = event.dataTransfer.items
                if (files.length === 0) {
                    return
                }

                uploadFiles(vditor, files)
            })
        }

        this.element.addEventListener('paste', (event: any) => {
            event.stopPropagation()
            event.preventDefault()

            if (event.clipboardData.getData('text/html').replace(/(^\s*)|(\s*)$/g, '') !== '') {
                //     let onlyMultiCode = false
                //     // no escape
                //     TurndownService.prototype.escape = function (string) {
                //         return string
                //     }
                //     const turndownService = new TurndownService()
                //
                //     turndownService.addRule('strikethrough', {
                //         filter: ['pre', 'code'],
                //         replacement: function (content, node) {
                //             if (node.parentElement.tagName === 'PRE') {
                //                 return content
                //             }
                //             if (content.split('\n').length > 1) {
                //                 onlyMultiCode = true
                //                 return '```\n' + content + '\n```'
                //             }
                //             return '`' + content + '`'
                //         },
                //     })
                //     turndownService.addRule('strikethrough', {
                //         filter: ['img'],
                //         replacement: function (content, target) {
                //             if (!target.getAttribute('src')) {
                //                 return ''
                //             }
                //
                //             config.fetchUpload &&
                //             config.fetchUpload(target.src, (originalURL, url) => {
                //                 replaceTextareaValue(textarea, originalURL, url)
                //                 if (needDebounce) {
                //                     timerId = debounceInput(timerId, config.change, $editor)
                //                 }
                //             })
                //
                //             return `![${target.alt}](${target.src})`
                //         },
                //     })
                //
                //     const turndownPluginGfm = require('turndown-plugin-gfm')
                //     turndownService.use(turndownPluginGfm.gfm)
                //
                //     let markdownStr = turndownService.turndown(
                //         event.clipboardData.getData('text/html'))
                //
                //     if (onlyMultiCode) {
                //         if ($('<div>' + event.clipboardData.getData('text/html') +
                //             '</div>').
                //         find('pre').length > 1) {
                //             onlyMultiCode = false
                //         } else if (markdownStr.substr(0, 3) !== '```' ||
                //             markdownStr.substr(markdownStr.length - 3, 3) !== '```') {
                //             onlyMultiCode = false
                //         }
                //     }
                //     if (onlyMultiCode) {
                //         insertTextAtCaret(event.target,
                //             '```\n' + event.clipboardData.getData('text/plain') +
                //             '\n```',
                //             '', true)
                //         if (needDebounce) {
                //             timerId = debounceInput(timerId, config.change, $editor)
                //         }
                //     } else {
                //         insertTextAtCaret(event.target, markdownStr, '', true)
                //         if (needDebounce) {
                //             timerId = debounceInput(timerId, config.change, $editor)
                //         }
                //     }
            } else if (event.clipboardData.getData('text/plain').replace(/(^\s*)|(\s*)$/g, '') !== '' &&
                event.clipboardData.files.length === 0) {
                insertText(event.target,
                    event.clipboardData.getData('text/plain'), '', true)
            } else if (event.clipboardData.files.length > 0) {
                // upload file
                if (!vditor.options.upload.url) {
                    return
                }
                // NOTE: not work in Safari. maybe the browser considered local filesystem as the same domain as the pasted data
                uploadFiles(vditor, event.clipboardData.files)
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