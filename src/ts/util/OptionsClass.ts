export class OptionsClass {
    options: Options;
    private defaultOptions: Options = {
        height: 100,
        width: 'auto',
        theme: 'classic',
        placeholder: '',
        i18n: 'zh_CN',
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
        staticServePath: '',
        atUserCallback: '',
        commonEmoji: {
            "+1": "👍",
            "-1": "👎",
            "100": "💯",
            "1234": "🔢",
            "8ball": "🎱",
            "a": "🅰",
        },
        toolbar: ['emoji', 'bold']
    }

    constructor(options: Options) {
        this.options = options
        this.merge()
    }

    merge(): Options {
        return Object.assign({}, this.defaultOptions, this.options)
    }
}