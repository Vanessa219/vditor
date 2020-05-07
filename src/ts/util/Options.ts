import insertAfterSVG from "../../assets/icons/after.svg";
import outlinerSVG from "../../assets/icons/align-center.svg";
import insertBeforeSVG from "../../assets/icons/before.svg";
import boldSVG from "../../assets/icons/bold.svg";
import bothSVG from "../../assets/icons/both.svg";
import bugSVG from "../../assets/icons/bug.svg";
import checkSVG from "../../assets/icons/check.svg";
import codeThemeSVG from "../../assets/icons/code-theme.svg";
import codeSVG from "../../assets/icons/code.svg";
import editSVG from "../../assets/icons/edit.svg";
import emojiSVG from "../../assets/icons/emoji.svg";
import exportSVG from "../../assets/icons/export.svg";
import fullscreenSVG from "../../assets/icons/fullscreen.svg";
import headingsSVG from "../../assets/icons/headings.svg";
import helpSVG from "../../assets/icons/help.svg";
import indentSVG from "../../assets/icons/indent.svg";
import infoSVG from "../../assets/icons/info.svg";
import inlineCodeSVG from "../../assets/icons/inline-code.svg";
import italicSVG from "../../assets/icons/italic.svg";
import lineSVG from "../../assets/icons/line.svg";
import linkSVG from "../../assets/icons/link.svg";
import listSVG from "../../assets/icons/list.svg";
import moreSVG from "../../assets/icons/more.svg";
import orderedListVG from "../../assets/icons/ordered-list.svg";
import formatSVG from "../../assets/icons/outdent.svg";
import outdentSVG from "../../assets/icons/outdent.svg";
import previewSVG from "../../assets/icons/preview.svg";
import quoteSVG from "../../assets/icons/quote.svg";
import recordSVG from "../../assets/icons/record.svg";
import redoSVG from "../../assets/icons/redo.svg";
import strikekSVG from "../../assets/icons/strike.svg";
import tableSVG from "../../assets/icons/table.svg";
import contentThemeSVG from "../../assets/icons/theme.svg";
import undoSVG from "../../assets/icons/undo.svg";
import uploadSVG from "../../assets/icons/upload.svg";
import {VDITOR_VERSION} from "../constants";

