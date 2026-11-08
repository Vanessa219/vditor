import {input as irInput} from "../ir/input";
import {processAfterRender} from "../sv/process";
import {input} from "../wysiwyg/input";
import {getEditorRange, setSelectionFocus} from "./selection";

export const pairedSymbols: {[key: string]: string} = {
    "\"": "\"", "'": "'", "`": "`", "(": ")", "[": "]", "{": "}",
    "“": "”", "‘": "’", "（": "）", "【": "】", "「": "」", "『": "』", "《": "》",
};

export const wrapSelection = (vditor: IVditor, opening: string): boolean => {
    if (!opening || opening.length !== 1) {
        return false;
    }
    const closing = pairedSymbols[opening];
    if (!closing) {
        return false;
    }
    const editor = vditor[vditor.currentMode].element;
    if (vditor.currentMode === "sv") {
        const textarea = vditor.sv.element;
        if (textarea.disabled || textarea.selectionStart === textarea.selectionEnd) {
            return false;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText(opening + textarea.value.substring(start, end) + closing, start, end, "end");
        processAfterRender(vditor);
        return true;
    }
    const range = getEditorRange(vditor);
    if (editor.getAttribute("contenteditable") !== "true" || range.collapsed ||
        !editor.contains(range.startContainer) || !editor.contains(range.endContainer)) {
        return false;
    }
    const contents = range.extractContents();
    const fragment = document.createDocumentFragment();
    const end = document.createTextNode(closing);
    fragment.append(document.createTextNode(opening), contents, end);
    range.insertNode(fragment);
    range.setStartAfter(end);
    range.collapse(true);
    setSelectionFocus(range);
    if (vditor.currentMode === "ir") {
        irInput(vditor, range, true);
    } else {
        input(vditor, range);
    }
    return true;
};
