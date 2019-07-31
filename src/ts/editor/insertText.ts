import {getSelectText} from "./getSelectText";
import {selectIsEditor} from "./selectIsEditor";
import {setSelectionFocus} from "./setSelection";

export const quickInsertText = (text: string) => {
    // 当前焦点在编辑器中，不需要 toggle， 不需要光标移动，没有前缀后缀之分时使用
    const html = text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    document.execCommand("insertHTML", false, html);
};

const code160to32 = (text: string) => {
    return text.replace(/ /g, " ");
};

const getContainerLength = (container: Node) => {
    let length = 0;
    if (container && container.textContent) {
        length = container.textContent.length;
    }
    return length;
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
                currentOffset = getContainerLength(currentContainer);
                position--;
            }
        } else if (currentContainer.nodeName === "BR") {
            currentContainer = currentContainer.previousSibling;
            currentOffset = getContainerLength(currentContainer);
            if (currentContainer && currentContainer.nodeType !== 3) {
                position--;
            }
        } else {
            currentContainer = container.childNodes[offset - 1];
            currentOffset = getContainerLength(currentContainer);
            position--;
        }
    }
    return {
        container: currentContainer,
        offset: currentOffset,
    };
};

const moveStartForward = (position: number, range: Range, editor: HTMLDivElement) => {
    const result = moveForward(position, range.startContainer, range.startOffset);
    if (!result.container) {
        if (editor.childNodes.length > 0) {
            range.setStartBefore(editor.childNodes[0]);
        }
    } else if (result.container.nodeName === "BR") {
        range.setStartBefore(result.container);
    } else {
        range.setStart(result.container, result.offset);
    }
};

const moveEndForward = (position: number, range: Range, editor: HTMLDivElement) => {
    const result = moveForward(position, range.endContainer, range.endOffset);
    if (!result.container) {
        if (editor.childNodes.length > 0) {
            range.setEndBefore(editor.childNodes[0]);
        }
    } else if (result.container.nodeName === "BR") {
        range.setEndBefore(result.container);
    } else {
        range.setEnd(result.container, result.offset);
    }
};

const moveBack = (position: number, container: Node, offset: number) => {
    let currentContainer = container;
    let currentOffset = offset;
    while (position !== 0 && currentContainer) {
        if (currentContainer.nodeType === 3) {
            if (currentOffset !== currentContainer.textContent.length && currentContainer.textContent !== "") {
                currentOffset++;
                position--;
            } else {
                currentContainer = currentContainer.nextSibling;
                currentOffset = 0;
                position--;
            }
        } else if (currentContainer.nodeName === "BR") {
            currentContainer = currentContainer.nextSibling;
            currentOffset = 0;
            if (currentContainer && currentContainer.nodeType !== 3) {
                position--;
            }
        } else {
            currentContainer = container.childNodes[offset];
            currentOffset = 0;
            position--;
        }
    }
    return {
        container: currentContainer,
        offset: currentOffset,
    };
};

const moveEndBack = (position: number, range: Range, editor: HTMLDivElement) => {
    const result = moveBack(position, range.endContainer, range.endOffset);
    if (!result.container) {
        if (editor.childNodes.length > 0) {
            range.setEndBefore(editor.lastChild);
        }
    } else if (result.container.nodeName === "BR") {
        range.setEndAfter(result.container);
    } else {
        range.setEnd(result.container, result.offset);
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

        if (toggle) {
            let prefixMatch = false;
            let suffixMatch = false;
            if (range.startContainer.nodeType === 3) {
                if (prefix.lastIndexOf("\n") > -1 && range.startContainer.previousSibling &&
                    range.startContainer.previousSibling.previousSibling) { // TODO just for code
                    const textContent = range.startContainer.previousSibling.previousSibling.textContent;
                    if (range.startContainer.previousSibling.nodeName === "BR" &&
                        textContent.substring(textContent.length - 3) === "```") {
                        prefixMatch = true;
                    }
                }
                if (code160to32(range.startContainer.textContent
                    .substring(range.startOffset - prefix.length, range.startOffset)) === prefix) {
                    prefixMatch = true;
                }
            } else {
                if (prefix.lastIndexOf("\n") > -1 && range.startContainer.childNodes[range.startOffset - 1] &&
                    range.startContainer.childNodes[range.startOffset - 2]) { // TODO just for code
                    const textContent2 = range.startContainer.childNodes[range.startOffset - 2].textContent;
                    if (range.startContainer.childNodes[range.startOffset - 1].nodeName === "BR" &&
                        textContent2.substring(textContent2.length - 3) === "```") {
                        prefixMatch = true;
                    }
                }
                const startText =
                    range.startContainer.childNodes[Math.max(0, range.startOffset - 1)].textContent;
                if (code160to32(startText.substring(startText.length - suffix.length)) === prefix) {
                    prefixMatch = true;
                }
            }

            if (range.endContainer.nodeType === 3) {
                if (suffix.lastIndexOf("\n") > -1 && range.endContainer.nextSibling &&
                    range.endContainer.nextSibling.nextSibling) { // TODO just for code
                    const textContent3 = range.endContainer.nextSibling.nextSibling.textContent;
                    if (range.endContainer.nextSibling.nodeName === "BR" &&
                        textContent3.substring(0, 3) === "```") {
                        suffixMatch = true;
                    }
                }
                if (code160to32(range.endContainer.textContent
                    .substring(range.endOffset, range.endOffset + suffix.length)) === suffix) {
                    suffixMatch = true;
                }
            } else {
                if (suffix.lastIndexOf("\n") > -1 && range.endContainer.childNodes[range.endOffset] &&
                    range.endContainer.childNodes[range.endOffset + 1]) { // TODO just for code
                    const textContent4 = range.endContainer.childNodes[range.endOffset + 1].textContent;
                    if (range.endContainer.childNodes[range.endOffset].nodeName === "BR" &&
                        textContent4.substring(textContent4.length - 3) === "```") {
                        suffixMatch = true;
                    }
                }
                const endText = range.endContainer.childNodes[range.endOffset].textContent;
                if (code160to32(endText.substring(0, suffix.length)) === suffix) {
                    suffixMatch = true;
                }
            }

            if (prefixMatch && suffixMatch) {
                moveStartForward(prefix.length, range, vditor.editor.element);
                moveEndBack(suffix.length, range, vditor.editor.element);
                prefix = suffix = "";
            }
        }

        quickInsertText(prefix + selectText + suffix);
        range = window.getSelection().getRangeAt(0);
        moveStartForward((selectText + suffix).length, range, vditor.editor.element);
        moveEndForward(suffix.length, range, vditor.editor.element);
        setSelectionFocus(range);
    }
};
