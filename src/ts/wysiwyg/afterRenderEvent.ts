import {Constants} from "../constants";
import {getMarkdown} from "../util/getMarkdown";

export const afterRenderEvent = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    clearTimeout(vditor.wysiwyg.afterRenderTimeoutId);
    const text = getMarkdown(vditor);
    if (typeof vditor.options.input === "function" && options.enableInput) {
        vditor.options.input(text);
    }
    vditor.wysiwyg.afterRenderTimeoutId = window.setTimeout(() => {
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
            vditor.wysiwygUndo.addToUndoStack(vditor);
        }

        if (options.enableHint && vditor.hint) {
            vditor.hint.render(vditor);
        }

        // 末尾保持一个空 P 元素
        const lastElement = vditor.wysiwyg.element.lastElementChild;
        if (lastElement.classList.contains("vditor-panel--none") &&
            lastElement.previousElementSibling.tagName !== "P") {
            lastElement.insertAdjacentHTML("beforebegin", Constants.WYSIWYG_EMPTY_P);
        }
        if (!lastElement.classList.contains("vditor-panel--none") && lastElement.tagName !== "P") {
            vditor.wysiwyg.element.insertAdjacentHTML("beforeend", Constants.WYSIWYG_EMPTY_P);
        }
    }, 800);
};
