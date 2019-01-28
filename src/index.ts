import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/Ui";
import {Editor} from "./ts/editor/index";
import {Hotkey} from "./ts/hotkey/index";
import {Markdown} from "./ts/markdown/index";

class Vditor {
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

        const editor = new Editor(this.vditor)
        this.vditor.editor = editor

        const toolbar = new Toolbar(this.vditor)
        this.vditor.toolbar = toolbar

        const markdown = new Markdown(this.vditor)
        this.vditor.markdown = markdown

        new Hotkey(this.vditor)

        new Ui(this.vditor)
    }
}

export default Vditor