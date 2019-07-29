import {inputEvent} from "./inputEvent";

const addNode = (text: string, range: Range) => {
    text = text.replace(/\n/g, '<br>')
    const element = document.createElement("div");
    element.innerHTML = text;
    const fragment = document.createDocumentFragment()
    let appendNode
    while ((appendNode = element.firstChild)) {
        fragment.appendChild(appendNode);
    }
    range.insertNode(fragment);
    return fragment
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

export const insertText = (vditor: IVditor, prefix: string, suffix: string, replace: boolean = false,
                           toggle: boolean = true, range: Range = window.getSelection().getRangeAt(0)) => {
    if (range.collapsed) {
        // no selection
        const selectionCaret = saveSelection(vditor.editor.element, range)
        addNode(prefix + suffix, range)
        selectionCaret.start = selectionCaret.end = selectionCaret.start + (prefix + suffix).length
        setSelection(vditor.editor.element, selectionCaret)
    } else {
        if (replace) {
            const selectionCaret = saveSelection(vditor.editor.element, range)
            range.deleteContents();
            addNode(prefix + suffix, range)
            selectionCaret.start = selectionCaret.end = selectionCaret.start + (prefix + suffix).length
            setSelection(vditor.editor.element, selectionCaret)
        } else {
            const selectDom = range.commonAncestorContainer.textContent;
            const selectString = range.toString();
            if (selectDom.substring(range.startOffset - prefix.length, range.startOffset) === prefix &&
                selectDom.substring(range.endOffset, range.endOffset + suffix.length) === suffix && toggle) {
                range.setStart(range.startContainer, range.startOffset - prefix.length);
                range.setEnd(range.endContainer, range.endOffset + suffix.length);
                const selectionCaret = saveSelection(vditor.editor.element, range)
                range.deleteContents();
                addNode(selectString, range)
                selectionCaret.end = selectionCaret.start + selectString.length
                setSelection(vditor.editor.element, selectionCaret)
            } else {
                // insert
                const selectionCaret = saveSelection(vditor.editor.element, range)
                range.deleteContents();
                addNode(prefix + selectString + suffix, range)
                selectionCaret.start += prefix.length
                selectionCaret.end = selectionCaret.start + selectString.length
                setSelection(vditor.editor.element, selectionCaret)
            }
        }
    }
    inputEvent(vditor);
};
