import octocatPng from "../../assets/images/octocat.png"
import trollfacePng from "../../assets/images/trollface.png"

export class OptionsClass {
    options: Options;
    private defaultOptions: Options = {
        height: 'auto',
        width: 'auto',
        theme: 'classic',
        placeholder: '',
        lang: 'zh_CN',
        draggable: false,
        previewShow: false,
        counter: 0,
        upload: {
            imgPath: '',
            max: 10,
            LinkToImgPath: '',
        },
        classes: {
            preview: ''
        },
        commonEmoji: {
            "+1": "👍",
            "-1": "👎",
            "100": "💯",
            "octocat": octocatPng,
            "trollface": trollfacePng,
        },
        toolbar: [{
            name: 'emoji',
            hotkey: '⌘ e'
        }, {
            name: 'headings',
            hotkey: '⌘ h'
        }, {
            name: 'bold',
            prefix: '**',
            suffix: '**',
            hotkey: '⌘ b'
        }, {
            name: 'italic',
            prefix: '*',
            suffix: '*',
            hotkey: '⌘ i'
        }, {
            name: 'strike',
            prefix: '~~',
            suffix: '~~',
            hotkey: '⌘ s'
        }, {
            name: '|'
        }, {
            name: 'line',
            prefix: '* * *\n',
            hotkey: '⌘ d'
        }, {
            name: 'quote',
            prefix: '> ',
            hotkey: '⌘ r'
        }, {
            name: '|'
        }, {
            name: 'list',
            prefix: '* ',
            hotkey: '⌘ l'
        }, {
            name: 'ordered-list',
            prefix: '1. ',
            hotkey: '⌘ o'
        }, {
            name: 'check',
            prefix: '* [ ] ',
            hotkey: '⌘ j'
        }, {
            name: '|'
        }, {
            name: 'code',
            prefix: '```\n',
            suffix: '\n```',
            hotkey: '⌘ u'
        }, {
            name: 'inline-code',
            prefix: '`',
            suffix: '`',
            hotkey: '⌘ g'
        }, {
            name: '|'
        }, {
            name: 'undo',
            hotkey: '⌘ z'
        }, {
            name: 'redo',
            hotkey: '⌘ y'
        }, {
            name: '|'
        }, {
            name: 'table',
            prefix: '| ',
            suffix: ' |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |',
            hotkey: '⌘ m'
        }, {
            name: 'link',
            prefix: '[',
            suffix: '](http://)',
            hotkey: '⌘ k'
        }, {
            name: '|'
        }, {
            name: 'preview',
            hotkey: '⌘ p'
        }, {
            name: 'fullscreen',
            hotkey: '⌘ f'
        }, {
            name: 'help',
            hotkey: '⌘ .'
        }, {
            name: 'br'
        }],
    }

    constructor(options: Options) {
        this.options = options
    }

    merge(): Options {
        let toolbar: Array<MenuItem> = []
        if (this.options && this.options.toolbar) {
            this.options.toolbar.forEach((menuItem) => {
                let currentMenuItem: MenuItem
                this.defaultOptions.toolbar.forEach((defaultMenuItem: MenuItem) => {
                    if (typeof menuItem === 'string' && defaultMenuItem.name === menuItem) {
                        currentMenuItem = defaultMenuItem
                    }
                    if (typeof menuItem === 'object' && defaultMenuItem.name === menuItem.name) {
                        currentMenuItem = Object.assign({}, defaultMenuItem, menuItem)
                    }
                })
                toolbar.push(currentMenuItem)
            })
        }

        const mergedOptions = Object.assign({}, this.defaultOptions, this.options)

        if (toolbar.length > 0) {
            mergedOptions.toolbar = toolbar
        }

        return mergedOptions
    }
}