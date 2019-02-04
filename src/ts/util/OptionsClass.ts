import allEmoji from '../emoji/allEmoji.js'

export class OptionsClass {
    options: Options;
    private defaultOptions: Options = {
        cache: true,
        height: 'auto',
        width: 'auto',
        placeholder: '',
        lang: 'zh_CN',
        draggable: false,
        preview: {
            delay: 1000,
            show: false
        },
        hint: {
            delay: 200,
            emoji: [
                "+1",
                "-1",
                "100",
                "octocat",
                "trollface",
            ],
        },
        counter: 0,
        upload: {
            url: '',
            max: 10 * 1024 * 1024,
            linkToImgUrl: '',
        },
        classes: {
            preview: ''
        },
        toolbar: [{
            name: 'emoji',
            hotkey: '⌘-e',
            tipPosition: 'ne'
        }, {
            name: 'headings',
            hotkey: '⌘-h',
            tipPosition: 'ne'
        }, {
            name: 'bold',
            prefix: '**',
            suffix: '**',
            hotkey: '⌘-b',
            tipPosition: 'ne'
        }, {
            name: 'italic',
            prefix: '*',
            suffix: '*',
            hotkey: '⌘-i',
            tipPosition: 'ne'
        }, {
            name: 'strike',
            prefix: '~~',
            suffix: '~~',
            hotkey: '⌘-s',
            tipPosition: 'ne'
        }, {
            name: '|'
        }, {
            name: 'line',
            prefix: '---\n',
            hotkey: '⌘-d',
            tipPosition: 'n'
        }, {
            name: 'quote',
            prefix: '> ',
            hotkey: '⌘-.',
            tipPosition: 'n'
        }, {
            name: '|'
        }, {
            name: 'list',
            prefix: '* ',
            hotkey: '⌘-l',
            tipPosition: 'n'
        }, {
            name: 'ordered-list',
            prefix: '1. ',
            hotkey: '⌘-o',
            tipPosition: 'n'
        }, {
            name: 'check',
            prefix: '* [ ] ',
            hotkey: '⌘-j',
            tipPosition: 'n'
        }, {
            name: '|'
        }, {
            name: 'code',
            prefix: '```\n',
            suffix: '\n```',
            hotkey: '⌘-u',
            tipPosition: 'n'
        }, {
            name: 'inline-code',
            prefix: '`',
            suffix: '`',
            hotkey: '⌘-g',
            tipPosition: 'n'
        }, {
            name: '|'
        }, {
            name: 'undo',
            hotkey: '⌘-z',
            tipPosition: 'n'
        }, {
            name: 'redo',
            hotkey: '⌘-y',
            tipPosition: 'n'
        }, {
            name: '|'
        }, {
            name: 'upload',
            tipPosition: 'n'
        }, {
            name: 'link',
            prefix: '[',
            suffix: '](https://)',
            hotkey: '⌘-k',
            tipPosition: 'n'
        }, {
            name: 'table',
            prefix: '| col1',
            suffix: ' | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |',
            hotkey: '⌘-m',
            tipPosition: 'n'
        }, {
            name: 'record',
            tipPosition: 'n'
        }, {
            name: '|'
        }, {
            name: 'preview',
            hotkey: '⌘-p',
            tipPosition: 'nw'
        }, {
            name: 'fullscreen',
            hotkey: '⌘-f',
            tipPosition: 'nw'
        }, {
            name: 'info',
            hotkey: '⌘-;',
            tipPosition: 'nw'
        }, {
            name: 'help',
            hotkey: '⌘-/',
            tipPosition: 'nw'
        }, {
            name: 'br'
        }],
    }

    constructor(options: Options) {
        this.options = options
    }

    merge(): Options {
        let toolbar: Array<MenuItem> = []
        if (this.options) {
            if (this.options.toolbar) {
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

            if (this.options.upload) {
                this.options.upload = Object.assign({}, this.defaultOptions.upload, this.options.upload)
            }
        }

        const mergedOptions = Object.assign({}, this.defaultOptions, this.options)

        // array emoji to object emoji
        const objectEmoji: any = {}
        mergedOptions.hint.emoji.forEach((emoji: string) => {
            objectEmoji[emoji] = allEmoji[emoji]
        })
        mergedOptions.hint.emoji = objectEmoji

        if (toolbar.length > 0) {
            mergedOptions.toolbar = toolbar
        }

        return mergedOptions
    }
}