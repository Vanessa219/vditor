
import octocatPng from "../../assets/images/octocat.png"
import trollfacePng from "../../assets/images/trollface.png"

export class OptionsClass {
    options: Options;
    private defaultOptions: Options = {
        height: 100,
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
            previewContent: ''
        },
        atUserCallback: '',
        commonEmoji: {
            "+1": "👍",
            "-1": "👎",
            "100": "💯",
            "octocat": octocatPng,
            "trollface": trollfacePng,
        },
        toolbar: [{
            name: 'emoji',
            hotkey: '⌘ /'
        }, {
            name: 'bold',
            prefix: '**',
            suffix: '**',
            hotkey: '⌘ b'
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

        console.log(this.defaultOptions, mergedOptions)

        return mergedOptions
    }
}