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
    if (editor.getAttribute("contenteditable") !== "true" || range.toString() === "" ||
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

export const deleteEmptyPair = (vditor: IVditor): boolean => {
    if (vditor.currentMode === "sv") {
        const textarea = vditor.sv.element;
        const offset = textarea.selectionStart;
        if (textarea.disabled || offset !== textarea.selectionEnd || !isPair(textarea.value[offset - 1], textarea.value[offset])) {
            return false;
        }
        const depth = pairDepth(textarea.value.substring(0, offset), textarea.value.substring(offset));
        textarea.setRangeText("", offset - depth, offset + depth, "end");
        processAfterRender(vditor);
        return true;
    }
    const editor = vditor[vditor.currentMode].element;
    const range = getEditorRange(vditor).cloneRange();
    if (editor.getAttribute("contenteditable") !== "true" || range.toString() !== "" || !editor.contains(range.startContainer)) {
        return false;
    }
    range.collapse(true);
    const node = range.startContainer;
    const offset = range.startOffset;
    const isText = node.nodeType === Node.TEXT_NODE;
    const left = isText ? (offset ? node : node.previousSibling) : node.childNodes[offset - 1];
    const right = isText ? (offset < node.textContent.length ? node : node.nextSibling) : node.childNodes[offset];
    if (left?.nodeType !== Node.TEXT_NODE || right?.nodeType !== Node.TEXT_NODE || left.parentNode !== right.parentNode) {
        return false;
    }
    const start = left === node ? offset - 1 : left.textContent.length - 1;
    const end = right === node ? offset : 0;
    if (!isPair(left.textContent[start], right.textContent[end])) {
        return false;
    }
    const depth = pairDepth(left.textContent.substring(0, start + 1), right.textContent.substring(end));
    range.setStart(left, start - depth + 1);
    range.setEnd(right, end + depth);
    range.deleteContents();
    setSelectionFocus(range);
    if (vditor.currentMode === "ir") {
        irInput(vditor, range, true);
    } else {
        input(vditor, range);
    }
    return true;
};

const isPair = (opening: string, closing: string) => !!opening && !!closing &&
    (pairedSymbols[opening] === closing || (["*", "~", "$"].includes(opening) && opening === closing));

const pairDepth = (left: string, right: string) => {
    const marker = left[left.length - 1];
    if (!["*", "~", "$", "`"].includes(marker)) {
        return 1;
    }
    let before = 0;
    let after = 0;
    while (left[left.length - before - 1] === marker) { before++; }
    while (right[after] === marker) { after++; }
    return Math.min(before, after);
};
