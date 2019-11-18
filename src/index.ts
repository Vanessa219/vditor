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
import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {highlightRender} from "./ts/markdown/highlightRender";
import {mathRender} from "./ts/markdown/mathRender";
import {mathRenderByLute} from "./ts/markdown/mathRenderByLute";
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
import {Upload} from "./ts/upload/index";
import {getText} from "./ts/util/getText";
import {Options} from "./ts/util/Options";
import {setPreviewMode} from "./ts/util/setPreviewMode";
import {WYSIWYG} from "./ts/wysiwyg";
import {setExpand} from "./ts/wysiwyg/setExpand";

class Vditor {

    public static codeRender = codeRender;
    public static highlightRender = highlightRender;
    public static mathRenderByLute = mathRenderByLute;
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

        if (!(mergedOptions.lang === 'en_US' || mergedOptions.lang === 'zh_CN')) {
            console.error('options.lang error, see https://hacpai.com/article/1549638745630#toc_h4_10')
            return
        }

        const popover = document.createElement('div')
        popover.className = 'vditor-popover'

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
            popover: popover
        };

        if (mergedOptions.counter > 0) {
            const counter = new Counter(this.vditor);
            this.vditor.counter = counter;
        }

        if (mergedOptions.mode !== "wysiwyg-only") {
            this.vditor.editor = new Editor(this.vditor);
        }

        this.vditor.undo = new Undo();

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

        loadLuteJs(this.vditor).then(() => {
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
            }

            if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
                const hint = new Hint();
                this.vditor.hint = hint;
            }

            const ui = new Ui(this.vditor);

            if (mergedOptions.after) {
                mergedOptions.after();
            }
        });
    }

    public getValue() {
        return getText(this.vditor);
    }

    public focus() {
        if (this.vditor.currentMode === "markdown") {
            this.vditor.editor.element.focus();
        } else {
            this.vditor.wysiwyg.element.focus();
            setExpand(this.vditor.wysiwyg.element);
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
        this.vditor.editor.element.setAttribute("contenteditable", "false");
    }

    public enable() {
        this.vditor.editor.element.setAttribute("contenteditable", "true");
    }

    public setSelection(start: number, end: number) {
        setSelectionByPosition(start, end, this.vditor.editor.element);
    }

    public getSelection() {
        let selectText = "";
        if (window.getSelection().rangeCount !== 0) {
            selectText = getSelectText(this.vditor.editor.element);
        }
        return selectText;
    }

    public renderPreview(value?: string) {
        this.vditor.preview.render(this.vditor, value);
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
        return md2htmlByVditor(getText(this.vditor), this.vditor);
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
        insertText(this.vditor, "", "", true);
    }

    public updateValue(value: string) {
        insertText(this.vditor, value, "", true);
    }

    public insertValue(value: string) {
        insertText(this.vditor, value, "");
    }

    public setValue(value: string) {
        formatRender(this.vditor, value, {
            end: value.length,
            start: value.length,
        });
        if (!value) {
            localStorage.removeItem("vditor" + this.vditor.id);
        }
    }
}

export default Vditor;
