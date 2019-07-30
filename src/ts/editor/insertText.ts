import {inputEvent} from "./inputEvent";

const addNode = (html: string, range: Range) => {
    html = html.replace(/\n/g, '<br>')
    document.execCommand("insertHTML", false, html);
};

const saveSelection = (editorElement: HTMLDivElement, range: Range) => {
    const lastRange = range.cloneRange();
    lastRange.selectNodeContents(editorElement);
    lastRange.setEnd(range.startContainer, range.startOffset);
    const start = lastRange.toString().length;

    return {
        start: start,
        end: start + range.toString().length
    }
};

const setSelection = function (editorElement: HTMLDivElement, selectionCaret: { start: number, end: number }) {
    let charIndex = 0
    const range = document.createRange();
    range.setStart(editorElement, 0);
    range.collapse(true);
    const nodeStack = [editorElement as ChildNode]
    let node: ChildNode
    let foundStart = false
    let stop = false;

    while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
            let nextCharIndex = charIndex + node.textContent.length;
            if (!foundStart && selectionCaret.start >= charIndex && selectionCaret.start <= nextCharIndex) {
                range.setStart(node, selectionCaret.start - charIndex);
                foundStart = true;
            }
            if (foundStart && selectionCaret.end >= charIndex && selectionCaret.end <= nextCharIndex) {
                range.setEnd(node, selectionCaret.end - charIndex);
                stop = true;
            }
            charIndex = nextCharIndex;
        } else {
            let i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

const getTextLength = (value: string) => {
    return value.replace(/\n/g, '').length
}

export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false,
                           toggle: boolean = false, range: Range = window.getSelection().getRangeAt(0)) => {
    if (range.collapsed || (!range.collapsed && replace)) {
        // select none or replace selection
        const selectionCaret = saveSelection(vditor.editor.element, range)
        setSelection(vditor.editor.element, selectionCaret)
        addNode(prefix + suffix, range)
        if (suffix) {
            const caretStart = selectionCaret.start + getTextLength(prefix)
            setSelection(vditor.editor.element, {
                start: caretStart,
                end: caretStart
            })
        }
    } else {
        // keep selection, for toolbar and insertValue method and new line
        let selectHTML: string = ''
        const selectContents = range.cloneContents()
        Array.from(selectContents.childNodes).forEach((child: HTMLElement) => {
            if (child.nodeType === 3) {
                selectHTML += child.textContent
            } else {
                selectHTML += child.outerHTML
            }
        })
        const selectionCaret = saveSelection(vditor.editor.element, range)
        const editorText = vditor.editor.element.textContent;
        if (editorText.substring(selectionCaret.start - getTextLength(prefix), selectionCaret.start) === prefix.replace(/\n/g, '') &&
            editorText.substring(selectionCaret.end, selectionCaret.end + getTextLength(suffix)) === suffix.replace(/\n/g, '') && toggle) {
            // for toolbar restore
            selectionCaret.start -= getTextLength(prefix)
            selectionCaret.end += getTextLength(suffix);
            prefix = suffix = ''
        }
        // insert
        setSelection(vditor.editor.element, selectionCaret)
        addNode(prefix + selectHTML + suffix, range)
    }
    inputEvent(vditor);
};
