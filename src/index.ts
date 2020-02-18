import {VDITOR_VERSION} from "./ts/constants";
import {Counter} from "./ts/counter/index";
import {DevTools} from "./ts/devtools";
import {formatRender} from "./ts/editor/formatRender";
import {getSelectText} from "./ts/editor/getSelectText";
import {html2md} from "./ts/editor/html2md";
import {Editor} from "./ts/editor/index";
import {insertText} from "./ts/editor/insertText";
import {setSelectionByPosition, setSelectionFocus} from "./ts/editor/setSelection";
import {getCursorPosition} from "./ts/hint/getCursorPosition";
import {Hint} from "./ts/hint/index";
import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {highlightRender} from "./ts/markdown/highlightRender";
import {mathRender} from "./ts/markdown/mathRender";
import {loadLuteJs, md2htmlByPreview, md2htmlByVditor} from "./ts/markdown/md2html";
import {mediaRender} from "./ts/markdown/mediaRender";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {previewRender} from "./ts/markdown/previewRender";
import {speechRender} from "./ts/markdown/speechRender";
import {Preview} from "./ts/preview/index";
import {Resize} from "./ts/resize/index";
import {Tip} from "./ts/tip";
import {Toolbar} from "./ts/toolbar/index";
import {Ui} from "./ts/ui/index";
import {Undo} from "./ts/undo";
import {WysiwygUndo} from "./ts/undo/WysiwygUndo";
import {Upload} from "./ts/upload/index";
import {getMarkdown} from "./ts/util/getMarkdown";
import {Options} from "./ts/util/Options";
import {setPreviewMode} from "./ts/util/setPreviewMode";
import {WYSIWYG} from "./ts/wysiwyg";
import {renderDomByMd} from "./ts/wysiwyg/renderDomByMd";
import {scrollToWbr} from "./ts/wysiwyg/scrollToWbr";
import {setTheme} from "./ts/ui/setTheme";

class Vditor {

    public static codeRender = codeRender;
    public static highlightRender = highlightRender;
    public static mathRender = mathRender;
    public static mermaidRender = mermaidRender;
    public static chartRender = chartRender;
    public static abcRender = abcRender;
    public static mediaRender = mediaRender;
    public static speechRender = speechRender;
    public static md2html = md2htmlByPreview;
    public static preview = previewRender;
    public readonly version: string;
    public vditor: IVditor;

