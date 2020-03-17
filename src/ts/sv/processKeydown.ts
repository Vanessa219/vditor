import {isCtrl} from "../util/compatibility";
import {getMarkdown} from "../util/getMarkdown";
import {matchHotKey} from "../util/hotKey";
import {getSelectPosition} from "../util/selection";
import {formatRender} from "./formatRender";
import {getCurrentLinePosition} from "./getCurrentLinePosition";
import {insertText} from "./insertText";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
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

    // delete
    if (!isCtrl(event) && !event.shiftKey && event.keyCode === 8) {
        if (position.start !== position.end) {
            insertText(vditor, "", "", true);
        } else {
            // delete emoji
            const emojiMatch = text.substring(0, position.start).match(/([\u{1F300}-\u{1F5FF}][\u{2000}-\u{206F}][\u{2700}-\u{27BF}]|([\u{1F900}-\u{1F9FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F600}-\u{1F64F}])[\u{2000}-\u{206F}][\u{2600}-\u{26FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{FE00}-\u{FE0F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{0000}-\u{007F}][\u{20D0}-\u{20FF}]|[\u{0000}-\u{007F}][\u{FE00}-\u{FE0F}][\u{20D0}-\u{20FF}])$/u);
            const deleteChar = emojiMatch ? emojiMatch[0].length : 1;
            formatRender(vditor,
                text.substring(0, position.start - deleteChar) + text.substring(position.start),
                {
                    end: position.start - deleteChar,
                    start: position.start - deleteChar,
                }, {
                    enableAddUndoStack: true,
                    enableHint: true,
                    enableInput: true,
                });
        }
        event.preventDefault();
        event.stopPropagation();
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
