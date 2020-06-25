import {getMarkdown} from "../markdown/getMarkdown";
import {matchHotKey} from "../util/hotKey";
import {getSelectPosition} from "../util/selection";
import {formatRender} from "./formatRender";
import {getCurrentLinePosition} from "./getCurrentLinePosition";
import {insertText} from "./insertText";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.sv.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    vditor.undo.recordFirstPosition(vditor);

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
