import {VDITOR_VERSION} from "./ts/constants";
import {Counter} from "./ts/counter/index";
import {DevTools} from "./ts/devtools";
import {formatRender} from "./ts/editor/formatRender";
import {getSelectText} from "./ts/editor/getSelectText";
import {html2md} from "./ts/editor/html2md";
import {Editor} from "./ts/editor/index";
import {insertText} from "./ts/editor/insertText";
import {setSelectionByPosition} from "./ts/editor/setSelection";
import {getCursorPosition} from "./ts/hint/getCursorPosition";
import {Hint} from "./ts/hint/index";
import {IR} from "./ts/ir";
import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {graphvizRender} from "./ts/markdown/graphvizRender";
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
import {disableToolbar} from "./ts/toolbar/setToolbar";
import {enableToolbar} from "./ts/toolbar/setToolbar";
import {initUI} from "./ts/ui/initUI";
import {setTheme} from "./ts/ui/setTheme";
import {Undo} from "./ts/undo";
import {IRUndo} from "./ts/undo/IRUndo";
import {WysiwygUndo} from "./ts/undo/WysiwygUndo";
import {Upload} from "./ts/upload/index";
import {getMarkdown} from "./ts/util/getMarkdown";
import {Options} from "./ts/util/Options";
import {setPreviewMode} from "./ts/util/setPreviewMode";
import {WYSIWYG} from "./ts/wysiwyg";
import {input} from "./ts/wysiwyg/input";
import {renderDomByMd} from "./ts/wysiwyg/renderDomByMd";

class Vditor {

    public static codeRender = codeRender;
    public static graphvizRender = graphvizRender;
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

        if (!(mergedOptions.lang === "en_US" || mergedOptions.lang === "ko_KR" || mergedOptions.lang === "zh_CN")) {
            console.error("options.lang error, see https://hacpai.com/article/1549638745630#options");
            return;
        }

        this.vditor = {
            currentMode: mergedOptions.mode,
            currentPreviewMode: mergedOptions.preview.mode,
            id,
            lute: undefined,
            options: mergedOptions,
            originalInnerHTML: document.getElementById(id).innerHTML,
            tip: new Tip(),
        };

        if (mergedOptions.counter > 0) {
            this.vditor.counter = new Counter(this.vditor);
        }

        this.vditor.editor = new Editor(this.vditor);
        this.vditor.undo = new Undo();
        this.vditor.wysiwyg = new WYSIWYG(this.vditor);
        this.vditor.wysiwygUndo = new WysiwygUndo();
        this.vditor.irUndo = new IRUndo();
        this.vditor.ir = new IR(this.vditor);

        if (mergedOptions.resize.enable) {
            this.vditor.resize = new Resize(this.vditor);
        }

        if (mergedOptions.toolbar) {
            this.vditor.toolbar = new Toolbar(this.vditor);
        }

        if (this.vditor.toolbar.elements.devtools) {
            this.vditor.devtools = new DevTools();
        }

        if (mergedOptions.upload.url || mergedOptions.upload.handler) {
            this.vditor.upload = new Upload();
        }

        if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
            this.vditor.hint = new Hint();
        }

        loadLuteJs(this.vditor);

        if (this.vditor.editor && (this.vditor.toolbar.elements.preview || this.vditor.toolbar.elements.both)) {
            this.vditor.preview = new Preview(this.vditor);
        }

        initUI(this.vditor);

        if (mergedOptions.after) {
            // fix after constructor
            setTimeout(() => {
                mergedOptions.after();
            }, 0);
        }
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
        disableToolbar(this.vditor.toolbar.elements, ["emoji", "headings", "bold", "italic", "strike", "link",
            "list", "ordered-list", "check", "quote", "line", "code", "inline-code", "upload", "record", "table",
            "undo", "redo", "wysiwyg"]);
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.setAttribute("contenteditable", "false");
        } else {
            this.vditor.wysiwyg.element.setAttribute("contenteditable", "false");
        }
    }

    public enable() {
        enableToolbar(this.vditor.toolbar.elements, ["emoji", "headings", "bold", "italic", "strike", "link",
            "list", "ordered-list", "check", "quote", "line", "code", "inline-code", "upload", "record", "table", "wysiwyg"]);
        if (this.vditor.currentMode === "markdown") {
            this.vditor.undo.enableIcon(this.vditor);
            this.vditor.editor.element.setAttribute("contenteditable", "true");
        } else {
            this.vditor.wysiwygUndo.enableIcon(this.vditor);
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

    public insertValue(value: string, render = true) {
        if (this.vditor.currentMode === "markdown") {
            insertText(this.vditor, value, "");
        } else {
            let range;
            if (getSelection().rangeCount === 0) {
                this.vditor.wysiwyg.element.focus();
                range = getSelection().getRangeAt(0);
            } else {
                range = getSelection().getRangeAt(0);
                if (!this.vditor.wysiwyg.element.contains(range.startContainer)) {
                    this.vditor.wysiwyg.element.focus();
                } else {
                    range.collapse(true);
                }
            }

            document.execCommand("insertHTML", false, value);

            if (render) {
                input(this.vditor, range);
            }
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
}

export default Vditor;
