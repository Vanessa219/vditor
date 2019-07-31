import {getSelectText} from "./getSelectText";
import {selectIsEditor} from "./selectIsEditor";
import {setSelectionFocus} from "./setSelection";

export const quickInsertText = (text: string) => {
    // 当前焦点在编辑器中，不需要 toggle， 不需要光标移动，没有前缀后缀之分时使用
    const html = text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    document.execCommand("insertHTML", false, html);
};

const moveForward = (position: number, container: Node, offset: number) => {
    let currentContainer = container;
    let currentOffset = offset;
    while (position !== 0 && currentContainer) {
        if (currentContainer.nodeType === 3) {
            if (currentOffset !== 0 && currentContainer.textContent !== "") {
                currentOffset--;
                position--;
            } else {
                currentContainer = currentContainer.previousSibling;
                currentOffset = currentContainer.textContent.length;
                position--;
            }
        } else if (currentContainer.nodeName === "BR") {
            currentContainer = currentContainer.previousSibling;
            currentOffset = currentContainer.textContent.length;
            if (currentContainer.nodeType !== 3) {
                position--;
            }
        } else {
            currentContainer = container.childNodes[offset - 1];
            currentOffset = currentContainer.textContent.length;
            position--;
        }
    }
    return {
        container: currentContainer,
        offset: currentOffset
    }

};

const moveStartForward = (position: number, range: Range, editor: HTMLDivElement) => {
    const result = moveForward(position, range.startContainer, range.startOffset)
    if (result.container.nodeName === "BR") {
        range.setStartBefore(result.container);
    } else if (!result.container) {
        range.setStartBefore(editor.childNodes[0]);
    } else {
        range.setStart(result.container, result.offset);
    }
}

const moveEndForward = (position: number, range: Range, editor: HTMLDivElement) => {
    const result = moveForward(position, range.endContainer, range.endOffset)
    if (result.container.nodeName === "BR") {
        range.setEndBefore(result.container);
    } else if (!result.container) {
        range.setEndBefore(editor.childNodes[0]);
    } else {
        range.setEnd(result.container, result.offset);
    }
}

const moveEndCursor = (range: Range, endOffset: number, editor: HTMLDivElement) => {
    let rangeEndNode = range.endContainer;
    let rangeEndOffset = range.endOffset;
    while (endOffset !== 0 && rangeEndNode) {
        if (rangeEndNode.nodeType === 3) {
            if (rangeEndOffset !== 0 && rangeEndNode.textContent !== "") {
                rangeEndOffset--;
                endOffset--;
            } else {
                rangeEndNode = rangeEndNode.previousSibling;
                rangeEndOffset = 0;
                endOffset--;
            }
        } else if (rangeEndNode.nodeName === "BR") {
            rangeEndNode = rangeEndNode.previousSibling;
            rangeEndOffset = rangeEndNode.textContent.length;
            if (rangeEndNode.nodeType !== 3) {
                endOffset--;
            }
        } else {
            rangeEndNode = range.endContainer.childNodes[range.endOffset - 1];
            rangeEndOffset = rangeEndNode.textContent.length;
            endOffset--;
        }
    }
    if (rangeEndNode.nodeName === "BR") {
        range.setEndBefore(rangeEndNode);
    } else if (!rangeEndNode) {
        range.setEndBefore(editor.childNodes[0]);
    } else {
        range.setEnd(rangeEndNode, rangeEndOffset);
    }
};

// toolbar emoji, heading, bold, inline code, ordered list, quote, italic, link, strike, list, line, check, code, table
// and insert/update/deleteValue method
export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false,
                           toggle: boolean = false) => {
    let range: Range = window.getSelection().getRangeAt(0);
    if (!selectIsEditor(range, vditor.editor.element)) {
        if (vditor.editor.range) {
            range = vditor.editor.range;
        } else {
            vditor.editor.element.focus();
            range = window.getSelection().getRangeAt(0);
        }
    }
    setSelectionFocus(range);

    if (range.collapsed || (!range.collapsed && replace)) {
        // select none and then use toolbar or method || select something and then ues method or use table
        const text = prefix + suffix;
        quickInsertText(text);
        range = window.getSelection().getRangeAt(0);
        if (suffix) {
            // toolbar has suffix: bold, inline code, italic, link, strike, code, table
            moveStartForward(suffix.length, range, vditor.editor.element);
            range.collapse(true);
            setSelectionFocus(range);
        }
    } else {
        // keep selection:
        // heading, bold, inline code, ordered list, quote, italic, link, strike, list, line, check, code
        const selectText = getSelectText(range, vditor.editor.element);

        // const selectionCaret = getSelectionPosition(vditor.editor.element, range);
        // const editorText = vditor.editor.element.textContent;
        // if (editorText.substring(selectionCaret.start - getTextLength(prefix), selectionCaret.start) ===
        //     prefix.replace(/\n/g, "") &&
        //     editorText.substring(selectionCaret.end, selectionCaret.end + getTextLength(suffix)) ===
        //     suffix.replace(/\n/g, "") && toggle) {
        //     // for toolbar restore
        //     selectionCaret.start -= getTextLength(prefix);
        //     selectionCaret.end += getTextLength(suffix);
        //     prefix = suffix = "";
        // }

        quickInsertText(prefix + selectText + suffix);
        range = window.getSelection().getRangeAt(0);
        moveStartForward((selectText + suffix).length, range, vditor.editor.element);
        moveEndForward(suffix.length, range, vditor.editor.element);
        setSelectionFocus(range);
    }
};
