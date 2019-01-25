import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/Ui";

class Vditor {
    readonly version: string;

    constructor(id: string, options?: Options) {
        this.version = VDITOR_VERSION;

        const getOptions = new OptionsClass(options)
        const mergedOptions = getOptions.merge()

        const toolbar = new Toolbar(mergedOptions)
        new Ui(id, toolbar.genElement(), '')
    }
}

export default Vditor