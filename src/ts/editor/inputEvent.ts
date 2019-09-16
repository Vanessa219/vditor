import {getText} from "./getText";
export const inputEvent = (vditor: IVditor, addUndo: boolean = true) => {
    if (vditor.options.counter > 0) {
        vditor.counter.render(getText(vditor.editor.element).length, vditor.options.counter);
    }
    if (typeof vditor.options.input === "function") {
        vditor.options.input(getText(vditor.editor.element), vditor.preview && vditor.preview.element);
    }
    if (vditor.hint) {
        vditor.hint.render(vditor);
    }
    if (vditor.options.cache) {
        localStorage.setItem(`vditor${vditor.id}`, getText(vditor.editor.element));
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
