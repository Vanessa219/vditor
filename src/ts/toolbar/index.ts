import {Emoji} from './emoji'
import {Bold} from './Bold'

export class Toolbar {
    menuElements: Array<HTMLElement>
    private options: Options
    private toolbar: Array<MenuItem> = [
        {
            name: 'emoji',
            icon: '',
            tip: '',
            hotkey: 'emoji hotkey'
        },
        {
            name: 'bold',
            icon: '',
            tip: '',
            hotkey: 'bold hotkey'
        }
    ]

    constructor(options: Options) {
        this.options = options
        this.menuElements = []

        this.options.toolbar.forEach((menuItem: MenuItem) => {
            const currentMenuItem = this.getMenuItem(menuItem)
            let menuItemObj
            switch (currentMenuItem.name) {
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
            this.menuElements.push(menuItemObj.genElement(currentMenuItem, options.i18n))
        })
    }

    private getMenuItem(menuItem: MenuItem) {
        let currentMenuItem: MenuItem

        this.toolbar.forEach((data: MenuItem) => {
            if (typeof menuItem === 'string') {
                if (data.name === menuItem) {
                    currentMenuItem = data
                }
            } else {
                currentMenuItem = Object.assign({}, data, menuItem)
            }
        })

        return currentMenuItem
    }

    genElement() {
        return this.menuElements
    }
}