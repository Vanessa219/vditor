import {Emoji} from './emoji'
import {Bold} from './Bold'

export class Toolbar {
    elements: any

    constructor(vditor: Vditor) {
        const options = vditor.options
        this.elements = {}

        options.toolbar.forEach((menuItem: MenuItem) => {
            let menuItemObj
            switch (menuItem.name) {
                case 'emoji':
                    menuItemObj = new Emoji(vditor, menuItem)
                    break
                case 'bold':
                    menuItemObj = new Bold(vditor, menuItem)
                    break
                default:
                    console.log('menu item no matched')
                    break
            }
            this.elements[menuItem.name] = menuItemObj.element
        })
    }
}