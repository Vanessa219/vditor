import { Constants } from "../constants";
import { merge } from "./merge";

export class Options {
    public options: IOptions;
    private defaultOptions: IOptions = {
        after: undefined,
        cache: {
            enable: true,
        },
        cdn: Constants.CDN,
        classes: {
            preview: "",
        },
        comment: {
            enable: false,
        },
        counter: {
            enable: false,
            type: "markdown",
        },
        debugger: false,
        fullscreen: {
            index: 90,
        },
        height: "auto",
        hint: {
            delay: 200,
            emoji: {
                "+1": "👍",
                "-1": "👎",
                confused: "😕",
                eyes: "👀️",
                heart: "❤️",
                rocket: "🚀️",
                smile: "😄",
                tada: "🎉️",
            },
            emojiPath: `${Constants.CDN}/dist/images/emoji`,
            extend: [],
            parse: true,
        },
        icon: "ant",
        lang: "zh_CN",
        i18n: {
            alignCenter: "居中",
            alignLeft: "居左",
            alignRight: "居右",
            alternateText: "替代文本",
            bold: "粗体",
            both: "编辑 & 预览",
            check: "任务列表",
            close: "关闭",
            code: "代码块",
            "code-theme": "代码块主题预览",
            column: "列",
            comment: "评论",
            confirm: "确定",
            "content-theme": "内容主题预览",
            copied: "已复制",
            copy: "复制",
            "delete-column": "删除列",
            "delete-row": "删除行",
            devtools: "开发者工具",
            down: "下",
            downloadTip: "该浏览器不支持下载功能",
            edit: "编辑",
            "edit-mode": "切换编辑模式",
            emoji: "表情",
            export: "导出",
            fileTypeError: "文件类型不允许上传",
            footnoteRef: "脚注标识",
            fullscreen: "全屏切换",
            generate: "生成中",
            headings: "标题",
            help: "帮助",
            imageURL: "图片地址",
            indent: "列表缩进",
            info: "关于",
            "inline-code": "行内代码",
            "insert-after": "末尾插入行",
            "insert-before": "起始插入行",
            insertColumnLeft: "在左边插入一列",
            insertColumnRight: "在右边插入一列",
            insertRowAbove: "在上方插入一行",
            insertRowBelow: "在下方插入一行",
            instantRendering: "即时渲染",
            italic: "斜体",
            language: "语言",
            line: "分隔线",
            link: "链接",
            linkRef: "引用标识",
            list: "无序列表",
            more: "更多",
            nameEmpty: "文件名不能为空",
            "ordered-list": "有序列表",
            outdent: "列表反向缩进",
            outline: "大纲",
            over: "超过",
            performanceTip: "实时预览需 ${x}ms，可点击编辑 & 预览按钮进行关闭",
            preview: "预览",
            quote: "引用",
            record: "开始录音/结束录音",
            "record-tip": "该设备不支持录音功能",
            recording: "录音中...",
            redo: "重做",
            remove: "删除",
            row: "行",
            spin: "旋转",
            splitView: "分屏预览",
            strike: "删除线",
            table: "表格",
            textIsNotEmpty: "文本（不能为空）",
            title: "标题",
            tooltipText: "提示文本",
            undo: "撤销",
            up: "上",
            update: "更新",
            upload: "上传图片或文件",
            uploadError: "上传错误",
            uploading: "上传中...",
            wysiwyg: "所见即所得",
        },
        mode: "ir",
        outline: {
            enable: false,
            position: "left",
        },
        placeholder: "",
        preview: {
            actions: ["desktop", "tablet", "mobile", "mp-wechat", "zhihu"],
            delay: 1000,
            hljs: Constants.HLJS_OPTIONS,
            markdown: Constants.MARKDOWN_OPTIONS,
            math: Constants.MATH_OPTIONS,
            maxWidth: 800,
            mode: "both",
            theme: Constants.THEME_OPTIONS,
        },
        resize: {
            enable: false,
            position: "bottom",
        },
        theme: "classic",
        toolbar: [
            "emoji",
            "headings",
            "bold",
            "italic",
            "strike",
            "link",
            "|",
            "list",
            "ordered-list",
            "check",
            "outdent",
            "indent",
            "|",
            "quote",
            "line",
            "code",
            "inline-code",
            "insert-before",
            "insert-after",
            "|",
            "upload",
            "record",
            "table",
            "|",
            "undo",
            "redo",
            "|",
            "fullscreen",
            "edit-mode",
            {
                name: "more",
                toolbar: [
                    "both",
                    "code-theme",
                    "content-theme",
                    "export",
                    "outline",
                    "preview",
                    "devtools",
                    "info",
                    "help",
                ],
            },
        ],
        toolbarConfig: {
            hide: false,
            pin: false,
        },
        typewriterMode: false,
        undoDelay: 800,
        upload: {
            extraData: {},
            fieldName: "file[]",
            filename: (name: string) => name.replace(/\W/g, ""),
            linkToImgUrl: "",
            max: 10 * 1024 * 1024,
            multiple: true,
            url: "",
            withCredentials: false,
        },
        value: "",
        width: "auto",
    };

