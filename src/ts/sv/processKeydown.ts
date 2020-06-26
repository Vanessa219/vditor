import {getMarkdown} from "../markdown/getMarkdown";
import {matchHotKey} from "../util/hotKey";
import {getEditorRange, getSelectPosition, setRangeByWbr, setSelectionFocus} from "../util/selection";
import {formatRender} from "./formatRender";
import {getCurrentLinePosition} from "./getCurrentLinePosition";
import {insertText} from "./insertText";
import {isCtrl} from "../util/compatibility";
import {hasClosestByAttribute, hasClosestByClassName} from "../util/hasClosest";
import {scrollCenter} from "../util/editorCommonEvent";
import {execAfterRender} from "../util/fixBrowserBehavior";
import {processAfterRender} from "./process";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.sv.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    if (event.key.indexOf("Arrow") === -1) {
        vditor.undo.recordFirstPosition(vditor);
    }

    // 仅处理以下快捷键操作
    if (event.key !== "Enter" && event.key !== "Tab" && event.key !== "Backspace" && event.key.indexOf("Arrow") === -1
        && !isCtrl(event) && event.key !== "Escape") {
        return false;
    }
    const range = getEditorRange(vditor.sv.element);
    const startContainer = range.startContainer;
    // 代码块
    const preElement = hasClosestByClassName(startContainer, "vditor-sv__marker--pre");
    if (preElement) {
        // 换行
        if (!isCtrl(event) && !event.altKey && event.key === "Enter") {
            if (!preElement.firstElementChild.textContent.endsWith("\n")) {
                preElement.firstElementChild.insertAdjacentText("beforeend", "\n");
            }
            range.insertNode(document.createTextNode("\n"));
            range.collapse(false);
            setSelectionFocus(range);
            execAfterRender(vditor);
            scrollCenter(vditor);
            event.preventDefault();
            return true;
        }
        // Backspace: 光标位于第零个字符，仅删除代码块标签
        if (event.key === "Backspace" && !isCtrl(event) && !event.shiftKey && !event.altKey) {
            const codePosition = getSelectPosition(preElement, range);
            if ((codePosition.start === 0 ||
                (codePosition.start === 1 && preElement.innerText === "\n")) // 空代码块，光标在 \n 后
                && range.toString() === "") {
                preElement.parentElement.outerHTML =
                    `<p data-block="0"><wbr>${preElement.firstElementChild.innerHTML}</p>`;
                setRangeByWbr(vditor[vditor.currentMode].element, range);
                processAfterRender(vditor);
                event.preventDefault();
                return true;
            }
        }
    }

    // 代码块语言或飘号后
    const codeInfoElement = hasClosestByAttribute(startContainer, "data-type", "code-block-info") ||
        hasClosestByAttribute(startContainer, "data-type", "code-block-open-marker");
    if (codeInfoElement) {
        if (event.key === "Enter" || event.key === "Tab") {
            range.selectNodeContents(codeInfoElement.parentElement.querySelector('code'));
            range.collapse(true);
            event.preventDefault();
            return true;
        }
    }

    // TODO: all next
    const editorElement = vditor.sv.element;
    const position = getSelectPosition(editorElement);
    const text = getMarkdown(vditor);
    // tab and shift + tab
    if (vditor.options.tab && event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();

        const selectLinePosition = getCurrentLinePosition(position, text);
        const selectLineList = text.substring(selectLinePosition.start, selectLinePosition.end - 1).split("\n");

        if (event.shiftKey) {
            let shiftCount = 0;
            let startIsShift = false;
            const selectionShiftResult = selectLineList.map((value, index) => {
                let shiftLineValue = value;
                if (value.indexOf(vditor.options.tab) === 0) {
                    if (index === 0) {
                        startIsShift = true;
                    }
                    shiftCount++;
                    shiftLineValue = value.replace(vditor.options.tab, "");
                }
                return shiftLineValue;
            }).join("\n");

            formatRender(vditor, text.substring(0, selectLinePosition.start) +
                selectionShiftResult + text.substring(selectLinePosition.end - 1),
                {
                    end: position.end - shiftCount * vditor.options.tab.length,
                    start: position.start - (startIsShift ? vditor.options.tab.length : 0),
                });
            return true;
        }

        if (position.start === position.end) {
            insertText(vditor, vditor.options.tab, "");
            return true;
        }
        const selectionResult = selectLineList.map((value) => {
            return vditor.options.tab + value;
        }).join("\n");
        formatRender(vditor, text.substring(0, selectLinePosition.start) + selectionResult +
            text.substring(selectLinePosition.end - 1),
            {
                end: position.end + selectLineList.length * vditor.options.tab.length,
                start: position.start + vditor.options.tab.length,
            });
        return true;
    }

    // hotkey command + delete
    if (vditor.options.keymap.deleteLine && matchHotKey(vditor.options.keymap.deleteLine, event)) {
        const linePosition = getCurrentLinePosition(position, text);
        const deletedText = text.substring(0, linePosition.start) + text.substring(linePosition.end);
        const startIndex = Math.min(deletedText.length, position.start);
        formatRender(vditor, deletedText, {
            end: startIndex,
            start: startIndex,
        });
        event.preventDefault();
        return true;
    }

    // hotkey command + d
    if (vditor.options.keymap.duplicate && matchHotKey(vditor.options.keymap.duplicate, event)) {
        let lineText = text.substring(position.start, position.end);
        if (position.start === position.end) {
            const linePosition = getCurrentLinePosition(position, text);
            lineText = text.substring(linePosition.start, linePosition.end);
            formatRender(vditor,
                text.substring(0, linePosition.end) + lineText + text.substring(linePosition.end),
                {
                    end: position.end + lineText.length,
                    start: position.start + lineText.length,
                });
        } else {
            formatRender(vditor,
                text.substring(0, position.end) + lineText + text.substring(position.end),
                {
                    end: position.end + lineText.length,
                    start: position.start + lineText.length,
                });
        }
        event.preventDefault();
        return true;
    }

    return false;
};
