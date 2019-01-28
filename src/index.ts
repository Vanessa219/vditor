import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/Ui";
import {Editor} from "./ts/editor/index";
import {Hotkey} from "./ts/hotkey/index";

class Vditor {
    readonly version: string;

    constructor(id: string, options?: Options) {
        this.version = VDITOR_VERSION;

        const getOptions = new OptionsClass(options)
        const mergedOptions = getOptions.merge()

        const editor = new Editor()
        const editorElement: HTMLTextAreaElement = editor.genElement()

        const toolbar = new Toolbar(mergedOptions, editorElement)
        const toolbarElements = toolbar.genElement()

        new Hotkey(toolbarElements, editorElement, mergedOptions)

        new Ui(id, toolbarElements, editorElement)
    }
}

export default Vditor