import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/index";
import {Editor} from "./ts/editor/index";
import {Hotkey} from "./ts/hotkey/index";
import {Markdown} from "./ts/markdown/index";
import {Counter} from "./ts/counter/index";
import {Drag} from "./ts/drag/index";

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
            timeId: -1
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

        new Hotkey(this.vditor)

        new Ui(this.vditor)
    }
}

export default VditorClass