import {VDITOR_VERSION} from "./ts/constants";
import {Counter} from "./ts/counter/index";
import {getSelectText} from "./ts/editor/getSelectText";
import {html2md} from "./ts/editor/html2md";
import {Editor} from "./ts/editor/index";
import {insertText, quickInsertText} from "./ts/editor/insertText";
import {setSelectionByNode, setSelectionByPosition} from "./ts/editor/setSelection";
import {getCursorPosition} from "./ts/hint/getCursorPosition";
import {Hint} from "./ts/hint/index";
import {Hotkey} from "./ts/hotkey/index";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {mathRender} from "./ts/markdown/mathRender";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {markdownItRender} from "./ts/markdown/render";
import {md2html} from "./ts/markdown/render";
import {Preview} from "./ts/preview/index";
import {Resize} from "./ts/resize/index";
import {Toolbar} from "./ts/toolbar/index";
import {Ui} from "./ts/ui/index";
import {Upload} from "./ts/upload/index";
import {Options} from "./ts/util/Options";

class Vditor {

    public static mathRender = mathRender;
    public static mermaidRender = mermaidRender;
    public static codeRender = codeRender;
    public static chartRender = chartRender;
    public static md2html = markdownItRender;
    public readonly version: string;
    public vditor: IVditor;

    constructor(id: string, options?: IOptions) {
        this.version = VDITOR_VERSION;

        const getOptions = new Options(options);
        const mergedOptions = getOptions.merge();

        this.vditor = {
            id,
            mdTimeoutId: -1,
            options: mergedOptions,
            originalInnerHTML: document.getElementById(id).innerHTML,
        };

        if (mergedOptions.counter > 0) {
            const counter = new Counter(this.vditor);
            this.vditor.counter = counter;
        }

        const editor = new Editor(this.vditor);
        this.vditor.editor = editor;

        if (mergedOptions.resize.enable) {
            const resize = new Resize(this.vditor);
            this.vditor.resize = resize;
        }

        if (mergedOptions.toolbar) {
            const toolbar: Toolbar = new Toolbar(this.vditor);
            this.vditor.toolbar = toolbar;
        }

        if (this.vditor.toolbar.elements.preview) {
            const preview = new Preview(this.vditor);
            this.vditor.preview = preview;
        }

        if (mergedOptions.upload.url || mergedOptions.upload.handler) {
            const upload = new Upload();
            this.vditor.upload = upload;
        }

        const ui = new Ui(this.vditor);

        if (this.vditor.options.hint.at || this.vditor.toolbar.elements.emoji) {
            const hint = new Hint(this.vditor);
            this.vditor.hint = hint;
        }

        const hotkey = new Hotkey(this.vditor);
    }

    public getValue() {
        return this.vditor.editor.element.innerText;
    }

    public insertValue(value: string) {
        insertText(this.vditor, value, "");
    }

    public focus() {
        this.vditor.editor.element.focus();
    }

    public blur() {
        this.vditor.editor.element.blur();
    }

    public disabled() {
        this.vditor.editor.element.setAttribute("disabled", "disabled");
    }

    public enable() {
        this.vditor.editor.element.removeAttribute("disabled");
    }

    public setSelection(start: number, end: number) {
       const range = setSelectionByPosition(start, end, this.vditor.editor.element);
       if (this.vditor.options.select) {
            this.vditor.options.select(getSelectText(range, this.vditor.editor.element));
        }
    }

    public getSelection() {
        let selectText = "";
        if (window.getSelection().rangeCount !== 0) {
            selectText = getSelectText(window.getSelection().getRangeAt(0), this.vditor.editor.element);
        }
        return selectText;
    }

    public setValue(value: string) {
        setSelectionByNode(this.vditor.editor.element);
        quickInsertText(value);
        if (!value) {
            localStorage.removeItem("vditor" + this.vditor.id);
        }
    }

    public renderPreview(value?: string) {
        this.vditor.preview.render(this.vditor, value);
    }

    public getCursorPosition() {
        return getCursorPosition(this.vditor.editor.element);
    }

    public deleteValue() {
        insertText(this.vditor, "", "", true);
    }

    public updateValue(value: string) {
        insertText(this.vditor, value, "", true);
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

    public getHTML(includeHljs?: boolean) {
        return md2html(this.vditor, includeHljs);
    }
}

export default Vditor;