    constructor(options: IOptions) {
        this.options = options;
    }

    public merge(): IOptions {
        if (this.options) {
            if (this.options.toolbar) {
                this.options.toolbar = this.mergeToolbar(this.options.toolbar);
            } else {
                this.options.toolbar = this.mergeToolbar(
                    this.defaultOptions.toolbar
                );
            }
            if (this.options.preview?.theme?.list) {
                this.defaultOptions.preview.theme.list = this.options.preview.theme.list;
            }
            if (this.options.hint?.emoji) {
                this.defaultOptions.hint.emoji = this.options.hint.emoji;
            }
            if (this.options.comment) {
                this.defaultOptions.comment = this.options.comment;
            }
        }

        const mergedOptions = merge(this.defaultOptions, this.options);

        if (mergedOptions.cache.enable && !mergedOptions.cache.id) {
            throw new Error(
                "need options.cache.id, see https://ld246.com/article/1549638745630#options"
            );
        }

        return mergedOptions;
    }

    private mergeToolbar(toolbar: Array<string | IMenuItem>) {
        const toolbarItem = [
            {
                icon: '<svg><use xlink:href="#vditor-icon-export"></use></svg>',
                name: "export",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘E",
                icon: '<svg><use xlink:href="#vditor-icon-emoji"></use></svg>',
                name: "emoji",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘H",
                icon:
                    '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
                name: "headings",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘B",
                icon: '<svg><use xlink:href="#vditor-icon-bold"></use></svg>',
                name: "bold",
                prefix: "**",
                suffix: "**",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘I",
                icon: '<svg><use xlink:href="#vditor-icon-italic"></use></svg>',
                name: "italic",
                prefix: "*",
                suffix: "*",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘D",
                icon: '<svg><use xlink:href="#vditor-icon-strike"></use></svg>',
                name: "strike",
                prefix: "~~",
                suffix: "~~",
                tipPosition: "ne",
            },
            {
                hotkey: "⌘K",
                icon: '<svg><use xlink:href="#vditor-icon-link"></use></svg>',
                name: "link",
                prefix: "[",
                suffix: "](https://)",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘L",
                icon: '<svg><use xlink:href="#vditor-icon-list"></use></svg>',
                name: "list",
                prefix: "* ",
                tipPosition: "n",
            },
            {
                hotkey: "⌘O",
                icon:
                    '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
                name: "ordered-list",
                prefix: "1. ",
                tipPosition: "n",
            },
            {
                hotkey: "⌘J",
                icon: '<svg><use xlink:href="#vditor-icon-check"></use></svg>',
                name: "check",
                prefix: "* [ ] ",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘I",
                icon:
                    '<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',
                name: "outdent",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘O",
                icon: '<svg><use xlink:href="#vditor-icon-indent"></use></svg>',
                name: "indent",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘;",
                icon: '<svg><use xlink:href="#vditor-icon-quote"></use></svg>',
                name: "quote",
                prefix: "> ",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘H",
                icon: '<svg><use xlink:href="#vditor-icon-line"></use></svg>',
                name: "line",
                prefix: "---",
                tipPosition: "n",
            },
            {
                hotkey: "⌘U",
                icon: '<svg><use xlink:href="#vditor-icon-code"></use></svg>',
                name: "code",
                prefix: "```",
                suffix: "\n```",
                tipPosition: "n",
            },
            {
                hotkey: "⌘G",
                icon:
                    '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
                name: "inline-code",
                prefix: "`",
                suffix: "`",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘B",
                icon: '<svg><use xlink:href="#vditor-icon-before"></use></svg>',
                name: "insert-before",
                tipPosition: "n",
            },
            {
                hotkey: "⇧⌘E",
                icon: '<svg><use xlink:href="#vditor-icon-after"></use></svg>',
                name: "insert-after",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
                name: "upload",
                tipPosition: "n",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-record"></use></svg>',
                name: "record",
                tipPosition: "n",
            },
            {
                hotkey: "⌘M",
                icon: '<svg><use xlink:href="#vditor-icon-table"></use></svg>',
                name: "table",
                prefix: "| col1",
                suffix:
                    " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
                tipPosition: "n",
            },
            {
                name: "|",
            },
            {
                hotkey: "⌘Z",
                icon: '<svg><use xlink:href="#vditor-icon-undo"></use></svg>',
                name: "undo",
                tipPosition: "nw",
            },
            {
                hotkey: "⌘Y",
                icon: '<svg><use xlink:href="#vditor-icon-redo"></use></svg>',
                name: "redo",
                tipPosition: "nw",
            },
            {
                name: "|",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-more"></use></svg>',
                name: "more",
                tipPosition: "e",
            },
            {
                hotkey: "⌘'",
                icon:
                    '<svg><use xlink:href="#vditor-icon-fullscreen"></use></svg>',
                name: "fullscreen",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-edit"></use></svg>',
                name: "edit-mode",
                tipPosition: "nw",
            },
            {
                hotkey: "⌘P",
                icon: '<svg><use xlink:href="#vditor-icon-both"></use></svg>',
                name: "both",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg><use xlink:href="#vditor-icon-preview"></use></svg>',
                name: "preview",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg><use xlink:href="#vditor-icon-align-center"></use></svg>',
                name: "outline",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-theme"></use></svg>',
                name: "content-theme",
                tipPosition: "nw",
            },
            {
                icon:
                    '<svg><use xlink:href="#vditor-icon-code-theme"></use></svg>',
                name: "code-theme",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-bug"></use></svg>',
                name: "devtools",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-info"></use></svg>',
                name: "info",
                tipPosition: "nw",
            },
            {
                icon: '<svg><use xlink:href="#vditor-icon-help"></use></svg>',
                name: "help",
                tipPosition: "nw",
            },
            {
                name: "br",
            },
        ];
        const toolbarResult: IMenuItem[] = [];
        toolbar.forEach((menuItem: IMenuItem) => {
            let currentMenuItem = menuItem;
            toolbarItem.forEach((defaultMenuItem: IMenuItem) => {
                if (
                    typeof menuItem === "string" &&
                    defaultMenuItem.name === menuItem
                ) {
                    currentMenuItem = defaultMenuItem;
                }
                if (
                    typeof menuItem === "object" &&
                    defaultMenuItem.name === menuItem.name
                ) {
                    currentMenuItem = Object.assign(
                        {},
                        defaultMenuItem,
                        menuItem
                    );
                }
            });
            if (menuItem.toolbar) {
                currentMenuItem.toolbar = this.mergeToolbar(menuItem.toolbar);
            }
            toolbarResult.push(currentMenuItem);
        });
        return toolbarResult;
    }
}
