import {getMarkdown} from "../util/getMarkdown";
export const inputEvent = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    if (vditor.options.counter !== false) {
        vditor.counter.render(getMarkdown(vditor), vditor.options.counter);
    }
    if (typeof vditor.options.input === "function" && options.enableInput) {
        vditor.options.input(getMarkdown(vditor),
            vditor.preview && vditor.preview.element);
    }
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }
    if (vditor.options.cache.enable) {
        localStorage.setItem(vditor.options.cache.id, getMarkdown(vditor));
    }
    if (vditor.preview) {
        vditor.preview.render(vditor);
    }
    if (options.enableAddUndoStack) {
        vditor.undo.addToUndoStack(vditor);
    }

    if (vditor.devtools) {
        vditor.devtools.renderEchart(vditor);
    }
};
