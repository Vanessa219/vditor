import {gfm} from 'turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js'
import {commandable} from '../util/commandable'
import {uploadFiles} from "../upload/index";
import {i18n} from "../i18n/index";

class Editor {
    element: HTMLTextAreaElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('textarea')
        this.element.className = 'vditor-textarea'
        this.element.setAttribute('placeholder', vditor.options.placeholder)
        if (vditor.options.cache) {
            this.element.value = localStorage.getItem('vditor' + vditor.id)
            if (vditor.options.counter > 0) {
                vditor.counter.render(this.element.value.length, vditor.options.counter)
            }
        }
        this.bindEvent(vditor)
    }

    private html2md (TurndownService:any, vditor:Vditor, event:any) {
        let onlyMultiCode = false
        // no escape
        TurndownService.prototype.escape = (string: string) => {
            return string
        }

        const turndownService = new TurndownService()

        turndownService.addRule('strikethrough', {
            filter: ['pre', 'code'],
            replacement: (content: string, node: HTMLElement) => {
                if (node.parentElement.tagName === 'PRE') {
                    return content
                }
                if (content.split('\n').length > 1) {
                    onlyMultiCode = true
                    return '```\n' + content + '\n```'
                }
                return '`' + content + '`'
            },
        })
        turndownService.addRule('strikethrough', {
            filter: ['img'],
            replacement: (content: string, target: HTMLElement) => {
                if (!target.getAttribute('src')) {
                    return ''
                }
                if (vditor.options.upload.linkToImgUrl) {
                    const xhr = new XMLHttpRequest()
                    xhr.open('POST', vditor.options.upload.linkToImgUrl)
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                const responseJSON = JSON.parse(xhr.responseText)
                                const original = target.getAttribute('src')
                                vditor.editor.element.selectionStart = vditor.editor.element.value.split(original)[0].length
                                vditor.editor.element.selectionEnd = vditor.editor.element.selectionStart + original.length
                                insertText(vditor.editor.element, responseJSON.url, '', true)
                            }
                        }
                    }
                    xhr.send(JSON.stringify({url: target.getAttribute('src')}))
                }

                return `![${target.getAttribute('alt')}](${target.getAttribute('src')})`
            },
        })

        turndownService.use(gfm)

        let markdownStr = turndownService.turndown(
            event.clipboardData.getData('text/html'))

        if (onlyMultiCode) {
            const tempElement = document.createElement('div')
            tempElement.innerHTML = event.clipboardData.getData('text/html')
            if (tempElement.querySelectorAll('pre').length > 1) {
                onlyMultiCode = false
            } else if (markdownStr.substr(0, 3) !== '```' ||
                markdownStr.substr(markdownStr.length - 3, 3) !== '```') {
                onlyMultiCode = false
            }
        }
        if (onlyMultiCode) {
            insertText(vditor.editor.element,
                '```\n' + event.clipboardData.getData('text/plain') + '\n```',
                '', true)
        } else {
            insertText(vditor.editor.element, markdownStr, '', true)
        }
    }

    private bindEvent(vditor: Vditor) {
        this.element.addEventListener('input', () => {
            if (vditor.options.counter > 0) {
                vditor.counter.render(this.element.value.length, vditor.options.counter)
            }

            vditor.options.input && vditor.options.input(this.element.value, vditor.preview && vditor.preview.element)

            vditor.hint && vditor.hint.render()

            if (vditor.options.cache) {
                localStorage.setItem(`vditor${vditor.id}`, vditor.editor.element.value)
            }

            vditor.preview && vditor.preview.render(vditor)
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
        this.element.addEventListener('scroll', () => {
            if (vditor.preview.element.style.display === 'none' && !vditor.preview) {
                return
            }
            const textScrollTop = this.element.scrollTop
            const textHeight = this.element.clientHeight
            const textScrollHeight = this.element.scrollHeight
            const preview = vditor.preview.element
            if ((textScrollTop / textHeight > 0.5)) {
                preview.scrollTop = (textScrollTop + textHeight) *
                    preview.scrollHeight / textScrollHeight - textHeight
            } else {
                preview.scrollTop = textScrollTop *
                    preview.scrollHeight / textScrollHeight
            }
        })

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

        let TurndownService:any
        const html2md = this.html2md
        this.element.addEventListener('paste', (event: any) => {
            event.stopPropagation()
            event.preventDefault()

            if (event.clipboardData.getData('text/html').replace(/(^\s*)|(\s*)$/g, '') !== '') {
                if (!TurndownService) {
                    import(/* webpackChunkName: "vditor" */ 'turndown').then(turndown => {
                        TurndownService  = turndown.default
                        html2md(TurndownService,vditor, event)
                    }).catch(err => {
                        console.log('Failed to load turndown', err);
                    });
                    return
                }
                html2md(TurndownService,vditor, event)

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

            const event = document.createEvent('HTMLEvents');
            event.initEvent('input', true, false);
            textarea.dispatchEvent(event);
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

export {Editor, insertText}