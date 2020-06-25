import {getMarkdown} from "../markdown/getMarkdown";
import {accessLocalStorage} from "../util/compatibility";

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    if (options.enableHint) {
        vditor.hint.render(vditor);
    }

    clearTimeout(vditor.sv.processTimeoutId);
    vditor.sv.processTimeoutId = window.setTimeout(() => {
        // if (vditor.ir.composingLock && isSafari()) {
        //     // safari 中文输入遇到 addToUndoStack 会影响下一次的中文输入
        //     return;
        // }

        const text = getMarkdown(vditor);
        if (typeof vditor.options.input === "function" && options.enableInput) {
            vditor.options.input(text);
        }

        if (vditor.options.counter.enable) {
            vditor.counter.render(vditor, text);
        }

        if (vditor.options.cache.enable && accessLocalStorage()) {
            localStorage.setItem(vditor.options.cache.id, text);
            if (vditor.options.cache.after) {
                vditor.options.cache.after(text);
            }
        }

        if (vditor.devtools) {
            vditor.devtools.renderEchart(vditor);
        }
        vditor.preview.render(vditor);
        if (options.enableAddUndoStack) {
            vditor.undo.addToUndoStack(vditor);
        }
    }, 800);
};
