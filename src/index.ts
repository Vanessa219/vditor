import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/index";
import {Editor, insertText} from "./ts/editor/index";
import {Hotkey} from "./ts/hotkey/index";
import {Markdown} from "./ts/markdown/index";
import {Counter} from "./ts/counter/index";
import {Drag} from "./ts/drag/index";
import {Hint} from "./ts/hint/index";
import {getTextareaPosition} from "./ts/util/textareaPosition";
import {UploadClass} from "./ts/upload/index";

class VditorClass {
    readonly version: string;
    vditor: any

    constructor(id: string, options?: Options) {
        this.version = VDITOR_VERSION;

        const getOptions = new OptionsClass(options)
        const mergedOptions = getOptions.merge()

        this.vditor = {
            id,
            options: mergedOptions,
        }

        if (mergedOptions.counter > 0) {
            const counter = new Counter(this.vditor)
            this.vditor.counter = counter
        }

        const editor = new Editor(this.vditor)
        this.vditor.editor = editor

        if (mergedOptions.draggable) {
            const drag = new Drag(this.vditor)
            this.vditor.drag = drag
        }

        const toolbar = new Toolbar(this.vditor)
        this.vditor.toolbar = toolbar

        if (toolbar.elements.preview) {
            const markdown = new Markdown(this.vditor)
            this.vditor.markdown = markdown
        }

        if (mergedOptions.upload.url) {
            const upload = new UploadClass()
            this.vditor.upload = upload
        }

        new Ui(this.vditor)

        if (this.vditor.options.atUser || this.vditor.toolbar.elements.emoji) {
            const hint = new Hint(this.vditor)
            this.vditor.hint = hint
        }

        new Hotkey(this.vditor)
    }


    getValue() {
        return this.vditor.editor.element.value
    }

    insertVale(value: string) {
        insertText(this.vditor.editor.element, value, '')
    }

    focus() {
        this.vditor.editor.element.focus()
    }

    blur() {
        this.vditor.editor.element.blur()
    }

    disabled() {
        this.vditor.editor.element.setAttribute('disabled', 'disabled')
    }

    enable() {
        this.vditor.editor.element.removeAttribute('disabled')
    }

    setSelection(start: number, end: number) {
        this.vditor.editor.element.selectionStart = start
        this.vditor.editor.element.selectionEnd = end
        this.vditor.editor.element.focus()
    }

    getSelection() {
        this.vditor.editor.element.value.substring(this.vditor.editor.element.selectionStart, this.vditor.editor.element.selectionEnd)
    }

    setValue(value: string) {
        this.vditor.editor.element.value = value
    }

    renderPreview() {
        this.vditor.markdown.render()
    }

    getCursorPosition() {
        return getTextareaPosition(this.vditor.editor.element)
    }

    deleteValue() {
        insertText(this.vditor.editor.element, '', '', true)
    }

    updateValue(value: string) {
        insertText(this.vditor.editor.element, value, '', true)
    }

    isUploading() {
        return this.vditor.upload.isUploading
    }
}

export default VditorClass