import {getMarkdown} from "../markdown/getMarkdown";

export const inputEvent = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    const text = getMarkdown(vditor);
    if (vditor.options.counter.enable) {
        vditor.counter.render(vditor, text);
    }
    if (typeof vditor.options.input === "function" && options.enableInput) {
        vditor.options.input(text, vditor.preview.element);
    }
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }
    if (vditor.options.cache.enable) {
        localStorage.setItem(vditor.options.cache.id, text);
        if (vditor.options.cache.after) {
            vditor.options.cache.after(text);
        }
    }
    vditor.preview.render(vditor);
    if (options.enableAddUndoStack) {
        vditor.undo.addToUndoStack(vditor);
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
};
