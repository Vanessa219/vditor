import {isCtrl} from "../util/compatibility";
import {processAfterRender} from "./process";

export const processKeydown = (vditor: IVditor, event: KeyboardEvent) => {
    vditor.sv.composingLock = event.isComposing;
    if (event.isComposing) {
        return false;
    }

    if (event.key.indexOf("Arrow") === -1 && event.key !== "Meta" && event.key !== "Control" && event.key !== "Alt" &&
        event.key !== "Shift" && event.key !== "CapsLock" && event.key !== "Escape" && !/^F\d{1,2}$/.test(event.key)) {
        vditor.undo.recordFirstPosition(vditor, event);
    }

    if (event.key !== "Tab" || isCtrl(event) || event.altKey) {
        return false;
    }

    const element = vditor.sv.element;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    if (event.shiftKey) {
        const lineStart = element.value.lastIndexOf("\n", start - 1) + 1;
        const indentation = element.value.substring(lineStart, start).match(/^(\t| {1,4})/);
        if (indentation) {
            element.setRangeText("", lineStart, lineStart + indentation[0].length, "end");
            element.setSelectionRange(start - indentation[0].length, end - indentation[0].length);
        }
    } else {
        element.setRangeText(vditor.options.tab, start, end, "end");
    }
    processAfterRender(vditor);
    event.preventDefault();
    return true;
};
