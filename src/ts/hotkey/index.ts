export class Hotkey {
    editorElement: HTMLTextAreaElement
    toolbarElements: any
    options: Options

    constructor(vditor: Vditor) {
        this.editorElement = vditor.editor.element
        this.toolbarElements = vditor.toolbar.elements
        this.options = vditor.options
        this.bindHotkey()
    }

    private bindHotkey(): void {
        this.editorElement.addEventListener('keydown', (event) => {
            if (this.options.esc) {
                if(event.key.toLowerCase() === 'Escape'.toLowerCase()) {
                    this.options.esc(this.editorElement.value)
                }
            }
            if (this.options.ctrlEnter) {
                if( (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'Enter'.toLowerCase()) {
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
        })
    }
}