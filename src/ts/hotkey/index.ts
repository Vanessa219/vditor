export class Hotkey {
    editorElement: HTMLTextAreaElement
    toolbarElements: any
    options: Options

    constructor(vditor:Vditor) {
        this.editorElement = vditor.editor.element
        this.toolbarElements = vditor.toolbar.elements
        this.options = vditor.options
        this.bindHotkey()
    }

    bindHotkey(): void {
        this.editorElement.addEventListener('keydown', (event) => {
            this.options.toolbar.forEach((menuItem: MenuItem) => {
                const hotkeys = menuItem.hotkey.split(' ')
                if ((hotkeys[0] === 'ctrl' || hotkeys[0] === '⌘') && (event.metaKey || event.ctrlKey)) {
                    if (event.key === hotkeys[1]) {
                        if (menuItem.name === 'emoji') {
                            // TODO: panel
                        } else {
                            this.toolbarElements[menuItem.name].click()
                        }
                        event.preventDefault()
                        event.stopPropagation()
                    }
                }
            })
        })
    }
}