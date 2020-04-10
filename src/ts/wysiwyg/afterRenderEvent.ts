import {isSafari} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";

export const afterRenderEvent = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }
    clearTimeout(vditor.wysiwyg.afterRenderTimeoutId);
    vditor.wysiwyg.afterRenderTimeoutId = window.setTimeout(() => {
        if (vditor.wysiwyg.composingLock && isSafari()) {
            // safari 中文输入遇到 addToUndoStack 会影响下一次的中文输入
            return;
        }
        const text = getMarkdown(vditor);
        if (typeof vditor.options.input === "function" && options.enableInput) {
            vditor.options.input(text);
        }

        if (vditor.options.counter !== false) {
            vditor.counter.render(text, vditor.options.counter);
        }

        if (vditor.options.cache.enable) {
            localStorage.setItem(vditor.options.cache.id, text);
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }

        if (options.enableAddUndoStack) {
            vditor.wysiwygUndo.addToUndoStack(vditor);
        }
    }, 800);
};
