import {Constants} from "../constants";
import {isChrome} from "./compatibility";

export const getEditorRange = (element: HTMLElement) => {
    let range: Range;
    if (getSelection().rangeCount > 0) {
        range = getSelection().getRangeAt(0);
        if (element.isEqualNode(range.startContainer) || element.contains(range.startContainer)) {
            return range;
        }
    }
    range = element.ownerDocument.createRange();
    range.setStart(element, 0);
    range.collapse(true);
    return range;
};

export const getCursorPosition = (editor: HTMLElement) => {
    const parentRect = editor.parentElement.getBoundingClientRect();
    const range = window.getSelection().getRangeAt(0);
    let cursorRect;
    if (range.getClientRects().length === 0) {
        if (range.startContainer.nodeType === 3) {
            return {
                left: 0,
                top: 0,
            };
        }
        const children = (range.startContainer as Element).children;
        if (children[range.startOffset] &&
            children[range.startOffset].getClientRects().length > 0) {
            // markdown 模式回车
            cursorRect = children[range.startOffset].getClientRects()[0];
        } else {
            cursorRect = (range.startContainer as HTMLElement).getClientRects()[0]; // <td></td>
        }
        if (!cursorRect) {
            let parentElement = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            while (!parentElement.getClientRects ||
            (parentElement.getClientRects && parentElement.getClientRects().length === 0)) {
                parentElement = parentElement.parentElement;
            }
            cursorRect = parentElement.getClientRects()[0];
        }
    } else {
        cursorRect = range.getClientRects()[0];
    }

    return {
        left: cursorRect.left - parentRect.left,
        top: cursorRect.top - parentRect.top,
    };
};

export const selectIsEditor = (editor: HTMLElement, range?: Range) => {
    if (!range) {
        if (getSelection().rangeCount === 0) {
            return false;
        } else {
            range = getSelection().getRangeAt(0);
        }
    }
    const container = range.commonAncestorContainer;

    return editor.isEqualNode(container) || editor.contains(container);
};

export const setSelectionFocus = (range: Range) => {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

export const getSelectPosition = (editorElement: HTMLElement, range?: Range) => {
    const position = {
        end: 0,
        start: 0,
    };

    if (!range) {
        if (getSelection().rangeCount === 0) {
            return position;
        }
        range = window.getSelection().getRangeAt(0);
    }

    if (selectIsEditor(editorElement, range)) {
        const preSelectionRange = range.cloneRange();
        if (editorElement.childNodes[0] && editorElement.childNodes[0].childNodes[0]) {
            preSelectionRange.setStart(editorElement.childNodes[0].childNodes[0], 0);
        } else {
            preSelectionRange.selectNodeContents(editorElement);
        }
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        position.start = preSelectionRange.toString().length;
        position.end = position.start + range.toString().length;
    }
    return position;
};

export const setSelectionByPosition = (start: number, end: number, editor: HTMLElement) => {
    let charIndex = 0;
    let line = 0;
    let pNode = editor.childNodes[line];
    let foundStart = false;
    let stop = false;
    start = Math.max(0, start);
    end = Math.max(0, end);

    const range = editor.ownerDocument.createRange();
    range.setStart(pNode || editor, 0);
    range.collapse(true);

    while (!stop && pNode) {
        const nextCharIndex = charIndex + pNode.textContent.length;
        if (!foundStart && start >= charIndex && start <= nextCharIndex) {
            if (start === 0) {
                range.setStart(pNode, 0);
            } else {
                if (pNode.childNodes[0].nodeType === 3) {
                    range.setStart(pNode.childNodes[0], start - charIndex);
                } else if (pNode.nextSibling) {
                    range.setStartBefore(pNode.nextSibling);
                } else {
                    range.setStartAfter(pNode);
                }
            }
            foundStart = true;
            if (start === end) {
                stop = true;
                break;
            }
        }
        if (foundStart && end >= charIndex && end <= nextCharIndex) {
            if (end === 0) {
                range.setEnd(pNode, 0);
            } else {
                if (pNode.childNodes[0].nodeType === 3) {
                    range.setEnd(pNode.childNodes[0], end - charIndex);
                } else if (pNode.nextSibling) {
                    range.setEndBefore(pNode.nextSibling);
                } else {
                    range.setEndAfter(pNode);
                }
            }
            stop = true;
        }
        charIndex = nextCharIndex;
        pNode = editor.childNodes[++line];
    }

    if (!stop && editor.childNodes[line - 1]) {
        range.setStartBefore(editor.childNodes[line - 1]);
    }

    setSelectionFocus(range);
    return range;
};

export const setRangeByWbr = (element: HTMLElement, range: Range) => {
    const wbrElement = element.querySelector("wbr");
    if (!wbrElement) {
        return;
    }
    if (!wbrElement.previousElementSibling) {
        if (wbrElement.previousSibling) {
            // text<wbr>
            range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
        } else {
            // 内容为空
            range.setStart(wbrElement.parentElement, 0);
        }
    } else {
        if (wbrElement.previousElementSibling.isEqualNode(wbrElement.previousSibling)) {
            if (wbrElement.previousElementSibling.lastChild) {
                // <em>text</em><wbr>
                range.setStartBefore(wbrElement);
                range.collapse(true);
                setSelectionFocus(range);
                // fix Chrome set range bug: **c**
                if (isChrome() && (wbrElement.previousElementSibling.tagName === "EM" ||
                    wbrElement.previousElementSibling.tagName === "STRONG" ||
                    wbrElement.previousElementSibling.tagName === "S")) {
                    range.insertNode(document.createTextNode(Constants.ZWSP));
                    range.collapse(false);
                }
                wbrElement.remove();
                return;
            } else {
                // <br><wbr>
                range.setStartAfter(wbrElement.previousElementSibling);
            }
        } else {
            // <em>text</em>text<wbr>
            range.setStart(wbrElement.previousSibling, wbrElement.previousSibling.textContent.length);
        }
    }
    range.collapse(true);
    wbrElement.remove();
    setSelectionFocus(range);
};

export const insertHTML = (html: string, vditor: IVditor) => {
    // 使用 lute 方法会添加 p 元素，只有一个 p 元素的时候进行删除
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const pElements = tempElement.querySelectorAll("p");
    if (pElements.length === 1 && !pElements[0].previousSibling && !pElements[0].nextSibling) {
        if ((vditor.currentMode === "wysiwyg" && vditor.wysiwyg.element.children.length > 0) ||
            (vditor.currentMode === "ir" && vditor.ir.element.children.length > 0)) {
            // empty and past
            html = pElements[0].innerHTML.trim();
        }
    }

    const pasteElement = document.createElement("template");
    pasteElement.innerHTML = html;

    const range = getSelection().getRangeAt(0);
    if (range.toString() !== "") {
        if (vditor.currentMode === "wysiwyg") {
            vditor.wysiwyg.preventInput = true;
        } else if (vditor.currentMode === "ir") {
            vditor.ir.preventInput = true;
        }
        document.execCommand("delete", false, "");
    }
    range.insertNode(pasteElement.content.cloneNode(true));
    range.collapse(false);
};
