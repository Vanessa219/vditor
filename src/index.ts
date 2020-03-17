import {VDITOR_VERSION} from "./ts/constants";
import {Counter} from "./ts/counter/index";
import {DevTools} from "./ts/devtools";
import {Hint} from "./ts/hint/index";
import {IR} from "./ts/ir";
import {input as irInput} from "./ts/ir/input";
import {processAfterRender} from "./ts/ir/process";
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
import {formatRender} from "./ts/sv/formatRender";
import {getSelectText} from "./ts/sv/getSelectText";
import {html2md} from "./ts/sv/html2md";
import {Editor} from "./ts/sv/index";
import {insertText} from "./ts/sv/insertText";
import {Tip} from "./ts/tip";
import {Toolbar} from "./ts/toolbar/index";
import {disableToolbar} from "./ts/toolbar/setToolbar";
import {enableToolbar} from "./ts/toolbar/setToolbar";
import {initUI} from "./ts/ui/initUI";
import {setPreviewMode} from "./ts/ui/setPreviewMode";
import {setTheme} from "./ts/ui/setTheme";
import {Undo} from "./ts/undo";
import {IRUndo} from "./ts/undo/IRUndo";
import {WysiwygUndo} from "./ts/undo/WysiwygUndo";
import {Upload} from "./ts/upload/index";
import {getMarkdown} from "./ts/util/getMarkdown";
import {Options} from "./ts/util/Options";
import {getCursorPosition} from "./ts/util/selection";
import {getEditorRange, setSelectionByPosition} from "./ts/util/selection";
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

        this.vditor.sv = new Editor(this.vditor);
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

        if (this.vditor.sv && (this.vditor.toolbar.elements.preview || this.vditor.toolbar.elements.both)) {
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
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.element.focus();
        } else if (this.vditor.currentMode === "wysiwyg") {
            this.vditor.wysiwyg.element.focus();
        } else if (this.vditor.currentMode === "ir") {
            this.vditor.ir.element.focus();
        }
    }

    public blur() {
        if (this.vditor.currentMode === "sv") {
            this.vditor.sv.element.blur();
        } else if (this.vditor.currentMode === "wysiwyg") {
            this.vditor.wysiwyg.element.blur();
        } else if (this.vditor.currentMode === "ir") {
            this.vditor.ir.element.blur();
        }
    }

    public disabled() {
        disableToolbar(this.vditor.toolbar.elements, ["emoji", "headings", "bold", "italic", "strike", "link",
            "list", "ordered-list", "check", "quote", "line", "code", "inline-code", "upload", "record", "table",
            "undo", "redo", "wysiwyg"]);
        this.vditor.sv.element.setAttribute("contenteditable", "false");
        this.vditor.wysiwyg.element.setAttribute("contenteditable", "false");
        this.vditor.wysiwyg.element.setAttribute("contenteditable", "false");
    }

    public enable() {
        enableToolbar(this.vditor.toolbar.elements, ["emoji", "headings", "bold", "italic", "strike", "link",
            "list", "ordered-list", "check", "quote", "line", "code", "inline-code", "upload", "record", "table", "wysiwyg"]);
        this.vditor.undo.enableIcon(this.vditor);
        this.vditor.sv.element.setAttribute("contenteditable", "true");
        this.vditor.wysiwygUndo.enableIcon(this.vditor);
        this.vditor.wysiwyg.element.setAttribute("contenteditable", "true");
        this.vditor.irUndo.enableIcon(this.vditor);
        this.vditor.ir.element.setAttribute("contenteditable", "true");
    }

    public setSelection(start: number, end: number) {
        if (this.vditor.currentMode !== "sv") {
            console.error("所见即所得模式暂不支持该方法");
        } else {
            setSelectionByPosition(start, end, this.vditor.sv.element);
        }
    }

    public getSelection() {
        if (this.vditor.currentMode === "wysiwyg") {
            return getSelectText(this.vditor.wysiwyg.element);
        } else if (this.vditor.currentMode === "sv") {
            return getSelectText(this.vditor.sv.element);
        } else if (this.vditor.currentMode === "ir") {
            return getSelectText(this.vditor.ir.element);
        }
    }

    public renderPreview(value?: string) {
        if (this.vditor.currentMode === "sv") {
            this.vditor.preview.render(this.vditor, value);
        }
    }

    public getCursorPosition() {
        if (this.vditor.currentMode === "wysiwyg") {
            return getCursorPosition(this.vditor.wysiwyg.element);
        } else if (this.vditor.currentMode === "sv") {
            return getCursorPosition(this.vditor.sv.element);
        } else if (this.vditor.currentMode === "ir") {
            return getCursorPosition(this.vditor.ir.element);
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
        if (this.vditor.currentMode === "sv") {
            return md2htmlByVditor(getMarkdown(this.vditor), this.vditor);
        } else if (this.vditor.currentMode === "wysiwyg") {
            return this.vditor.lute.VditorDOM2HTML(this.vditor.wysiwyg.element.innerHTML);
        } else if (this.vditor.currentMode === "ir") {
            return this.vditor.lute.VditorIRDOM2HTML(this.vditor.ir.element.innerHTML);
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
        if (this.vditor.currentMode === "sv") {
            insertText(this.vditor, "", "", true);
        } else {
            document.execCommand("delete", false);
        }
    }

    public updateValue(value: string) {
        if (this.vditor.currentMode === "sv") {
            insertText(this.vditor, value, "", true);
        } else {
            document.execCommand("insertHTML", false, value);
        }
    }

    public insertValue(value: string, render = true) {
        if (this.vditor.currentMode === "sv") {
            insertText(this.vditor, value, "");
        } else if (this.vditor.currentMode === "wysiwyg") {
            const range = getEditorRange(this.vditor.wysiwyg.element);
            range.collapse(true);
            document.execCommand("insertHTML", false, value);
            if (render) {
                input(this.vditor, range);
            }
        } else if (this.vditor.currentMode === "ir") {
            const range = getEditorRange(this.vditor.ir.element);
            range.collapse(true);
            document.execCommand("insertHTML", false, value);
            if (render) {
                irInput(this.vditor, range);
            }
        }
    }

    public setValue(markdown: string) {
        if (this.vditor.currentMode === "sv") {
            formatRender(this.vditor, markdown, {
                end: markdown.length,
                start: markdown.length,
            }, {
                enableAddUndoStack: true,
                enableHint: false,
                enableInput: false,
            });
        } else if (this.vditor.currentMode === "wysiwyg") {
            renderDomByMd(this.vditor, markdown, false);
        } else {
            this.vditor.ir.element.innerHTML = this.vditor.lute.Md2VditorIRDOM(markdown);
            processAfterRender(this.vditor, {
                enableAddUndoStack: true,
                enableHint: false,
                enableInput: false,
            });
        }

        if (!markdown) {
            localStorage.removeItem("vditor" + this.vditor.id);
        }
    }
}

export default Vditor;
