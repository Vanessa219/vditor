import {Emoji} from './emoji'
import {Bold} from './Bold'

export class Toolbar {
    menuElements: any
    private options: Options

    constructor(options: Options, editorElement: HTMLTextAreaElement) {
        this.options = options
        this.menuElements = []

        this.options.toolbar.forEach((menuItem: MenuItem) => {
            let menuItemObj
            switch (menuItem.name) {
                case 'emoji':
                    menuItemObj = new Emoji()
                    break
                case 'bold':
                    menuItemObj = new Bold()
                    break
                default:
                    console.log('menu item no matched')
                    break
            }
            this.menuElements[menuItem.name] = menuItemObj.genElement(menuItem, options.i18n, editorElement)
        })
    }

    genElement() {
        return this.menuElements
    }
}