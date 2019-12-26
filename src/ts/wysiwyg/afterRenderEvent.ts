import {getText} from "../util/getText";

export const afterRenderEvent = (vditor: IVditor, isAddUndoStack = true) => {
    if (vditor.options.counter > 0) {
        vditor.counter.render(getText(vditor).length, vditor.options.counter);
    }

    if (typeof vditor.options.input === "function") {
        vditor.options.input(getText(vditor));
    }

    if (vditor.options.cache) {
        localStorage.setItem(`vditor${vditor.id}`, getText(vditor));
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }

    if (isAddUndoStack) {
        vditor.wysiwygUndo.addToUndoStack(vditor);
    }
};