    constructor(id: string, options?: IOptions) {
        this.version = VDITOR_VERSION;

        const getOptions = new Options(options);
        const mergedOptions = getOptions.merge();

        if (!(mergedOptions.lang === "en_US" || mergedOptions.lang === "zh_CN")) {
            console.error("options.lang error, see https://hacpai.com/article/1549638745630#toc_h4_10");
            return;
        }

        this.vditor = {
            currentMode: mergedOptions.mode.indexOf("wysiwyg") > -1 ? "wysiwyg" : "markdown",
            currentPreviewMode: mergedOptions.preview.mode,
            id,
            lute: undefined,
            options: mergedOptions,
            originalInnerHTML: document.getElementById(id).innerHTML,
            tip: new Tip(),
            undo: undefined,
            wysiwyg: undefined,
            wysiwygUndo: undefined,
        };

        if (mergedOptions.counter > 0) {
            const counter = new Counter(this.vditor);
            this.vditor.counter = counter;
        }

        if (mergedOptions.mode !== "wysiwyg-only") {
            this.vditor.editor = new Editor(this.vditor);
            this.vditor.undo = new Undo();
        }

        if (mergedOptions.resize.enable) {
            const resize = new Resize(this.vditor);
            this.vditor.resize = resize;
        }

        if (mergedOptions.toolbar) {
            const toolbar: Toolbar = new Toolbar(this.vditor);
            this.vditor.toolbar = toolbar;
        }

        if (this.vditor.toolbar.elements.devtools) {
            this.vditor.devtools = new DevTools();
        }

        loadLuteJs(this.vditor).then(async () => {
            if (this.vditor.editor && (this.vditor.toolbar.elements.preview || this.vditor.toolbar.elements.both)) {
                const preview = new Preview(this.vditor);
                this.vditor.preview = preview;
            }

            if (mergedOptions.upload.url || mergedOptions.upload.handler) {
                const upload = new Upload();
                this.vditor.upload = upload;
            }

            if (this.vditor.options.mode !== "markdown-only") {
                this.vditor.wysiwyg = new WYSIWYG(this.vditor);
                this.vditor.wysiwygUndo = new WysiwygUndo();
            }

            if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
                const hint = new Hint();
                this.vditor.hint = hint;
            }

            const ui = new Ui(this.vditor);

            await ui.afterRender(this.vditor);

            if (mergedOptions.after) {
                mergedOptions.after();
            }
        });
    }

    public setTheme(theme: "dark" | "classic") {
        this.vditor.options.theme = theme;
        setTheme(this.vditor);
    }

    public getValue() {
        return getMarkdown(this.vditor);
    }

    public focus() {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.focus();
        } else {
            this.vditor.wysiwyg.element.focus();
        }
    }

    public blur() {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.blur();
        } else {
            this.vditor.wysiwyg.element.blur();
        }
    }

    public disabled() {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.setAttribute("contenteditable", "false");
        } else {
            this.vditor.wysiwyg.element.setAttribute("contenteditable", "false");
        }
    }

    public enable() {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.setAttribute("contenteditable", "true");
        } else {
            this.vditor.wysiwyg.element.setAttribute("contenteditable", "true");
        }
    }

    public setSelection(start: number, end: number) {
        if (this.vditor.currentMode === "wysiwyg") {
            console.error("所见即所得模式暂不支持该方法");
        } else {
            setSelectionByPosition(start, end, this.vditor.editor.element);
        }
    }

    public getSelection() {
        let selectText = "";
        if (window.getSelection().rangeCount !== 0) {
            if (this.vditor.currentMode === "wysiwyg") {
                selectText = getSelectText(this.vditor.wysiwyg.element);
            } else {
                selectText = getSelectText(this.vditor.editor.element);
            }
        }
        return selectText;
    }

    public renderPreview(value?: string) {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.preview.render(this.vditor, value);
        }
    }

    public getCursorPosition() {
        if (this.vditor.currentMode === "wysiwyg") {
            return getCursorPosition(this.vditor.wysiwyg.element);
        } else {
            return getCursorPosition(this.vditor.editor.element);
        }
    }

    public isUploading() {
        return this.vditor.upload.isUploading;
    }

    public clearCache() {
        localStorage.removeItem("vditor" + this.vditor.id);
    }

    public disabledCache() {
        this.vditor.options.cache = false;
    }

    public enableCache() {
        this.vditor.options.cache = true;
    }

    public html2md(value: string) {
        return html2md(this.vditor, value);
    }

    public getHTML() {
        if (this.vditor.currentMode === "markdown") {
            return md2htmlByVditor(getMarkdown(this.vditor), this.vditor);
        } else {
            return this.vditor.lute.VditorDOM2HTML(this.vditor.wysiwyg.element.innerHTML);
        }
    }

    public tip(text: string, time?: number) {
        this.vditor.tip.show(text, time);
    }

    public setPreviewMode(mode: keyof IPreviewMode) {
        setPreviewMode(mode, this.vditor);
    }

    public deleteValue() {
        if (window.getSelection().isCollapsed) {
            return;
        }
        if (this.vditor.currentMode === "markdown") {
            insertText(this.vditor, "", "", true);
        } else {
            document.execCommand("delete", false);
        }
    }

    public updateValue(value: string) {
        if (this.vditor.currentMode === "markdown") {
            insertText(this.vditor, value, "", true);
        } else {
            document.execCommand("insertHTML", false, value);
        }
    }

    public insertValue(value: string) {
        if (this.vditor.currentMode === "markdown") {
            insertText(this.vditor, value, "");
        } else {
            const range = getSelection().getRangeAt(0);
            range.collapse(false);
            setSelectionFocus(range);
            document.execCommand("insertHTML", false, value);
        }
    }

    public setValue(markdown: string) {
        if (this.vditor.currentMode === "markdown") {
            formatRender(this.vditor, markdown, {
                end: markdown.length,
                start: markdown.length,
            }, {
                enableAddUndoStack: true,
                enableHint: false,
                enableInput: false,
            });
        } else {
            renderDomByMd(this.vditor, markdown, false);
        }
        if (!markdown) {
            localStorage.removeItem("vditor" + this.vditor.id);
        }
    }

    public scrollToWbr() {
        if (this.vditor.currentMode === "wysiwyg") {
            scrollToWbr(this.vditor);
        }
    }
}

export default Vditor;
