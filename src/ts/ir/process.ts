import {isSafari} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    let processAfterRenderTimeoutId: number;
    const after = () => {
        clearTimeout(processAfterRenderTimeoutId);
        processAfterRenderTimeoutId = window.setTimeout(() => {
            if (vditor.wysiwyg.composingLock && isSafari()) {
                // safari 中文输入遇到 addToUndoStack 会影响下一次的中文输入
                return;
            }
            const text = getMarkdown(vditor);
            if (typeof vditor.options.input === "function" && options.enableInput) {
                vditor.options.input(text);
            }

            if (vditor.options.counter > 0) {
                vditor.counter.render(text.length, vditor.options.counter);
            }

            if (vditor.options.cache) {
                localStorage.setItem(`vditor${vditor.id}`, text);
            }

            if (vditor.devtools) {
                vditor.devtools.renderEchart(vditor);
            }

            if (options.enableAddUndoStack) {
                vditor.irUndo.addToUndoStack(vditor);
            }

            if (options.enableHint && vditor.hint) {
                vditor.hint.render(vditor);
            }
        }, 800);
    }
    after();
};
