import {insertText} from "../editor/index";

export class Hotkey {
    editorElement: HTMLTextAreaElement
    toolbarElements: any
    options: Options
    hintElement: HTMLElement

    constructor(vditor: Vditor) {
        this.editorElement = vditor.editor.element
        this.toolbarElements = vditor.toolbar.elements
        this.options = vditor.options
        this.hintElement = vditor.hint.element
        this.bindHotkey()
    }

    private bindHotkey(): void {
        this.editorElement.addEventListener('keydown', (event) => {
            if (this.options.esc) {
                if (event.key.toLowerCase() === 'Escape'.toLowerCase()) {
                    this.options.esc(this.editorElement.value)
                }
            }

            if (this.options.ctrlEnter) {
                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'enter') {
                    this.options.ctrlEnter(this.editorElement.value)
                }
            }

            this.options.toolbar.forEach((menuItem: MenuItem) => {
                if (!menuItem.hotkey) {
                    return
                }
                const hotkeys = menuItem.hotkey.split(' ')
                if ((hotkeys[0] === 'ctrl' || hotkeys[0] === '⌘') && (event.metaKey || event.ctrlKey)) {
                    if (event.key === hotkeys[1]) {
                        this.toolbarElements[menuItem.name].children[0].click()
                        event.preventDefault()
                        event.stopPropagation()
                    }
                }
            })

            if (this.options.atUser || this.toolbarElements.emoji) {
                this.hint(event)
            }
        })
    }

    private hint(event: KeyboardEvent) {
        if (this.hintElement.querySelectorAll('li').length === 0 ||
            this.hintElement.style.display === 'none') {
            return
        }

        const currentHintElement = this.hintElement.querySelector('.vditor-hint--current')

        if (event.key.toLowerCase() === 'arrowdown') {
            event.preventDefault()
            event.stopPropagation()
            if (!currentHintElement.nextElementSibling) {
                this.hintElement.children[0].className = 'vditor-hint--current'
            } else {
                currentHintElement.nextElementSibling.className = 'vditor-hint--current'
            }
            currentHintElement.removeAttribute('class')
        } else if (event.key.toLowerCase() === 'arrowup') {
            event.preventDefault()
            event.stopPropagation()
            if (!currentHintElement.previousElementSibling) {
                const length = this.hintElement.children.length
                this.hintElement.children[length - 1].className = 'vditor-hint--current'
            } else {
                currentHintElement.previousElementSibling.className = 'vditor-hint--current'
            }
            currentHintElement.removeAttribute('class')
        } else if (event.key.toLowerCase() === 'enter') {
            event.preventDefault()
            event.stopPropagation()
            this.hintElement.style.display = 'none'

            const value = currentHintElement.getAttribute('data-value')
            const splitChar = value.indexOf('@') === 0 ? '@' : ':'

            this.editorElement.selectionStart = this.editorElement.value.substr(0, this.editorElement.selectionEnd).lastIndexOf(splitChar)
            insertText(this.editorElement, value, '', true)
        }
    }
}