import {VDITOR_VERSION} from "../constants";

export class Options {
    public options: IOptions;
    private defaultOptions: IOptions = {
        after: undefined,
        cache: true,
        cdn: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`,
        classes: {
            preview: "",
        },
        counter: 0,
        height: "auto",
        hint: {
            delay: 200,
            emoji: {
                "+1": "👍",
                "-1": "👎",
                "cold_sweat": "😰",
                "heart": "❤️",
            },
            emojiPath: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}/dist/images/emoji`,
        },
        keymap: {
            deleteLine: "⌘-Backspace",
            duplicate: "⌘-d",
        },
        lang: "zh_CN",
        // TODO: mode: "wysiwyg-show",
        mode: "markdown-only",
        placeholder: "",
        preview: {
            delay: 1000,
            hljs: {
                enable: true,
                lineNumber: false,
                style: "github",
            },
            inlineMathDigit: false,
            maxWidth: 768,
            mode: "both",
        },
        resize: {
            enable: false,
            position: "bottom",
        },
        toolbar: [{
            hotkey: "⌘-e",
            name: "emoji",
            tipPosition: "ne",
        }, {
            hotkey: "⌘-h",
            name: "headings",
            tipPosition: "ne",
        }, {
            hotkey: "⌘-b",
            name: "bold",
            prefix: "**",
            suffix: "**",
            tipPosition: "ne",
        }, {
            hotkey: "⌘-i",
            name: "italic",
            prefix: "*",
            suffix: "*",
            tipPosition: "ne",
        }, {
            hotkey: "⌘-s",
            name: "strike",
            prefix: "~~",
            suffix: "~~",
            tipPosition: "ne",
        }, {
            hotkey: "⌘-k",
            name: "link",
            prefix: "[",
            suffix: "](https://)",
            tipPosition: "n",
        }, {
            name: "|",
        }, {
            hotkey: "⌘-l",
            name: "list",
            prefix: "* ",
            tipPosition: "n",
        }, {
            hotkey: "⌘-o",
            name: "ordered-list",
            prefix: "1. ",
            tipPosition: "n",
        }, {
            hotkey: "⌘-j",
            name: "check",
            prefix: "* [ ] ",
            tipPosition: "n",
        }, {
            name: "|",
        }, {
            hotkey: "⌘-.",
            name: "quote",
            prefix: "> ",
            tipPosition: "n",
        }, {
            hotkey: "⌘-⇧-d",
            name: "line",
            prefix: "---",
            tipPosition: "n",
        }, {
            hotkey: "⌘-u",
            name: "code",
            prefix: "```\n",
            suffix: "\n```",
            tipPosition: "n",
        }, {
            hotkey: "⌘-g",
            name: "inline-code",
            prefix: "`",
            suffix: "`",
            tipPosition: "n",
        }, {
            name: "|",
        }, {
            name: "upload",
            tipPosition: "n",
        }, {
            name: "record",
            tipPosition: "n",
        }, {
            hotkey: "⌘-m",
            name: "table",
            prefix: "| col1",
            suffix: " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
            tipPosition: "n",
        }, {
            name: "|",
        }, {
            hotkey: "⌘-z",
            name: "undo",
            tipPosition: "n",
        }, {
            hotkey: "⌘-y",
            name: "redo",
            tipPosition: "n",
        }, {
            name: "|",
        }, {
            hotkey: "⌘-⇧-m",
            name: "wysiwyg",
            tipPosition: "nw",
        }, {
            hotkey: "⌘-p",
            name: "both",
            tipPosition: "nw",
        }, {
            hotkey: "⌘-⇧-p",
            name: "preview",
            tipPosition: "nw",
        }, {
            hotkey: "⌘-⇧-f",
            name: "format",
            tipPosition: "nw",
        }, {
            name: "|",
        }, {
            hotkey: "⌘-'",
            name: "fullscreen",
            tipPosition: "nw",
        }, {
            name: "devtools",
            tipPosition: "nw",
        }, {
            name: "info",
            tipPosition: "nw",
        }, {
            name: "help",
            tipPosition: "nw",
        }, {
            name: "br",
        }],
        typewriterMode: false,
        upload: {
            filename: (name: string) => name.replace(/\W/g, ""),
            linkToImgUrl: "",
            max: 10 * 1024 * 1024,
            url: "",
            withCredentials: false,
        },
        width: "auto",
    };

    constructor(options: IOptions) {
        this.options = options;
    }

    public merge(): IOptions {
        const toolbar: IMenuItem[] = [];
        if (this.options) {
            if (this.options.toolbar) {
                this.options.toolbar.forEach((menuItem: IMenuItem) => {
                    let currentMenuItem = menuItem;
                    this.defaultOptions.toolbar.forEach((defaultMenuItem: IMenuItem) => {
                        if (typeof menuItem === "string" && defaultMenuItem.name === menuItem) {
                            currentMenuItem = defaultMenuItem;
                        }
                        if (typeof menuItem === "object" && defaultMenuItem.name === menuItem.name) {
                            currentMenuItem = Object.assign({}, defaultMenuItem, menuItem);
                        }
                    });
                    toolbar.push(currentMenuItem);
                });
            }

            if (this.options.upload) {
                this.options.upload = Object.assign({}, this.defaultOptions.upload, this.options.upload);
            }

            if (this.options.classes) {
                this.options.classes = Object.assign({}, this.defaultOptions.classes, this.options.classes);
            }

            if (this.options.keymap) {
                this.options.keymap = Object.assign({}, this.defaultOptions.keymap, this.options.keymap);
            }

            if (this.options.preview) {
                this.options.preview = Object.assign({}, this.defaultOptions.preview, this.options.preview);
                if (this.options.preview.hljs) {
                    this.options.preview.hljs =
                        Object.assign({}, this.defaultOptions.preview.hljs, this.options.preview.hljs);
                }
            }

            if (this.options.hint) {
                this.options.hint = Object.assign({}, this.defaultOptions.hint, this.options.hint);
            }

            if (this.options.resize) {
                this.options.resize = Object.assign({}, this.defaultOptions.resize, this.options.resize);
            }
        }

        const mergedOptions = Object.assign({}, this.defaultOptions, this.options);

        if (toolbar.length > 0) {
            mergedOptions.toolbar = toolbar;
        }

        return mergedOptions;
    }
}
