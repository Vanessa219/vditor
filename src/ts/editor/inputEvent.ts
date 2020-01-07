import {getMarkdown} from "../util/getMarkdown";
export const inputEvent = (vditor: IVditor, addUndo: boolean = true) => {
    if (vditor.options.counter > 0) {
        vditor.counter.render(getMarkdown(vditor).length, vditor.options.counter);
    }
    if (typeof vditor.options.input === "function") {
        vditor.options.input(getMarkdown(vditor),
            vditor.preview && vditor.preview.element);
    }
    if (vditor.hint) {
        vditor.hint.render(vditor);
    }
    if (vditor.options.cache) {
        localStorage.setItem(`vditor${vditor.id}`, getMarkdown(vditor));
    }
    if (vditor.preview) {
        vditor.preview.render(vditor);
    }
    if (addUndo) {
        vditor.undo.addToUndoStack(vditor);
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
};
