export class Hotkey {
    editorElement: HTMLTextAreaElement
    toolbarElements: any
    options: Options

    constructor(toolbarElements: any, editorElement: HTMLTextAreaElement, options: Options) {
        this.editorElement = editorElement
        this.toolbarElements = toolbarElements
        this.options = options
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