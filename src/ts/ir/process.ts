import {Constants} from "../constants";
import {isSafari} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {hasClosestByAttribute} from "../util/hasClosest";
import {getEditorRange} from "../util/selection";

export const processAfterRender = (vditor: IVditor, options = {
    enableAddUndoStack: true,
    enableHint: false,
    enableInput: true,
}) => {
    const startContainer = getEditorRange(vditor.ir.element).startContainer;
    // 代码块语言提示
    const preBeforeElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info");
    if (options.enableHint && preBeforeElement) {
        const matchLangData: IHintData[] = [];
        const key = preBeforeElement.textContent.replace(Constants.ZWSP, "").trim();
        Constants.CODE_LANGUAGES.forEach((keyName) => {
            if (keyName.indexOf(key.toLowerCase()) === 0) {
                matchLangData.push({
                    html: keyName,
                    value: keyName,
                });
            }
        });
        vditor.hint.genHTML(matchLangData, key, vditor);
    } else if (options.enableHint && vditor.hint) {
        vditor.hint.render(vditor);
    }

    clearTimeout(vditor.ir.processTimeoutId);
    vditor.ir.processTimeoutId = window.setTimeout(() => {
        if (vditor.ir.composingLock && isSafari()) {
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
    }, 800);
};