export class Options {
    public options: IOptions;
    private defaultOptions: IOptions = {
        after: undefined,
        cache: {
            enable: true,
        },
        cdn: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`,
        classes: {
            preview: "",
        },
        counter: {
            enable: false,
            type: "markdown",
        },
        debugger: false,
        height: "auto",
        hint: {
            delay: 200,
            emoji: {
                "+1": "👍",
                "-1": "👎",
                "confused": "😕",
                "eyes": "👀️",
                "heart": "❤️",
                "rocket": "🚀️",
                "smile": "😄",
                "tada": "🎉️",
            },
            emojiPath: `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}/dist/images/emoji`,
        },
        keymap: {
            deleteLine: "⌘-Backspace",
            duplicate: "⌘-D",
        },
        lang: "zh_CN",
        mode: "wysiwyg",
        outline: false,
        placeholder: "",
        preview: {
            delay: 1000,
            hljs: {
                enable: true,
                lineNumber: false,
                style: "github",
            },
            markdown: {
                autoSpace: false,
                chinesePunct: false,
                codeBlockPreview: true,
                fixTermTypo: false,
                footnotes: true,
                sanitize: false,
                setext: false,
                theme: "light",
                toc: false,
            },
            math: {
                engine: "KaTeX",
                inlineDigit: false,
                macros: {},
            },
            maxWidth: 800,
            mode: "both",
            marker: false,
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
                    "format",
                    "devtools",
                    "info",
                    "help",
                ],
            }],
        toolbarConfig: {
            hide: false,
            pin: false,
        },
        typewriterMode: false,
        upload: {
            filename: (name: string) => name.replace(/\W/g, ""),
            linkToImgUrl: "",
            max: 10 * 1024 * 1024,
            url: "",
            withCredentials: false,
        },
        value: "",
        width: "auto",
    };

    private toolbarItem = [{
        icon: exportSVG,
        name: "export",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-E",
        icon: emojiSVG,
        name: "emoji",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-H",
        icon: headingsSVG,
        name: "headings",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-B",
        icon: boldSVG,
        name: "bold",
        prefix: "**",
        suffix: "**",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-I",
        icon: italicSVG,
        name: "italic",
        prefix: "*",
        suffix: "*",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-S",
        icon: strikekSVG,
        name: "strike",
        prefix: "~~",
        suffix: "~~",
        tipPosition: "ne",
    }, {
        hotkey: "⌘-K",
        icon: linkSVG,
        name: "link",
        prefix: "[",
        suffix: "](https://)",
        tipPosition: "n",
    }, {
        name: "|",
    }, {
        hotkey: "⌘-L",
        icon: listSVG,
        name: "list",
        prefix: "* ",
        tipPosition: "n",
    }, {
        hotkey: "⌘-O",
        icon: orderedListVG,
        name: "ordered-list",
        prefix: "1. ",
        tipPosition: "n",
    }, {
        hotkey: "⌘-J",
        icon: checkSVG,
        name: "check",
        prefix: "* [ ] ",
        tipPosition: "n",
    }, {
        hotkey: "⌘-⇧-I",
        icon: outdentSVG,
        name: "outdent",
        tipPosition: "n",
    }, {
        hotkey: "⌘-⇧-O",
        icon: indentSVG,
        name: "indent",
        tipPosition: "n",
    }, {
        name: "|",
    }, {
        hotkey: "⌘-;",
        icon: quoteSVG,
        name: "quote",
        prefix: "> ",
        tipPosition: "n",
    }, {
        hotkey: "⌘-⇧-H",
        icon: lineSVG,
        name: "line",
        prefix: "---",
        tipPosition: "n",
    }, {
        hotkey: "⌘-U",
        icon: codeSVG,
        name: "code",
        prefix: "```\n",
        suffix: "\n```",
        tipPosition: "n",
    }, {
        hotkey: "⌘-G",
        icon: inlineCodeSVG,
        name: "inline-code",
        prefix: "`",
        suffix: "`",
        tipPosition: "n",
    }, {
        hotkey: "⌘-⇧-B",
        icon: insertBeforeSVG,
        name: "insert-before",
        tipPosition: "n",
    }, {
        hotkey: "⌘-⇧-E",
        icon: insertAfterSVG,
        name: "insert-after",
        tipPosition: "n",
    }, {
        name: "|",
    }, {
        icon: uploadSVG,
        name: "upload",
        tipPosition: "n",
    }, {
        icon: recordSVG,
        name: "record",
        tipPosition: "n",
    }, {
        hotkey: "⌘-M",
        icon: tableSVG,
        name: "table",
        prefix: "| col1",
        suffix: " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
        tipPosition: "n",
    }, {
        name: "|",
    }, {
        hotkey: "⌘-Z",
        icon: undoSVG,
        name: "undo",
        tipPosition: "nw",
    }, {
        hotkey: "⌘-Y",
        icon: redoSVG,
        name: "redo",
        tipPosition: "nw",
    }, {
        name: "|",
    }, {
        icon: moreSVG,
        name: "more",
        tipPosition: "e",
    }, {
        hotkey: "⌘-'",
        icon: fullscreenSVG,
        name: "fullscreen",
        tipPosition: "nw",
    }, {
        icon: editSVG,
        name: "edit-mode",
        tipPosition: "nw",
    }, {
        hotkey: "⌘-P",
        icon: bothSVG,
        name: "both",
        tipPosition: "nw",
    }, {
        icon: previewSVG,
        name: "preview",
        tipPosition: "nw",
    }, {
        hotkey: "⌘-⇧-F",
        icon: formatSVG,
        name: "format",
        tipPosition: "nw",
    }, {
        icon: outlinerSVG,
        name: "outline",
        tipPosition: "nw",
    }, {
        icon: contentThemeSVG,
        name: "content-theme",
        tipPosition: "nw",
    }, {
        icon: codeThemeSVG,
        name: "code-theme",
        tipPosition: "nw",
    }, {
        icon: bugSVG,
        name: "devtools",
        tipPosition: "nw",
    }, {
        icon: infoSVG,
        name: "info",
        tipPosition: "nw",
    }, {
        icon: helpSVG,
        name: "help",
        tipPosition: "nw",
    }, {
        name: "br",
    }];

    constructor(options: IOptions) {
        this.options = options;
    }

    public merge(): IOptions {
        if (this.options) {
            if (this.options.upload) {
                this.options.upload = Object.assign({}, this.defaultOptions.upload, this.options.upload);
            }

            if (this.options.cache) {
                this.options.cache = Object.assign({}, this.defaultOptions.cache, this.options.cache);
            }

            if (this.options.classes) {
                this.options.classes = Object.assign({}, this.defaultOptions.classes, this.options.classes);
            }

            if (this.options.keymap) {
                this.options.keymap = Object.assign({}, this.defaultOptions.keymap, this.options.keymap);
            }

            if (this.options.preview) {
                if (this.options.preview.hljs) {
                    this.options.preview.hljs =
                        Object.assign({}, this.defaultOptions.preview.hljs, this.options.preview.hljs);
                }
                if (this.options.preview.math) {
                    this.options.preview.math =
                        Object.assign({}, this.defaultOptions.preview.math, this.options.preview.math);
                }
                if (this.options.preview.markdown) {
                    this.options.preview.markdown =
                        Object.assign({}, this.defaultOptions.preview.markdown, this.options.preview.markdown);
                }
                this.options.preview = Object.assign({}, this.defaultOptions.preview, this.options.preview);
            }

            if (this.options.hint) {
                this.options.hint = Object.assign({}, this.defaultOptions.hint, this.options.hint);
            }

            if (this.options.resize) {
                this.options.resize = Object.assign({}, this.defaultOptions.resize, this.options.resize);
            }

            if (this.options.counter) {
                this.options.counter = Object.assign({}, this.defaultOptions.counter, this.options.counter);
            }

            if (this.options.toolbarConfig) {
                this.options.toolbarConfig =
                    Object.assign({}, this.defaultOptions.toolbarConfig, this.options.toolbarConfig);
            }

            if (this.options.toolbar) {
                this.options.toolbar = this.mergeToolbar(this.options.toolbar);
            } else {
                this.options.toolbar = this.mergeToolbar(this.defaultOptions.toolbar);
            }
        }

        const mergedOptions = Object.assign({}, this.defaultOptions, this.options);

        if (mergedOptions.cache.enable && !mergedOptions.cache.id) {
            throw new Error("need options.cache.id, see https://hacpai.com/article/1549638745630#options");
        }

        return mergedOptions;
    }

    private mergeToolbar(toolbar: Array<string | IMenuItem>) {
        const toolbarResult: IMenuItem[] = [];
        toolbar.forEach((menuItem: IMenuItem) => {
            let currentMenuItem = menuItem;
            this.toolbarItem.forEach((defaultMenuItem: IMenuItem) => {
                if (typeof menuItem === "string" && defaultMenuItem.name === menuItem) {
                    currentMenuItem = defaultMenuItem;
                }
                if (typeof menuItem === "object" && defaultMenuItem.name === menuItem.name) {
                    currentMenuItem = Object.assign({}, defaultMenuItem, menuItem);
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
